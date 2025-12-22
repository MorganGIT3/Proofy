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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:9',message:'createCheckoutSession called',data:{planName,billingPeriod},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Vérifier que l'utilisateur est connecté
  const { data: { session } } = await supabase.auth.getSession()
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:15',message:'Session check',data:{hasSession:!!session,userId:session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  if (!session) {
    throw new Error('Vous devez être connecté pour souscrire à un abonnement')
  }

  console.log('Creating checkout session:', { planName, billingPeriod })

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:23',message:'Before invoke Edge Function',data:{functionName:'create-checkout-session',supabaseUrl:import.meta.env.VITE_SUPABASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Appeler l'Edge Function
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { planName, billingPeriod }
  })

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:28',message:'After invoke Edge Function',data:{hasError:!!error,errorMessage:error?.message,errorContext:error?.context,hasData:!!data,dataKeys:data?Object.keys(data):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  if (error) {
    console.error('Checkout error:', error)
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:32',message:'Error details',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack,fullError:JSON.stringify(error),errorContext:error.context},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // Essayer de récupérer le message d'erreur détaillé depuis la réponse
    let errorMessage = error.message || 'Erreur lors de la création de la session de paiement'
    
    // Si l'erreur contient des détails dans error.context, les utiliser
    if (error.context && typeof error.context === 'object') {
      const contextError = error.context as any
      if (contextError.error) {
        errorMessage = contextError.error
      } else if (contextError.message) {
        errorMessage = contextError.message
      }
    }
    
    throw new Error(errorMessage)
  }

  if (!data?.url) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:38',message:'No URL in response',data:{data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    throw new Error('URL de paiement non reçue')
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:42',message:'Redirecting to Stripe',data:{url:data.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion

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
