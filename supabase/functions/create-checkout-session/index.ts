import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Vérifier les variables d'environnement critiques
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY manquant')
      throw new Error('Configuration serveur: STRIPE_SECRET_KEY manquant')
    }
    if (!supabaseUrl) {
      console.error('SUPABASE_URL manquant')
      throw new Error('Configuration serveur: SUPABASE_URL manquant')
    }
    if (!supabaseAnonKey) {
      console.error('SUPABASE_ANON_KEY manquant')
      throw new Error('Configuration serveur: SUPABASE_ANON_KEY manquant')
    }
    if (!supabaseServiceRoleKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY manquant')
      throw new Error('Configuration serveur: SUPABASE_SERVICE_ROLE_KEY manquant')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })

    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization')
    console.log('Authorization header received:', {
      hasHeader: !!authHeader,
      headerLength: authHeader?.length,
      headerPrefix: authHeader?.substring(0, 30),
    })
    
    if (!authHeader) {
      console.error('Authorization header manquant')
      throw new Error('Authorization header manquant')
    }

    // Vérifier l'authentification via l'API REST de Supabase (plus fiable dans Edge Functions)
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': authHeader,
        'apikey': supabaseAnonKey,
      }
    })

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}))
      console.error('Auth API error:', {
        status: authResponse.status,
        statusText: authResponse.statusText,
        errorData
      })
      throw new Error(`Utilisateur non authentifié: ${errorData.message || 'Token invalide'}`)
    }

    const user = await authResponse.json()
    
    if (!user || !user.id) {
      console.error('Invalid user data from auth API:', user)
      throw new Error('Utilisateur non authentifié: Données utilisateur invalides')
    }

    console.log('User authenticated:', user.id, user.email)

    // Créer client Supabase pour les requêtes suivantes (avec service role pour certaines opérations)
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { 
            Authorization: authHeader,
            apikey: supabaseAnonKey
          }
        }
      }
    )

    // Récupérer les paramètres avec gestion d'erreur pour le parsing JSON
    let requestBody
    try {
      requestBody = await req.json()
    } catch (jsonError) {
      console.error('Erreur parsing JSON:', jsonError)
      throw new Error('Corps de requête JSON invalide')
    }

    const { planName, billingPeriod } = requestBody || {}
    
    console.log('Request body:', { planName, billingPeriod })
    
    if (!planName || !billingPeriod) {
      throw new Error(`Paramètres manquants: planName=${planName}, billingPeriod=${billingPeriod}`)
    }

    if (!['BASIC', 'LIVE'].includes(planName)) {
      throw new Error(`Plan invalide: ${planName}. Doit être BASIC ou LIVE`)
    }

    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      throw new Error(`Période invalide: ${billingPeriod}. Doit être monthly ou yearly`)
    }

    console.log('Creating checkout for:', { planName, billingPeriod })

    // Récupérer le price_id depuis la config
    const { data: priceConfig, error: priceError } = await supabaseClient
      .from('stripe_prices')
      .select('*')
      .eq('plan_name', planName)
      .single()

    if (priceError) {
      console.error('Price config error:', priceError)
      throw new Error(`Erreur récupération prix: ${priceError.message}`)
    }
    
    if (!priceConfig) {
      console.error('Price config not found for plan:', planName)
      throw new Error(`Configuration de prix non trouvée pour le plan: ${planName}`)
    }

    const priceId = billingPeriod === 'monthly' 
      ? priceConfig.monthly_price_id 
      : priceConfig.yearly_price_id

    if (!priceId) {
      console.error('Price ID manquant:', { planName, billingPeriod, priceConfig })
      throw new Error(`Price ID manquant pour ${planName} ${billingPeriod}`)
    }

    console.log('Using price ID:', priceId)

    // Client Supabase avec service role pour accéder aux subscriptions
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    )

    // Vérifier si l'utilisateur a déjà un customer Stripe
    const { data: existingSubscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (subError) {
      console.error('Error fetching subscription:', subError)
      // Ne pas bloquer, on peut créer un nouveau customer
    }

    let customerId = existingSubscription?.stripe_customer_id

    // Créer un customer Stripe si nécessaire
    if (!customerId) {
      console.log('Creating new Stripe customer for:', user.email)
      try {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: {
            supabase_user_id: user.id
          }
        })
        customerId = customer.id
        console.log('Created Stripe customer:', customerId)
      } catch (stripeError) {
        console.error('Stripe customer creation error:', stripeError)
        throw new Error(`Erreur création customer Stripe: ${stripeError.message}`)
      }
    } else {
      console.log('Using existing Stripe customer:', customerId)
    }

    // Créer la session Checkout
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
    
    console.log('Creating Stripe checkout session with:', {
      customer: customerId,
      price: priceId,
      siteUrl
    })

    let session
    try {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${siteUrl}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/dashboard/billing?canceled=true`,
        subscription_data: {
          metadata: {
            supabase_user_id: user.id,
            plan_name: planName,
            billing_period: billingPeriod
          }
        },
        metadata: {
          supabase_user_id: user.id,
          plan_name: planName,
          billing_period: billingPeriod
        },
        allow_promotion_codes: true,
      })
    } catch (stripeError) {
      console.error('Stripe checkout session creation error:', stripeError)
      throw new Error(`Erreur création session Stripe: ${stripeError.message}`)
    }

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne inconnue'
    const errorStack = error instanceof Error ? error.stack : String(error)
    
    console.error('Error in create-checkout-session:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    })
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.DENO_ENV === 'development' ? errorStack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
