import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Check, Loader2, AlertCircle, CreditCard, ExternalLink, X } from 'lucide-react'
import { createCheckoutSession, createPortalSession } from '@/lib/stripe'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/contexts/AuthContext'

type BillingPeriod = 'monthly' | 'yearly'

// Configuration des prix (à adapter selon tes vrais prix)
const PRICING = {
  BASIC: { monthly: 9.99, yearly: 99.99 },
  LIVE: { monthly: 29.99, yearly: 299.99 }
}

// Configuration des fonctionnalités (à adapter)
const FEATURES = [
  { name: 'Dashboards', basic: '3', live: 'Illimité' },
  { name: 'Mises à jour', basic: 'Quotidiennes', live: 'Temps réel' },
  { name: 'Historique', basic: '30 jours', live: '1 an' },
  { name: 'Export données', basic: false, live: true },
  { name: 'API Access', basic: false, live: true },
  { name: 'Support prioritaire', basic: false, live: true },
]

export function BillingPage() {
  const { user } = useAuth()
  const location = useLocation()
  const { 
    subscription, 
    isLoading: subscriptionLoading, 
    planName, 
    isActive, 
    refresh 
  } = useSubscription()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<'BASIC' | 'LIVE' | null>(null)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Gérer les messages de redirection (depuis PlanProtectedRoute)
  useEffect(() => {
    const state = location.state as { message?: string } | null
    if (state?.message) {
      setError(state.message)
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Gérer les paramètres URL de retour Stripe
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('🎉 Paiement réussi ! Votre abonnement est maintenant actif.')
      setError(null)
      refresh()
      // Nettoyer l'URL
      setSearchParams({})
    }
    if (searchParams.get('canceled') === 'true') {
      setError('Le paiement a été annulé.')
      setSuccessMessage(null)
      setSearchParams({})
    }
  }, [searchParams, refresh, setSearchParams])

  // Handler pour souscrire
  const handleSubscribe = async (plan: 'BASIC' | 'LIVE') => {
    if (!user) {
      setError('Vous devez être connecté pour vous abonner.')
      return
    }

    setLoadingPlan(plan)
    setError(null)
    setSuccessMessage(null)

    try {
      await createCheckoutSession(plan, billingPeriod)
    } catch (err) {
      console.error('Subscription error:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoadingPlan(null)
    }
  }

  // Handler pour gérer l'abonnement (Customer Portal)
  const handleManageSubscription = async () => {
    setLoadingPortal(true)
    setError(null)

    try {
      await createPortalSession()
    } catch (err) {
      console.error('Portal error:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoadingPortal(false)
    }
  }

  // Affichage pendant le chargement
  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choisissez votre plan</h1>
        <p className="text-gray-600">
          {isActive 
            ? `Vous êtes actuellement sur le plan ${planName}`
            : 'Sélectionnez le plan qui correspond à vos besoins'
          }
        </p>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-green-700 hover:text-green-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Toggle mensuel/annuel */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annuel <span className="text-green-600 text-xs ml-1">-17%</span>
          </button>
        </div>
      </div>

      {/* Cartes des plans */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Plan BASIC */}
        <div className={`relative border rounded-xl p-6 transition-all ${
          planName === 'BASIC' 
            ? 'border-primary ring-2 ring-primary bg-primary/5' 
            : 'border-gray-200 hover:border-gray-300'
        }`}>
          {planName === 'BASIC' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                Plan actuel
              </span>
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-2">Basic</h2>
          <p className="text-gray-600 text-sm mb-4">Pour les particuliers</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">
              {PRICING.BASIC[billingPeriod]}€
            </span>
            <span className="text-gray-600">
              /{billingPeriod === 'monthly' ? 'mois' : 'an'}
            </span>
          </div>

          <ul className="space-y-3 mb-6">
            {FEATURES.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                {feature.basic !== false ? (
                  <>
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>
                      {feature.name}
                      {typeof feature.basic === 'string' && (
                        <span className="text-gray-500 ml-1">({feature.basic})</span>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-4 w-4 text-gray-300 flex-shrink-0">—</span>
                    <span className="text-gray-400">{feature.name}</span>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Boutons selon le statut */}
          {planName === 'BASIC' ? (
            <button
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPortal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Gérer l'abonnement
                </>
              )}
            </button>
          ) : planName === 'LIVE' ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
            >
              Vous avez un plan supérieur
            </button>
          ) : (
            <button
              onClick={() => handleSubscribe('BASIC')}
              disabled={loadingPlan !== null}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              {loadingPlan === 'BASIC' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Activer Basic'
              )}
            </button>
          )}
        </div>

        {/* Plan LIVE */}
        <div className={`relative border rounded-xl p-6 transition-all ${
          planName === 'LIVE' 
            ? 'border-purple-500 ring-2 ring-purple-500 bg-purple-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}>
          {planName === 'LIVE' ? (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Plan actuel
              </span>
            </div>
          ) : (
            <div className="absolute -top-3 right-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Populaire
              </span>
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-2">Live</h2>
          <p className="text-gray-600 text-sm mb-4">Pour les professionnels</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">
              {PRICING.LIVE[billingPeriod]}€
            </span>
            <span className="text-gray-600">
              /{billingPeriod === 'monthly' ? 'mois' : 'an'}
            </span>
          </div>

          <ul className="space-y-3 mb-6">
            {FEATURES.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>
                  {feature.name}
                  {typeof feature.live === 'string' && (
                    <span className="text-gray-500 ml-1">({feature.live})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {planName === 'LIVE' ? (
            <button
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="w-full py-3 px-4 border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPortal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Gérer l'abonnement
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleSubscribe('LIVE')}
              disabled={loadingPlan !== null}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              {loadingPlan === 'LIVE' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Activer Live'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Détails de l'abonnement actuel */}
      {isActive && subscription && (
        <div className="mt-10 max-w-lg mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              Détails de votre abonnement
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">{subscription.plan_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Facturation</span>
                <span className="font-medium">
                  {subscription.billing_period === 'monthly' ? 'Mensuelle' : 'Annuelle'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Statut</span>
                <span className={`font-medium ${
                  subscription.status === 'active' ? 'text-green-600' : 
                  subscription.status === 'trialing' ? 'text-blue-600' :
                  'text-orange-600'
                }`}>
                  {subscription.status === 'active' ? 'Actif' :
                   subscription.status === 'trialing' ? 'Période d\'essai' :
                   subscription.status === 'past_due' ? 'Paiement en retard' :
                   subscription.status}
                </span>
              </div>
              
              {subscription.current_period_end && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Prochaine facturation</span>
                  <span className="font-medium">
                    {new Date(subscription.current_period_end).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              {subscription.cancel_at_period_end && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-700 text-sm">
                    ⚠️ Votre abonnement sera annulé à la fin de la période de facturation.
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="mt-6 w-full py-2 text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {loadingPortal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Gérer mon abonnement sur Stripe
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Note pour utilisateurs FREE */}
      {planName === 'FREE' && (
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Vous utilisez actuellement la version gratuite.</p>
          <p>Passez à un plan payant pour débloquer toutes les fonctionnalités.</p>
        </div>
      )}
    </div>
  )
}

export default BillingPage
