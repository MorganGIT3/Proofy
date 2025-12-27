import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { createCheckoutSession } from '@/lib/stripe';
import { 
  Home,
  Puzzle,
  Link2,
  CreditCard,
  Settings,
  Bell,
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ChevronDown,
  AlertTriangle,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href: string;
  section?: 'main' | 'account';
  external?: boolean;
}

// Chrome Web Store URL for the Proofy Beacons Modifier extension
const CHROME_EXTENSION_URL = 'https://chromewebstore.google.com/detail/proofy-beacons-modifier/aidejglgojblhcicagillpkiciipfjha';

const mainNavigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Tableau de bord", icon: Home, href: "/dashboard", section: 'main' },
  { id: "extension", name: "Extension", icon: Puzzle, href: CHROME_EXTENSION_URL, section: 'main', external: true },
  { id: "connections", name: "Connexions d'extension", icon: Link2, href: "/dashboard/connections", section: 'main' },
  { id: "sales-notifications", name: "Sales Notifications", icon: Bell, href: "/dashboard/sales-notifications", section: 'main' },
];

const accountNavigationItems: NavigationItem[] = [
  { id: "billing", name: "Facturation", icon: CreditCard, href: "/dashboard/billing", section: 'account' },
  { id: "settings", name: "Paramètres", icon: Settings, href: "/dashboard/settings", section: 'account' },
];

// Animated Price Component
const AnimatedPrice = ({ price, isYearly, className }: { price: number; isYearly?: boolean; className?: string }) => {
  const [displayPrice, setDisplayPrice] = React.useState(price);

  React.useEffect(() => {
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
    <span className={className || "text-3xl sm:text-4xl font-semibold text-white inline-block"}>
      {displayPrice}€
    </span>
  );
};

// Pricing Switch Component
const PricingSwitch = ({
  onSwitch,
  isYearly,
  className,
}: {
  onSwitch: (value: boolean) => void;
  isYearly: boolean;
  className?: string;
}) => {
  const handleSwitch = (value: boolean) => {
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-lg sm:rounded-xl bg-gray-800 border border-gray-700 p-0.5 sm:p-1">
        <button
          onClick={() => handleSwitch(false)}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 font-medium transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base",
            !isYearly
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {!isYearly && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-8 sm:h-10 md:h-12 w-full rounded-lg sm:rounded-xl border-2 sm:border-4 shadow-sm shadow-orange-600 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative whitespace-nowrap">Facturation mensuelle</span>
        </button>
        <button
          onClick={() => handleSwitch(true)}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 font-medium transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base flex items-center gap-2",
            isYearly
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {isYearly && (
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

// Extension Subscription Modal Component
interface ExtensionSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallAnyway: () => void;
  onSubscribe: (plan: 'BASIC' | 'LIVE') => void;
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
  loadingPlan: 'BASIC' | 'LIVE' | null;
}

const ExtensionSubscriptionModal: React.FC<ExtensionSubscriptionModalProps> = (props) => {
  return (
    <SubscriptionModal
      {...props}
      title="L'extension ne fonctionnera pas"
      description="L'extension Chrome Proofy nécessite un abonnement Basic ou Live pour fonctionner."
      showInstallAnyway={true}
    />
  );
};

// Subscription Modal Component (reusable for extension and welcome)
interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallAnyway?: () => void;
  onSubscribe: (plan: 'BASIC' | 'LIVE') => void;
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
  loadingPlan: 'BASIC' | 'LIVE' | null;
  title?: string;
  description?: string;
  showInstallAnyway?: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onInstallAnyway,
  onSubscribe,
  isYearly,
  setIsYearly,
  loadingPlan,
  title = "L'extension ne fonctionnera pas",
  description = "L'extension Chrome Proofy nécessite un abonnement Basic ou Live pour fonctionner.",
  showInstallAnyway = true
}) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: "BASIC" as const,
      price: 49,
      yearlyPrice: 470,
      buttonText: "Activer Basic",
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

  return (
    <>
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ 
          animation: 'scaleIn 0.3s ease-out',
          background: 'transparent',
          pointerEvents: 'auto'
        }}
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-5xl my-8 overflow-visible"
          style={{
            background: 'transparent'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="relative" style={{ background: 'transparent' }}>
            {/* Icon/Message */}
            {title && (
              <>
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
                  {title}
                </h2>
                <p className="text-white/50 text-center text-sm mb-6 max-w-lg mx-auto">
                  {description}
                </p>
              </>
            )}

            {/* Pricing Section */}
            <div className="relative" style={{ background: 'transparent' }}>
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

              {/* Billing Toggle - Same as Landing Page */}
              <div className="flex justify-center mb-6">
                <PricingSwitch 
                  onSwitch={setIsYearly} 
                  isYearly={isYearly}
                  className="w-fit mx-auto"
                />
              </div>

              {/* Plans Grid with glassmorphism background - only behind cards */}
              <div 
                className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 py-6 px-4 rounded-xl relative z-10"
                style={{
                  background: 'rgba(20, 20, 25, 0.4)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 107, 53, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
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
                        onClick={() => onSubscribe(plan.name)}
                        disabled={loadingPlan === plan.name}
                        className={cn(
                          "w-full mb-3 sm:mb-6 p-2 sm:p-3 md:p-4 text-xs sm:text-base md:text-lg lg:text-xl rounded-lg sm:rounded-xl relative overflow-hidden transition-all duration-300",
                          loadingPlan === plan.name ? "opacity-50 cursor-not-allowed" : "",
                          plan.popular
                            ? "bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white"
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

            {/* Install Anyway Button */}
            {showInstallAnyway && onInstallAnyway && (
              <div className="pt-6 mt-6">
                <button
                  onClick={onInstallAnyway}
                  className="w-full py-3 rounded-lg font-medium text-white transition-all text-sm hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                  }}
                >
                  Installer l'extension quand même
                </button>
                <p className="text-center text-xs text-white/30 mt-2">
                  L'extension ne fonctionnera pas sans abonnement
                </p>
              </div>
            )}
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
    </>
  );
};

export const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  
  // Extension subscription modal state
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionModalIsYearly, setExtensionModalIsYearly] = useState(false);
  const [extensionModalLoadingPlan, setExtensionModalLoadingPlan] = useState<'BASIC' | 'LIVE' | null>(null);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      setActiveItem('dashboard');
    } else if (path === '/dashboard/extension') {
      setActiveItem('extension');
    } else if (path === '/dashboard/connections') {
      setActiveItem('connections');
    } else if (path === '/dashboard/sales-notifications') {
      setActiveItem('sales-notifications');
    } else if (path === '/dashboard/billing') {
      setActiveItem('billing');
    } else if (path === '/dashboard/settings') {
      setActiveItem('settings');
    }
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (item: NavigationItem) => {
    // Si c'est un lien externe (Extension)
    if (item.external) {
      // Vérifier si l'utilisateur a un abonnement actif
      if (!isPro && !subscriptionLoading) {
        // Pas d'abonnement, afficher le modal
        setShowExtensionModal(true);
        if (window.innerWidth < 768) {
          setIsOpen(false);
        }
        return;
      }
      
      // L'utilisateur a un abonnement, ouvrir dans un nouvel onglet
      window.open(item.href, '_blank', 'noopener,noreferrer');
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
      return;
    }
    
    setActiveItem(item.id);
    navigate(item.href);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Handler pour souscrire depuis le modal extension
  const handleExtensionSubscribe = async (plan: 'BASIC' | 'LIVE') => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setExtensionModalLoadingPlan(plan);
    
    try {
      const billingPeriod = extensionModalIsYearly ? 'yearly' : 'monthly';
      await createCheckoutSession(plan, billingPeriod);
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la session de paiement';
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setExtensionModalLoadingPlan(null);
    }
  };

  // Handler pour installer l'extension quand même (sans abonnement)
  const handleInstallExtensionAnyway = () => {
    setShowExtensionModal(false);
    window.open(CHROME_EXTENSION_URL, '_blank', 'noopener,noreferrer');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.length > 0 ? name[0].toUpperCase() : 'U';
  };

  // Utiliser le hook pour obtenir le VRAI plan
  const { planName, isLoading: subscriptionLoading, isPro } = useSubscription();

  const getSubscriptionBadge = () => {
    if (subscriptionLoading) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-700 text-gray-300 border border-gray-600">
          Chargement...
        </span>
      );
    }
    
    if (planName === 'LIVE') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 border border-orange-400">
          Proofy Live
        </span>
      );
    } else if (planName === 'BASIC') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white border border-white/20">
          Proofy Basic
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-700 text-gray-300 border border-gray-600">
          Proofy Free
        </span>
      );
    }
  };

  const renderNavItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <li key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`
            w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative
            ${isActive
              ? "bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-white shadow-lg shadow-orange-500/20 border-l-2 border-orange-500"
              : "text-gray-400 hover:text-white hover:bg-gray-800/30"
            }
            ${isCollapsed ? "justify-center px-2" : ""}
          `}
          title={isCollapsed ? item.name : undefined}
        >
          <div className="flex items-center justify-center min-w-[24px]">
            <Icon
              className={`
                h-5 w-5 flex-shrink-0
                ${isActive 
                  ? "text-orange-400" 
                  : "text-gray-500 group-hover:text-gray-300"
                }
              `}
            />
          </div>
          
          {!isCollapsed && (
            <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
              {item.name}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
              {item.name}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-800 rotate-45 border-l border-b border-gray-700" />
            </div>
          )}
        </button>
      </li>
    );
  };

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

      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900/80 shadow-lg border border-gray-800/50 md:hidden hover:bg-gray-800/80 transition-all duration-200 backdrop-blur-sm"
        aria-label="Basculer la barre latérale"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-white" /> : 
          <Menu className="h-5 w-5 text-white" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-black/80 backdrop-blur-md border-r border-orange-500/20 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:translate-x-0 md:fixed
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-orange-500/20 bg-black/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <img src="/favicon.png" alt="Proofy" className="h-9 w-9 object-contain rounded" />
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base">Proofy</span>
                <span className="text-xs text-gray-400">Tableau de bord</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 mx-auto">
              <img src="/favicon.png" alt="Proofy" className="h-9 w-9 object-contain rounded" />
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-gray-800/50 transition-all duration-200 text-gray-400 hover:text-orange-400"
            aria-label={isCollapsed ? "Développer la barre latérale" : "Réduire la barre latérale"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Main Navigation */}
          <ul className="space-y-0.5 mb-6">
            {mainNavigationItems.map(renderNavItem)}
          </ul>

          {/* Account Section */}
                    {!isCollapsed && (
            <div className="px-3 py-2 mb-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Compte
              </div>
                      </div>
                    )}
          <ul className="space-y-0.5">
            {accountNavigationItems.map(renderNavItem)}
          </ul>
        </nav>

        {/* Bottom section with logout */}
        <div className="mt-auto border-t border-orange-500/20 p-3">
            <button
              onClick={handleSignOut}
              className={`
                w-full flex items-center rounded-lg text-left transition-all duration-200 group
                text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20
                ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
              `}
              title={isCollapsed ? "Se déconnecter" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-300" />
              </div>
              
              {!isCollapsed && (
                <span className="text-sm">Se déconnecter</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                  Se déconnecter
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-800 rotate-45 border-l border-b border-gray-700" />
                </div>
              )}
            </button>
          </div>
        </div>

      {/* Header with Profile */}
      <header 
        className="fixed top-0 right-0 z-30 border-b border-orange-500/20 bg-black/80 backdrop-blur-md transition-all duration-300"
        style={{
          left: isMobile ? '0' : (isCollapsed ? '80px' : '256px'),
        }}
      >
        <div className="max-w-7xl mx-auto px-5 py-0 h-[81px] flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/50 border border-gray-800/50 hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30">
                  <span className="text-white font-medium text-xs">{getUserInitials()}</span>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-white font-medium leading-tight">{getUserDisplayName()}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getSubscriptionBadge()}
                  </div>
                </div>
                <div className="sm:hidden">
                  {getSubscriptionBadge()}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-gray-900/95 backdrop-blur-md border border-orange-500/20 shadow-lg shadow-orange-500/10"
              >
                <DropdownMenuItem
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center gap-2 text-white hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer focus:bg-orange-500/10 focus:text-orange-400"
                >
                  <Settings className="h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/dashboard/billing')}
                  className="flex items-center gap-2 text-white hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer focus:bg-orange-500/10 focus:text-orange-400"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Facturation</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-orange-500/20" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      </div>
      </header>

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300 ease-in-out min-h-screen pt-20
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
          ${isOpen ? "ml-0" : ""}
        `}
      >
        <Outlet />
      </div>

      {/* Extension Subscription Modal */}
      <ExtensionSubscriptionModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        onInstallAnyway={handleInstallExtensionAnyway}
        onSubscribe={handleExtensionSubscribe}
        isYearly={extensionModalIsYearly}
        setIsYearly={setExtensionModalIsYearly}
        loadingPlan={extensionModalLoadingPlan}
      />
    </div>
  );
};
