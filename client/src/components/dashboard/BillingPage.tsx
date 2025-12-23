import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { CheckCheck, Loader2, AlertCircle, CreditCard, ExternalLink, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createCheckoutSession, createPortalSession } from '@/lib/stripe'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/contexts/AuthContext'

type BillingPeriod = 'monthly' | 'yearly'

// Configuration des prix
const PRICING = {
  BASIC: { monthly: 49, yearly: 470 },
  LIVE: { monthly: 79, yearly: 758 },
}

// Pricing Switch Component
const PricingSwitch = ({
  onSwitch,
  className,
  selectedValue,
}: {
  onSwitch: (value: string) => void;
  className?: string;
  selectedValue: string;
}) => {
  const handleSwitch = (value: string) => {
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-lg sm:rounded-xl bg-gray-800 border border-gray-700 p-0.5 sm:p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 font-medium transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base",
            selectedValue === "0"
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {selectedValue === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-8 sm:h-10 md:h-12 w-full rounded-lg sm:rounded-xl border-2 sm:border-4 shadow-sm shadow-orange-600 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative whitespace-nowrap">Facturation mensuelle</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-8 sm:h-10 md:h-12 flex-shrink-0 rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 font-medium transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base",
            selectedValue === "1"
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {selectedValue === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-8 sm:h-10 md:h-12 w-full rounded-lg sm:rounded-xl border-2 sm:border-4 shadow-sm shadow-orange-600 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <span className="whitespace-nowrap">Facturation annuelle</span>
            <span className="rounded-full bg-orange-500/20 px-1 sm:px-1.5 md:px-2 py-0.5 text-[8px] sm:text-[10px] md:text-xs font-medium text-white border border-orange-500/50 whitespace-nowrap">
              Économisez 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

// Animated Price Component
const AnimatedPrice = ({ price, isYearly }: { price: number; isYearly: boolean }) => {
  const [displayPrice, setDisplayPrice] = useState(price);

  useEffect(() => {
    if (displayPrice !== price) {
      const startPrice = displayPrice;
      const endPrice = price;
      const difference = endPrice - startPrice;
      const steps = Math.min(40, Math.abs(difference) * 2);
      const stepValue = difference / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const newPrice = Math.round(startPrice + stepValue * currentStep);
        setDisplayPrice(newPrice);

        if (currentStep >= steps) {
          setDisplayPrice(endPrice);
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [price, displayPrice]);

  return (
    <span className="text-3xl sm:text-4xl font-semibold text-white inline-block">
      {displayPrice}€
    </span>
  );
};

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

  const isYearly = billingPeriod === 'yearly'
  const pricingSwitchValue = isYearly ? "1" : "0"

  // Gérer les messages de redirection (depuis PlanProtectedRoute)
  useEffect(() => {
    const state = location.state as { message?: string } | null
    if (state?.message) {
      setError(state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Gérer les paramètres URL de retour Stripe
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('🎉 Paiement réussi ! Votre abonnement est maintenant actif.')
      setError(null)
      refresh()
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

  const togglePricingPeriod = (value: string) => {
    setBillingPeriod(Number.parseInt(value) === 1 ? 'yearly' : 'monthly')
  }

  const plans = [
    {
      name: "BASIC",
      description: "Pour ceux qui veulent montrer.",
      price: PRICING.BASIC.monthly,
      yearlyPrice: PRICING.BASIC.yearly,
      buttonText: "Activer Basic",
      buttonVariant: "outline" as const,
      includes: [
        "Inclus dans ce plan:",
        "Création de dashboards illimitée",
        "Exports HD sans watermark",
        "1 template de plateforme au choix",
        "Génération instantanée",
        "Sans code, sans installation",
      ],
    },
    {
      name: "LIVE",
      description: "Pour ceux qui veulent déclencher l'achat en temps réel.",
      price: PRICING.LIVE.monthly,
      yearlyPrice: PRICING.LIVE.yearly,
      buttonText: "Activer Live",
      buttonVariant: "default" as const,
      popular: true,
      includes: [
        "Inclus dans ce plan:",
        "Plan Proofy Basic inclus",
        "Notifications de ventes en direct sur écran verrouillé",
        "Accès à tous les templates de plateformes",
        "Support prioritaire",
      ],
    },
  ]

  // Affichage pendant le chargement
  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20">
      {/* Titre centré */}
      <h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-4 sm:px-6 leading-tight mb-6 sm:mb-8 md:mb-10 relative z-10"
        style={{
          letterSpacing: "-0.05em"
        }}
      >
        <span
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {isActive ? `Vous êtes sur le plan ${planName}` : 'Passe à l\'action'}
        </span>
      </h2>

      <article className="text-center mb-6 space-y-4 max-w-2xl mx-auto relative z-10">
        <p className="md:text-base text-sm text-gray-400 mx-auto">
          {isActive 
            ? 'Gérez votre abonnement ou changez de plan'
            : 'Choisis l\'offre qui te permet de montrer tes résultats et d\'accélérer tes ventes.'
          }
        </p>

        <PricingSwitch 
          onSwitch={togglePricingPeriod} 
          className="w-fit mx-auto" 
          selectedValue={pricingSwitchValue}
        />
      </article>

      {/* Message de succès */}
      {successMessage && (
        <div className="mb-6 max-w-4xl mx-auto p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-green-400 hover:text-green-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 max-w-4xl mx-auto p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cartes des plans */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 py-6 relative z-10 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const isCurrentPlan = planName === plan.name
          const isHigherPlan = (planName === 'LIVE' && plan.name === 'BASIC')
          
          return (
            <Card
              key={plan.name}
              className={cn(
                "relative border h-full flex flex-col",
                plan.popular
                  ? "ring-2 ring-orange-500 bg-gray-900/50 border-orange-500/30"
                  : "bg-gray-900/50 border-gray-800",
                isCurrentPlan && "ring-2 ring-orange-500 border-orange-500/50"
              )}
            >
              {plan.popular && !isCurrentPlan && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                  <span className="bg-orange-500 text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium">
                    Populaire
                  </span>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Plan actuel
                  </span>
                </div>
              )}

              <CardHeader className="text-left p-2 sm:p-4 md:p-6">
                <div>
                  <h3 className="text-xs sm:text-lg md:text-2xl xl:text-3xl font-semibold text-white mb-1 sm:mb-2 leading-tight">
                    PROOFY {plan.name}
                  </h3>
                </div>
                <div className="flex items-baseline">
                  <AnimatedPrice 
                    price={isYearly ? plan.yearlyPrice : plan.price} 
                    isYearly={isYearly}
                  />
                  <span className="text-gray-400 ml-1 text-[10px] sm:text-sm md:text-base">
                    /{isYearly ? "an" : "mois"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 p-2 sm:p-4 md:p-6 flex-1 flex flex-col">
                <motion.button
                  onClick={() => {
                    if (isCurrentPlan) {
                      handleManageSubscription()
                    } else if (!isHigherPlan) {
                      handleSubscribe(plan.name as 'BASIC' | 'LIVE')
                    }
                  }}
                  disabled={loadingPlan === plan.name || loadingPortal || isHigherPlan}
                  className={cn(
                    "w-full mb-3 sm:mb-6 p-2 sm:p-3 md:p-4 text-xs sm:text-base md:text-lg lg:text-xl rounded-lg sm:rounded-xl relative overflow-hidden transition-all duration-300",
                    (loadingPlan === plan.name || loadingPortal) ? "opacity-50 cursor-not-allowed" : "",
                    isCurrentPlan
                      ? "bg-gradient-to-t from-gray-800 to-gray-700 shadow-lg shadow-gray-900 border border-gray-700 text-white"
                      : isHigherPlan
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                        : plan.popular
                          ? "bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white"
                          : "bg-gradient-to-t from-gray-800 to-gray-700 shadow-lg shadow-gray-900 border border-gray-700 text-white"
                  )}
                  whileHover={!isHigherPlan && !loadingPlan && !loadingPortal ? { 
                    scale: 1.05,
                    boxShadow: plan.popular 
                      ? "0 20px 40px -12px rgba(255, 107, 53, 0.5)" 
                      : "0 20px 40px -12px rgba(0, 0, 0, 0.5)"
                  } : {}}
                  whileTap={!isHigherPlan && !loadingPlan && !loadingPortal ? { scale: 0.98 } : {}}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  {/* Shimmer effect */}
                  {!isHigherPlan && !loadingPlan && !loadingPortal && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loadingPlan === plan.name || (isCurrentPlan && loadingPortal) ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Chargement...</span>
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Gérer l'abonnement
                      </>
                    ) : isHigherPlan ? (
                      'Vous avez un plan supérieur'
                    ) : (
                      plan.buttonText
                    )}
                  </span>
                </motion.button>

                <div className="space-y-1.5 sm:space-y-3 pt-2 sm:pt-4 border-t border-gray-800 flex-1">
                  <h2 className="text-[10px] sm:text-sm md:text-lg lg:text-xl font-semibold uppercase text-white mb-1 sm:mb-3">
                    Fonctionnalités
                  </h2>
                  <h4 className="font-medium text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 mb-1 sm:mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 bg-gray-800 border border-orange-500 rounded-full grid place-content-center mt-0.5 mr-1.5 sm:mr-2 md:mr-3 flex-shrink-0">
                          <CheckCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-orange-500" />
                        </span>
                        <span className="text-[9px] sm:text-xs md:text-sm text-gray-300 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Détails de l'abonnement actuel */}
      {isActive && subscription && (
        <div className="mt-10 max-w-lg mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-white">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Détails de votre abonnement
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="font-medium text-white">{subscription.plan_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Facturation</span>
                <span className="font-medium text-white">
                  {subscription.billing_period === 'monthly' ? 'Mensuelle' : 'Annuelle'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Statut</span>
                <span className={`font-medium ${
                  subscription.status === 'active' ? 'text-green-400' : 
                  subscription.status === 'trialing' ? 'text-blue-400' :
                  'text-orange-400'
                }`}>
                  {subscription.status === 'active' ? 'Actif' :
                   subscription.status === 'trialing' ? 'Période d\'essai' :
                   subscription.status === 'past_due' ? 'Paiement en retard' :
                   subscription.status}
                </span>
              </div>
              
              {subscription.current_period_end && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Prochaine facturation</span>
                  <span className="font-medium text-white">
                    {new Date(subscription.current_period_end).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              {subscription.cancel_at_period_end && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-orange-400 text-sm">
                    ⚠️ Votre abonnement sera annulé à la fin de la période de facturation.
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="mt-6 w-full py-2 text-sm text-orange-500 hover:text-orange-400 flex items-center justify-center gap-1 disabled:opacity-50 border border-orange-500/30 rounded-lg hover:bg-orange-500/10 transition-colors"
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
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Vous utilisez actuellement la version gratuite.</p>
          <p>Passez à un plan payant pour débloquer toutes les fonctionnalités.</p>
        </div>
      )}
    </div>
  )
}

export default BillingPage
