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
const AnimatedPrice = ({ price, className }: { price: number; className?: string }) => {
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
    <span className={className}>
      {displayPrice}€
    </span>
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

const ExtensionSubscriptionModal: React.FC<ExtensionSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onInstallAnyway,
  onSubscribe,
  isYearly,
  setIsYearly,
  loadingPlan
}) => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionSubscriptionModal:render',message:'Modal component rendered',data:{isOpen,willReturn:!isOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
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
      {/* Backdrop with strong blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xl z-50"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div 
          className="relative w-full max-w-xl rounded-xl shadow-2xl my-4 overflow-hidden"
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
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          {/* Content */}
          <div className="relative p-4 md:p-5">
            {/* Warning Message */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 107, 53, 0.15)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  boxShadow: '0 0 20px rgba(255, 107, 53, 0.15)'
                }}
              >
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            
            <h2 className="text-base md:text-lg font-bold text-white text-center mb-1">
              L'extension ne fonctionnera pas
            </h2>
            <p className="text-white/50 text-center text-xs mb-4 max-w-sm mx-auto">
              L'extension Chrome Proofy nécessite un abonnement <span className="text-orange-400 font-semibold">Basic</span> ou <span className="text-orange-400 font-semibold">Live</span> pour fonctionner.
            </p>

            {/* Pricing Section */}
            <div className="relative">
              <h3 
                className="text-lg md:text-xl font-medium text-center mb-2"
                style={{
                  background: "linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.6))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Passe à l'action
              </h3>
              <p className="text-white/40 text-center text-xs mb-3">
                Choisis l'offre qui te permet de montrer tes résultats.
              </p>

              {/* Billing Toggle - Glassmorphism */}
              <div className="flex justify-center mb-4">
                <div 
                  className="relative z-10 flex w-fit rounded-lg p-0.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <button
                    onClick={() => setIsYearly(false)}
                    className={`relative z-10 w-fit cursor-pointer h-8 rounded-md px-3 py-1 font-medium transition-all text-xs ${
                      !isYearly 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={`relative z-10 w-fit cursor-pointer h-8 rounded-md px-3 py-1 font-medium transition-all text-xs flex items-center gap-1.5 ${
                      isYearly 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Annuel
                    <span className="bg-emerald-500 text-white text-[9px] px-1 py-0.5 rounded-full font-bold">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid - Glassmorphism Cards */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className="relative rounded-lg p-3 transition-all"
                    style={{
                      background: plan.popular 
                        ? 'rgba(255, 107, 53, 0.08)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: plan.popular 
                        ? '1px solid rgba(255, 107, 53, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: plan.popular 
                        ? '0 0 30px rgba(255, 107, 53, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                        : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    {plan.popular && (
                      <div className="absolute top-2 right-2">
                        <span 
                          className="text-white px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                          style={{
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            boxShadow: '0 2px 10px rgba(249, 115, 22, 0.3)'
                          }}
                        >
                          Populaire
                        </span>
                      </div>
                    )}
                    
                    <h4 className="text-sm font-semibold text-white mb-0.5">PROOFY {plan.name}</h4>
                    <div className="flex items-baseline mb-2">
                      <AnimatedPrice 
                        price={isYearly ? plan.yearlyPrice : plan.price} 
                        className="text-xl font-bold text-white"
                      />
                      <span className="text-white/40 ml-1 text-xs">
                        /{isYearly ? "an" : "mois"}
                      </span>
                    </div>

                    <button
                      onClick={() => onSubscribe(plan.name)}
                      disabled={loadingPlan === plan.name}
                      className={`w-full py-2 rounded-md font-medium transition-all mb-2 flex items-center justify-center gap-1.5 text-xs ${
                        loadingPlan === plan.name ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={plan.popular ? {
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                        color: 'white'
                      } : {
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }}
                    >
                      {loadingPlan === plan.name ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>...</span>
                        </>
                      ) : (
                        plan.buttonText
                      )}
                    </button>

                    <div className="space-y-1">
                      <ul className="space-y-0.5">
                        {plan.includes.slice(1, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span 
                              className="h-3 w-3 rounded-full grid place-content-center mt-0.5 mr-1.5 flex-shrink-0"
                              style={{
                                background: 'rgba(255, 107, 53, 0.15)',
                                border: '1px solid rgba(255, 107, 53, 0.4)'
                              }}
                            >
                              <CheckCheck className="h-2 w-2 text-orange-400" />
                            </span>
                            <span className="text-white/60 text-[10px] leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Install Anyway Button - Glassmorphism */}
            <div 
              className="pt-3"
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <button
                onClick={onInstallAnyway}
                className="w-full py-2 rounded-md font-medium text-white/50 hover:text-white transition-all text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                Installer l'extension quand même
              </button>
              <p className="text-center text-[10px] text-white/30 mt-1">
                L'extension ne fonctionnera pas sans abonnement
              </p>
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:handleItemClick',message:'handleItemClick called',data:{itemId:item.id,itemName:item.name,itemExternal:item.external,itemHref:item.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    // Si c'est un lien externe (Extension)
    if (item.external) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:handleItemClick:external',message:'item.external is true',data:{isPro,subscriptionLoading,condition:!isPro && !subscriptionLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,E'})}).catch(()=>{});
      // #endregion
      
      // Vérifier si l'utilisateur a un abonnement actif
      if (!isPro && !subscriptionLoading) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:handleItemClick:showModal',message:'Showing extension modal',data:{showExtensionModalBefore:showExtensionModal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        // Pas d'abonnement, afficher le modal
        setShowExtensionModal(true);
        if (window.innerWidth < 768) {
          setIsOpen(false);
        }
        return;
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:handleItemClick:openExternal',message:'Opening external link (user has subscription)',data:{isPro,subscriptionLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
      // #endregion
      
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:107',message:'handleSignOut called',data:{userExists:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:110',message:'Before signOut call',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      await signOut();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:113',message:'After signOut call, before navigate',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      navigate('/');
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:115',message:'After navigate call',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardLayout.tsx:117',message:'Error in handleSignOut catch',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
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
