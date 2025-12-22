import { supabase } from './supabase'

export type PlanName = 'BASIC' | 'LIVE'
export type BillingPeriod = 'monthly' | 'yearly'

/**
 * Crée une session Stripe Checkout et redirige l'utilisateur
 */
export async function createCheckoutSession(
  planName: PlanName,
  billingPeriod: BillingPeriod
): Promise<void> {
  // Vérifier que l'utilisateur est connecté
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Vous devez être connecté pour souscrire à un abonnement')
  }

  console.log('Creating checkout session:', { planName, billingPeriod })

  // Appeler l'Edge Function
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { planName, billingPeriod }
  })

  if (error) {
    console.error('Checkout error:', error)
    throw new Error(error.message || 'Erreur lors de la création de la session de paiement')
  }

  if (!data?.url) {
    throw new Error('URL de paiement non reçue')
  }

  // Rediriger vers Stripe Checkout
  window.location.href = data.url
}

/**
 * Crée une session Stripe Customer Portal et redirige l'utilisateur
 */
export async function createPortalSession(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Vous devez être connecté')
  }

  console.log('Creating portal session')

  const { data, error } = await supabase.functions.invoke('create-portal-session', {})

  if (error) {
    console.error('Portal error:', error)
    throw new Error(error.message || 'Erreur lors de l\'ouverture du portail de gestion')
  }

  if (!data?.url) {
    throw new Error('URL du portail non reçue')
  }

  // Rediriger vers le Customer Portal
  window.location.href = data.url
}
