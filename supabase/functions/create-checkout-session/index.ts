import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-11-20.acacia',
})

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
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header manquant')
    }

    // Créer client Supabase avec le token de l'utilisateur
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Récupérer l'utilisateur authentifié
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Utilisateur non authentifié')
    }

    console.log('User authenticated:', user.id, user.email)

    // Récupérer les paramètres
    const { planName, billingPeriod } = await req.json()
    
    if (!planName || !billingPeriod) {
      throw new Error('planName et billingPeriod sont requis')
    }

    if (!['BASIC', 'LIVE'].includes(planName)) {
      throw new Error('Plan invalide. Doit être BASIC ou LIVE')
    }

    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      throw new Error('Période invalide. Doit être monthly ou yearly')
    }

    console.log('Creating checkout for:', { planName, billingPeriod })

    // Récupérer le price_id depuis la config
    const { data: priceConfig, error: priceError } = await supabaseClient
      .from('stripe_prices')
      .select('*')
      .eq('plan_name', planName)
      .single()

    if (priceError || !priceConfig) {
      console.error('Price config error:', priceError)
      throw new Error('Configuration de prix non trouvée')
    }

    const priceId = billingPeriod === 'monthly' 
      ? priceConfig.monthly_price_id 
      : priceConfig.yearly_price_id

    console.log('Using price ID:', priceId)

    // Client Supabase avec service role pour accéder aux subscriptions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Vérifier si l'utilisateur a déjà un customer Stripe
    const { data: existingSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let customerId = existingSubscription?.stripe_customer_id

    // Créer un customer Stripe si nécessaire
    if (!customerId) {
      console.log('Creating new Stripe customer for:', user.email)
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      })
      customerId = customer.id
      console.log('Created Stripe customer:', customerId)
    } else {
      console.log('Using existing Stripe customer:', customerId)
    }

    // Créer la session Checkout
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
    
    const session = await stripe.checkout.sessions.create({
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

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-checkout-session:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
