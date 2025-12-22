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

  // Appeler l'Edge Function directement avec fetch pour capturer le body d'erreur
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:34',message:'Before fetch Edge Function',data:{supabaseUrl,hasAnonKey:!!supabaseAnonKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C2'})}).catch(()=>{});
  // #endregion
  
  const functionUrl = `${supabaseUrl}/functions/v1/create-checkout-session`
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:40',message:'Fetching Edge Function',data:{functionUrl,planName,billingPeriod},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': supabaseAnonKey
    },
    body: JSON.stringify({ planName, billingPeriod })
  })
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:52',message:'Response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D2'})}).catch(()=>{});
  // #endregion
  
  // Lire le body de la réponse (même en cas d'erreur)
  const responseText = await response.text()
  let responseBody: any = null
  
  try {
    responseBody = JSON.parse(responseText)
  } catch (parseError) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:62',message:'Failed to parse response',data:{responseText,parseError:parseError instanceof Error ? parseError.message : String(parseError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    throw new Error(`Réponse invalide de l'Edge Function: ${responseText}`)
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:68',message:'Response body parsed',data:{status:response.status,responseBody,hasError:!!responseBody.error,hasUrl:!!responseBody.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D3'})}).catch(()=>{});
  // #endregion
  
  // Vérifier si la réponse contient une erreur
  if (!response.ok || responseBody.error) {
    const errorMessage = responseBody.error || `Erreur ${response.status}: ${response.statusText}`
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:76',message:'Error in response',data:{status:response.status,statusText:response.statusText,errorMessage,responseBody,responseText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    console.error('Edge Function error:', {
      status: response.status,
      statusText: response.statusText,
      body: responseBody
    })
    
    throw new Error(errorMessage)
  }
  
  if (!responseBody?.url) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:90',message:'No URL in response',data:{responseBody},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    throw new Error('URL de paiement non reçue')
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripe.ts:95',message:'Redirecting to Stripe',data:{url:responseBody.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion

  // Rediriger vers Stripe Checkout
  window.location.href = responseBody.url
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
