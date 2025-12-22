import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-11-20.acacia',
})

// Client Supabase avec SERVICE_ROLE pour bypass RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    console.error('Missing stripe-signature header')
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  try {
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    
    // Vérifier la signature Stripe
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }
    
    console.log(`✅ Webhook received: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Processing checkout.session.completed:', session.id)
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          await upsertSubscription(subscription, session.metadata)
        }
        break
      }

      case 'customer.subscription.created': {
        console.log('Processing customer.subscription.created')
        const subscription = event.data.object as Stripe.Subscription
        await upsertSubscription(subscription)
        break
      }

      case 'customer.subscription.updated': {
        console.log('Processing customer.subscription.updated')
        const subscription = event.data.object as Stripe.Subscription
        await upsertSubscription(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        console.log('Processing customer.subscription.deleted')
        const subscription = event.data.object as Stripe.Subscription
        await markSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        console.log('Processing invoice.payment_succeeded')
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          await upsertSubscription(subscription)
        }
        break
      }

      case 'invoice.payment_failed': {
        console.log('Processing invoice.payment_failed')
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ 
              status: 'past_due',
              updated_at: new Date().toISOString() 
            })
            .eq('stripe_subscription_id', invoice.subscription)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(`Webhook Error: ${error.message}`, { status: 500 })
  }
})

// ============================================
// FONCTION : upsertSubscription
// Crée ou met à jour un abonnement dans Supabase
// ============================================
async function upsertSubscription(
  subscription: Stripe.Subscription,
  sessionMetadata?: Stripe.Metadata | null
) {
  try {
    // Récupérer l'ID utilisateur depuis les metadata
    const metadata = subscription.metadata || sessionMetadata || {}
    let userId = metadata.supabase_user_id
    
    // Si pas dans metadata, essayer de trouver via le customer
    if (!userId) {
      const customer = await stripe.customers.retrieve(subscription.customer as string)
      if (!customer.deleted) {
        userId = (customer as Stripe.Customer).metadata?.supabase_user_id
      }
    }

    if (!userId) {
      console.error('❌ No supabase_user_id found in metadata')
      return
    }

    console.log('Processing subscription for user:', userId)

    // Récupérer le product_id depuis l'abonnement
    const productId = subscription.items.data[0]?.price?.product as string
    
    // Trouver le plan_name correspondant au product_id
    const { data: priceConfig } = await supabase
      .from('stripe_prices')
      .select('plan_name')
      .eq('stripe_product_id', productId)
      .single()

    const planName = priceConfig?.plan_name || metadata.plan_name || null
    
    if (!planName) {
      console.error('❌ Could not determine plan_name for product:', productId)
    }
    
    // Déterminer la période de facturation
    const interval = subscription.items.data[0]?.price?.recurring?.interval
    const billingPeriod = interval === 'year' ? 'yearly' : 'monthly'

    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_product_id: productId,
      plan_name: planName,
      billing_period: billingPeriod,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    }

    console.log('Upserting subscription data:', JSON.stringify(subscriptionData, null, 2))

    const { error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('❌ Error upserting subscription:', error)
      throw error
    }

    console.log(`✅ Subscription ${subscription.id} upserted successfully for user ${userId}`)
    
  } catch (error) {
    console.error('❌ upsertSubscription error:', error)
    throw error
  }
}

// ============================================
// FONCTION : markSubscriptionCanceled
// Marque un abonnement comme annulé
// ============================================
async function markSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('❌ Error marking subscription as canceled:', error)
      throw error
    }

    console.log(`✅ Subscription ${subscription.id} marked as canceled`)
    
  } catch (error) {
    console.error('❌ markSubscriptionCanceled error:', error)
    throw error
  }
}
