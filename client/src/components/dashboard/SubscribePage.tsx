// #region agent log
fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubscribePage.tsx:imports-start',message:'Starting imports',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
// #endregion
import React, { useState, useEffect } from 'react';
// #region agent log
fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubscribePage.tsx:import-React',message:'React imported',data:{hasReact:!!React},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { createCheckoutSession } from '@/lib/stripe';
import { X, AlertTriangle, CheckCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
// #region agent log
fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubscribePage.tsx:import-motion',message:'Motion imported',data:{hasMotion:!!motion,hasMotionSpan:!!motion?.span},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// #region agent log
fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubscribePage.tsx:import-Card',message:'Card components imported',data:{hasCard:!!Card,hasCardHeader:!!CardHeader,hasCardContent:!!CardContent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
// #endregion
import { cn } from '@/lib/utils';
import { AnimatedPrice, PricingSwitch } from '@/components/shared/PricingComponents';
// #region agent log
fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubscribePage.tsx:imports-complete',message:'All imports completed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
// #endregion


export const SubscribePage: React.FC = () => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubscribePage.tsx:SubscribePage:entry',message:'SubscribePage component initializing',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<'BASIC' | 'LIVE' | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Show modal automatically if user has no subscription
  useEffect(() => {
    if (!subscriptionLoading && !isPro) {
      setShowModal(true);
    } else if (isPro) {
      // User has subscription, redirect to dashboard
      navigate('/dashboard');
    }
  }, [subscriptionLoading, isPro, navigate]);

  const plans = [
    {
      name: "BASIC" as const,
      price: 49,
      yearlyPrice: 470,
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
      name: "LIVE" as const,
      price: 79,
      yearlyPrice: 758,
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
  ];

  const handleActivatePlan = async (planName: 'BASIC' | 'LIVE') => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoadingPlan(planName);
    
    try {
      const billingPeriod = isYearly ? 'yearly' : 'monthly';
      await createCheckoutSession(planName, billingPeriod);
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la session de paiement';
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (!showModal) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
    >
      {/* Radial Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            width: "1200px",
            height: "1200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xl z-40"
        onClick={() => navigate('/dashboard')}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div 
          className="relative w-full max-w-6xl rounded-xl shadow-2xl my-8 overflow-hidden"
          style={{
            background: 'rgba(20, 20, 25, 0.5)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 107, 53, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Gradient overlay for depth */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(255, 107, 53, 0.06) 0%, transparent 60%)',
            }}
          />
          
          {/* Close Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="relative p-6 md:p-8">
            {/* Icon/Message */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 107, 53, 0.15)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  boxShadow: '0 0 20px rgba(255, 107, 53, 0.15)'
                }}
              >
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
              L'extension ne fonctionnera pas
            </h2>
            <p className="text-white/50 text-center text-sm mb-6 max-w-lg mx-auto">
              L'extension Chrome Proofy nécessite un abonnement <span className="text-orange-400 font-semibold">Basic</span> ou <span className="text-orange-400 font-semibold">Live</span> pour fonctionner.
            </p>

            {/* Pricing Section */}
            <div className="relative">
              <h3 
                className="text-2xl md:text-3xl font-medium text-center mb-4"
                style={{
                  background: "linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.6))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Passe à l'action
              </h3>
              <p className="text-gray-400 text-center text-sm mb-6">
                Choisis l'offre qui te permet de montrer tes résultats et d'accélérer tes ventes.
              </p>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-6">
                <PricingSwitch 
                  onSwitch={setIsYearly} 
                  isYearly={isYearly}
                  className="w-fit mx-auto"
                  layoutId="subscribe-pricing-switch"
                />
              </div>

              {/* Plans Grid - Same design as Landing Page */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 py-6 relative z-10">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={cn(
                      "relative border h-full flex flex-col",
                      plan.popular
                        ? "ring-2 ring-orange-500 bg-gray-900/50 border-orange-500/30"
                        : "bg-gray-900/50 border-gray-800"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <span className="bg-orange-500 text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium">
                          Populaire
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
                        onClick={() => handleActivatePlan(plan.name)}
                        disabled={loadingPlan === plan.name}
                        className={cn(
                          "w-full mb-3 sm:mb-6 p-2 sm:p-3 md:p-4 text-xs sm:text-base md:text-lg lg:text-xl rounded-lg sm:rounded-xl relative overflow-hidden transition-all duration-300",
                          loadingPlan === plan.name ? "opacity-50 cursor-not-allowed" : "",
                          plan.popular
                            ? "bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white"
                            : plan.buttonVariant === "outline"
                              ? "bg-gradient-to-t from-gray-800 to-gray-700 shadow-lg shadow-gray-900 border border-gray-700 text-white"
                              : "bg-gradient-to-t from-gray-800 to-gray-700 shadow-lg shadow-gray-900 border border-gray-700 text-white"
                        )}
                        whileHover={loadingPlan !== plan.name ? { 
                          scale: 1.05,
                          boxShadow: plan.popular 
                            ? "0 20px 40px -12px rgba(255, 107, 53, 0.5)" 
                            : "0 20px 40px -12px rgba(0, 0, 0, 0.5)"
                        } : {}}
                        whileTap={loadingPlan !== plan.name ? { scale: 0.98 } : {}}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 17 
                        }}
                      >
                        {/* Shimmer effect */}
                        {loadingPlan !== plan.name && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loadingPlan === plan.name ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Chargement...</span>
                            </>
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

