import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import { CheckCheck, GraduationCap, Users, Briefcase, Megaphone, Video, TrendingUp, Settings, Monitor, Zap, Upload } from "lucide-react";
import { AnimatedText } from "@/components/AnimatedText";

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95",
      outline: "border border-gray-700 text-white hover:bg-gray-800/50 bg-transparent"
    };
    
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icons
const ArrowRight = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Play = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Menu = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Video Demo Modal Component
const VideoDemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scaleIn">
        <div className="relative w-full max-w-4xl bg-black border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {/* Video Placeholder */}
              <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
                  }} />
                </div>
                
                {/* Play icon animation */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                    <Play size={40} className="text-white ml-1" />
                  </div>
                  <div className="text-white/60 text-sm font-medium animate-pulse">
                    Vidéo en création...
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Démo vidéo à venir
                </h3>
              </div>

              {/* CTA Button */}
              <Button
                type="button"
                variant="gradient"
                size="lg"
                onClick={onClose}
                className="mt-4"
              >
                Compris
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const Check = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Navigation Component
const Navigation = React.memo(() => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Qui utilise Proofy', href: '#qui-utilise-proofy' },
    { name: 'Passe à l\'action', href: '#tarifs' },
    { name: 'Plateformes disponibles', href: '#plateformes-disponibles' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Offset pour la navigation fixe
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMenuState(false);
  };

  return (
    <header className="relative overflow-hidden">
      <nav
        data-state={menuState && 'active'}
        className="fixed group z-20 w-full px-2"
      >
        <div className={cn(
          'mx-auto mt-2 max-w-6xl px-3 sm:px-6 transition-all duration-300 lg:px-12 relative',
          isScrolled && 'bg-black/70 max-w-4xl rounded-2xl backdrop-blur-md lg:px-5'
        )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <div
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img src="/favicon.png" alt="Proofy" className="h-6 w-6 sm:h-8 sm:w-8" />
                <div className="text-xl font-semibold text-white">Proofy</div>
              </div>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className={cn(
                  "m-auto size-6 duration-200 text-white",
                  menuState && "rotate-180 scale-0 opacity-0"
                )} />
                <X className={cn(
                  "absolute inset-0 m-auto size-6 duration-200 text-white -rotate-180 scale-0 opacity-0",
                  menuState && "rotate-0 scale-100 opacity-100"
                )} />
              </button>
            </div>

            <div className="absolute left-[47%] top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block z-10">
              <ul className="flex gap-4 text-xs whitespace-nowrap">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-gray-400 hover:text-white block duration-150 cursor-pointer"
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn(
              "bg-black/95 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-800/50 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
              menuState && "block"
            )}>
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="text-gray-400 hover:text-white block duration-150 cursor-pointer"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {user ? (
                  <motion.button
                    type="button"
                    onClick={() => {
                      navigate('/dashboard');
                      setMenuState(false);
                    }}
                    className={cn(
                      'h-9 px-4 text-sm rounded-xl relative overflow-hidden transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 border border-orange-400 text-white inline-flex items-center justify-center font-medium',
                      isScrolled && 'lg:inline-flex'
                    )}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 15px 30px -8px rgba(255, 107, 53, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 17 
                    }}
                  >
                    <span>Dashboard</span>
                  </motion.button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate('/login');
                        setMenuState(false);
                      }}
                      className={cn(isScrolled && 'lg:hidden')}
                    >
                      <span>Connexion</span>
                    </Button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        navigate('/login');
                        setMenuState(false);
                      }}
                      className={cn(
                        'h-10 px-5 text-sm rounded-xl relative overflow-hidden transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white inline-flex items-center justify-center',
                        isScrolled ? 'lg:inline-flex' : 'lg:inline-flex'
                      )}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 40px -12px rgba(255, 107, 53, 0.5)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 17 
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                      <span className="relative z-10">{isScrolled ? 'Commencer' : 'Commencer'}</span>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});

Navigation.displayName = "Navigation";

// Pricing Switch Component
const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void;
  className?: string;
}) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-lg sm:rounded-xl bg-gray-800 border border-gray-700 p-0.5 sm:p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 font-medium transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base",
            selected === "0"
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {selected === "0" && (
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
            selected === "1"
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {selected === "1" && (
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
  }, [price]);

  return (
    <span className="text-3xl sm:text-4xl font-semibold text-white inline-block">
      {displayPrice}€
    </span>
  );
};

// Pricing Section Component
const PricingSection = React.memo(() => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const plans = [
    {
      name: "BASIC",
      description: "Pour ceux qui veulent montrer.",
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
      name: "LIVE",
      description: "Pour ceux qui veulent déclencher l'achat en temps réel.",
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

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      id="tarifs"
      className="px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 min-h-screen max-w-7xl mx-auto relative"
      ref={pricingRef}
    >
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
          Passe à l'action
        </span>
      </h2>

      <article className="text-center mb-6 space-y-4 max-w-2xl mx-auto relative z-10">
        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-base text-sm text-gray-400 mx-auto"
        >
          Choisis l'offre qui te permet de montrer tes résultats et d'accélérer tes ventes.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="w-fit mx-auto" />
        </TimelineContent>
      </article>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 py-6 relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="h-full"
          >
            <Card
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
                  onClick={() => navigate('/login')}
                  className={cn(
                    "w-full mb-3 sm:mb-6 p-2 sm:p-3 md:p-4 text-xs sm:text-base md:text-lg lg:text-xl rounded-lg sm:rounded-xl relative overflow-hidden transition-all duration-300",
                    plan.popular
                      ? "bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white"
                      : plan.buttonVariant === "outline"
                        ? "bg-gradient-to-t from-gray-800 to-gray-700 shadow-lg shadow-gray-900 border border-gray-700 text-white"
                        : "bg-gradient-to-t from-gray-800 to-gray-700 shadow-lg shadow-gray-900 border border-gray-700 text-white"
                  )}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: plan.popular 
                      ? "0 20px 40px -12px rgba(255, 107, 53, 0.5)" 
                      : "0 20px 40px -12px rgba(0, 0, 0, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">{plan.buttonText}</span>
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
          </TimelineContent>
        ))}
      </div>

      {/* Section Plateformes disponibles */}
      <div id="plateformes-disponibles" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 scroll-mt-20 relative overflow-hidden">
        {/* Effets lumineux orange pour la section plateformes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className="absolute top-1/2 left-1/3 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full opacity-15 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)",
              animation: "pulse 4s ease-in-out infinite"
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full opacity-12 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)",
              animation: "pulse 5.5s ease-in-out infinite",
              animationDelay: "1s"
            }}
          />
        </div>
        <h3
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-4 sm:px-6 leading-tight mb-8 sm:mb-10 md:mb-12 relative z-10"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em"
          }}
        >
          Plateformes disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
          {[
            { 
              name: "Beacons", 
              status: "active",
              image: "/beacons image .jpg",
              description: "Crée un dashboard Beacons simulé avec tes ventes affichées en temps réel et des notifications visuelles sur écran verrouillé, pour donner l'image d'une formation qui se vend et renforcer instantanément ta crédibilité."
            },
            { 
              name: "Shopify", 
              status: "soon",
              image: "/new_shopify image.jpeg",
              description: "Génère un dashboard Shopify visuel montrant un chiffre d'affaires par jour, semaine ou mois, avec des notifications de ventes simulées, pour prouver ton expertise e-commerce et rassurer ton audience."
            },
            { 
              name: "Stripe", 
              status: "soon",
              image: "/stripe image.jpg",
              description: "Crée un dashboard Stripe de démonstration avec paiements et chiffre d'affaires affichés (jour, semaine, mois), accompagné de notifications visuelles, pour montrer que ton business encaisse et inspirer la confiance."
            },
            { 
              name: "TikTok", 
              status: "soon",
              image: "/tik-tok image.jpg",
              description: "Génère un dashboard TikTok de présentation affichant des revenus de monétisation et la progression de tes gains, pour prouver que TikTok peut vraiment devenir une source de revenus."
            },
          ].map((platform, index) => (
            <Card
              key={index}
              className={cn(
                "relative overflow-hidden border",
                platform.status === "active"
                  ? "bg-gray-900/50 border-orange-500/50"
                  : "bg-gray-900/30 border-gray-800/50 opacity-60"
              )}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-white">{platform.name}</h4>
                  {platform.status === "soon" && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                      SOON
                    </span>
                  )}
                  {platform.status === "active" && (
                    <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 sm:px-3 py-1 rounded-full border border-orange-500/30">
                      ACTIF
                    </span>
        )}
      </div>

                {/* Image de la plateforme */}
                <div className="w-full h-32 sm:h-40 md:h-48 rounded-lg mb-4 border border-gray-800/50 relative overflow-hidden">
                  <img 
                    src={platform.image} 
                    alt={`Dashboard ${platform.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {platform.status === "active" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative z-10 text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                          <Play size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300 font-medium">Vidéo de démo</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs sm:text-sm text-white break-words">{platform.description}</p>
              </CardContent>
            </Card>
          ))}
          
          {/* Card Airbnb centrée en bas */}
          <div className="md:col-span-2 flex justify-center">
            <Card
              className="relative overflow-hidden border bg-gray-900/30 border-gray-800/50 opacity-60 w-full md:max-w-md"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-white">Airbnb</h4>
                  <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                    SOON
                  </span>
                </div>

                {/* Image Airbnb */}
                <div className="w-full h-32 sm:h-40 md:h-48 rounded-lg mb-4 border border-gray-800/50 relative overflow-hidden">
                  <img 
                    src="/new_airbnb image.jpg" 
                    alt="Dashboard Airbnb"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                
                <p className="text-xs sm:text-sm text-white break-words">
                  Crée un dashboard Airbnb de démonstration affichant tes revenus par nuit, semaine ou mois, avec des notifications de réservations simulées, pour prouver la rentabilité de la location courte durée et renforcer instantanément ta crédibilité.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

PricingSection.displayName = "PricingSection";

// Timeline Component for Platforms
interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const PlatformsTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const timelineData: TimelineEntry[] = [
    {
      title: "BEACONS",
      content: (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 50%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }} />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mx-auto mb-2">
                <Play size={32} className="text-orange-500 ml-1" />
              </div>
              <p className="text-sm text-gray-400">Vidéo de démo</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Crée un dashboard Beacons simulé avec tes ventes affichées en temps réel et des notifications visuelles sur écran verrouillé, pour donner l'image d'une formation qui se vend et renforcer instantanément ta crédibilité.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "SHOPIFY",
      content: (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 50%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }} />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mx-auto mb-2">
                <Play size={32} className="text-orange-500 ml-1" />
              </div>
              <p className="text-sm text-gray-400">Vidéo de démo</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Génère un dashboard Shopify visuel montrant un chiffre d'affaires par jour, semaine ou mois, avec des notifications de ventes simulées, pour prouver ton expertise e-commerce et rassurer ton audience.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "STRIPE",
      content: (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 50%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }} />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mx-auto mb-2">
                <Play size={32} className="text-orange-500 ml-1" />
              </div>
              <p className="text-sm text-gray-400">Vidéo de démo</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Crée un dashboard Stripe de démonstration avec paiements et chiffre d'affaires affichés (jour, semaine, mois), accompagné de notifications visuelles, pour montrer que ton business encaisse et inspirer la confiance.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "TIKTOK",
      content: (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg flex items-center justify-center border border-gray-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 50%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }} />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mx-auto mb-2">
                <Play size={32} className="text-orange-500 ml-1" />
              </div>
              <p className="text-sm text-gray-400">Vidéo de démo</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Génère un dashboard TikTok de présentation affichant des revenus de monétisation et la progression de tes gains, pour prouver que TikTok peut vraiment devenir une source de revenus.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className="w-full bg-black font-sans md:px-10 py-20"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 mb-12">
        <h3
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-4 sm:px-6 leading-tight mb-4"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em"
          }}
        >
          Plateformes disponibles
        </h3>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 px-4 md:px-8 lg:px-10">
        {timelineData.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-gray-800 border border-gray-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-gray-400">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-gray-400">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-orange-500 via-orange-400 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

// Timeline Component (imported as-is)
interface TimelineEntryNew {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntryNew[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-black font-sans md:px-10 overflow-visible"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10 min-h-[400px] md:min-h-[600px]"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 md:top-40 self-start max-w-xs lg:max-w-sm md:w-full h-fit">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center z-50">
                <div className="h-4 w-4 rounded-full bg-gray-800 border border-gray-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-gray-400 whitespace-nowrap">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-gray-400">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-orange-500 via-orange-400 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
    </div>
  );
};

// Hero Component
const Hero = React.memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 pt-24 pb-12 sm:pt-16 sm:pb-16 md:pt-24 md:pb-24 overflow-hidden"
      style={{
        animation: "fadeIn 0.6s ease-out"
      }}
    >
      {/* Effets lumineux orange dans le fond */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Glow en haut à droite */}
        <div 
          className="absolute top-10 right-4 sm:top-20 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite"
          }}
        />
        {/* Glow au milieu gauche */}
        <div 
          className="absolute top-1/2 left-4 sm:left-10 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)",
            animation: "pulse 5s ease-in-out infinite",
            animationDelay: "1s"
          }}
        />
        {/* Glow en bas à droite */}
        <div 
          className="absolute bottom-10 sm:bottom-20 right-1/4 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
            animationDelay: "2s"
          }}
        />
        {/* Glow au centre */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full opacity-12 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)",
            animation: "pulse 4.5s ease-in-out infinite",
            animationDelay: "0.5s"
          }}
        />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        /* Grain texture */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
        
        @media (min-width: 640px) {
          .glow-video-top {
            top: -20% !important;
          }
        }
        
        @media (min-width: 768px) {
          .glow-video-top {
            top: -23% !important;
          }
        }
      `}</style>
      
      {/* Grain texture overlay - Couche 1 */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.05) 3px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.05) 3px)
          `,
          backgroundSize: '150px 150px',
          animation: 'grain 8s steps(10) infinite',
          mixBlendMode: 'overlay'
        }}
      />
      {/* Grain texture overlay - Couche 2 */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 1px, rgba(255,255,255,0.04) 2px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 1px, rgba(255,255,255,0.04) 2px)
          `,
          backgroundSize: '100px 100px',
          animation: 'grain 6s steps(10) infinite reverse',
          mixBlendMode: 'overlay'
        }}
      />
      {/* Grain texture overlay - Couche 3 (fin) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 0.5px, transparent 1px, rgba(255,255,255,0.03) 1.5px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 0.5px, transparent 1px, rgba(255,255,255,0.03) 1.5px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grain 10s steps(10) infinite',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Titre principal */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl px-4 sm:px-6 leading-tight mb-4 sm:mb-6"
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
          L'app n°1 pour créer des dashboards de résultats
        </span>
        <br />
        <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>
          <span style={{ color: "#ffffff" }}>
            sur{" "}
          </span>
          <span style={{ color: "#ff6b35", display: "inline-block", position: "relative" }}>
            toutes les plateformes.
            <motion.svg
              width="100%"
              height="20"
              viewBox="0 0 400 20"
              className="absolute -bottom-2 left-0 text-orange-500"
              style={{ width: "100%", height: "12px", overflow: "visible" }}
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0,10 Q 100,0 200,10 Q 300,20 400,10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                whileHover={{
                  d: "M 0,10 Q 100,20 200,10 Q 300,0 400,10",
                  transition: { duration: 0.8 },
                }}
              />
            </motion.svg>
          </span>
        </span>
      </h1>

      {/* Boutons CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-10 sm:mb-16">
        <motion.button
          type="button"
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className="w-full sm:w-auto mb-0 p-3 sm:p-4 text-lg sm:text-xl rounded-xl relative overflow-hidden transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white flex items-center justify-center gap-2"
          aria-label="Créer mon dashboard"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px -12px rgba(255, 107, 53, 0.5)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 17 
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <span className="relative z-10">Créer mon dashboard</span>
          <ArrowRight size={20} className="relative z-10" />
        </motion.button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="rounded-lg border border-gray-700 text-white hover:bg-gray-800/50 flex items-center justify-center"
          aria-label="Voir la démo"
          onClick={() => setIsVideoModalOpen(true)}
        >
          <Play size={20} />
          Voir la démo
        </Button>
      </div>

      {/* Video Demo Modal */}
      <VideoDemoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />

      {/* Video Demo Preview */}
      <div className="w-full max-w-5xl relative pb-12 sm:pb-16 md:pb-20">
        <div
          className="absolute left-1/2 w-full sm:w-[90%] pointer-events-none z-0 glow-video-top"
          style={{
            top: "-15%",
            transform: "translateX(-50%)"
          }}
          aria-hidden="true"
        >
          <img
            src="https://i.postimg.cc/Ss6yShGy/glows.png"
            alt=""
            className="w-full h-auto"
            loading="eager"
          />
        </div>
        
        <div className="relative z-10">
          <div className="w-full aspect-video bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-lg shadow-2xl border border-gray-800/50 overflow-hidden relative group">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }} />
            </div>
            
            {/* Video placeholder content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-8">
              {/* Play icon with animation */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/15 transition-all duration-300 animate-pulse">
                  <Play size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1 sm:ml-2" />
                </div>
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
              
              {/* Text */}
              <div className="text-center space-y-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  Vidéo de démo
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Disponible prochainement
                </p>
              </div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }} />
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      {/* Texte social proof sous la vidéo */}
      <h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-4 sm:px-6 leading-tight mb-12 sm:mb-16 md:mb-20 relative z-10"
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
          Plus de 1 000 créateurs utilisent déjà{" "}
        </span>
        <span style={{ color: "#ff6b35" }}>Proofy</span>
      </h2>

      {/* Card Types d'utilisateurs */}
      <div id="qui-utilise-proofy" className="w-full max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 scroll-mt-20">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-xl font-semibold uppercase text-white mb-6 text-center">
              Qui utilise Proofy ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  name: "Vendeurs de formations", 
                  icon: <GraduationCap className="h-4 w-4 text-orange-500" />
                },
                { 
                  name: "Coachs en ligne", 
                  icon: <Users className="h-4 w-4 text-orange-500" />
                },
                { 
                  name: "Managers OFM", 
                  icon: (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3" fill="#ff6b35"/>
                      <path d="M12 12c-3 0-6 1.5-6 3v2h12v-2c0-1.5-3-3-6-3z" fill="#ff6b35"/>
                    </svg>
                  )
                },
                { 
                  name: "Infopreneurs", 
                  icon: <TrendingUp className="h-4 w-4 text-orange-500" />
                },
                { 
                  name: "Marketeurs digitaux", 
                  icon: <Megaphone className="h-4 w-4 text-orange-500" />
                },
                { 
                  name: "Créateurs de contenu", 
                  icon: <Video className="h-4 w-4 text-orange-500" />
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="h-6 w-6 bg-gray-800 border border-orange-500 rounded-full grid place-content-center mt-0.5 mr-3 flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-sm text-gray-300 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>

      {/* Section Pourquoi les créateurs adorent Proofy */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
        {/* Titre */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-4 sm:px-6 leading-tight mb-6 sm:mb-8 md:mb-10"
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
            Pourquoi les créateurs adorent Proofy?
          </span>
        </h2>

        {/* Sous-titre */}
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4">
          Tout ce dont vous avez besoin pour créer des dashboards bluffants en quelques secondes
        </p>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Carte 1 */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                    100 % personnalisable
                  </h3>
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                      Modifie chaque chiffre, chaque métrique, chaque élément.
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                    Crée exactement le dashboard que tu veux, sans aucune limite.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte 2 */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                    Réplique parfaite des vraies plateformes
                  </h3>
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                      Un rendu identique à Shopify, Stripe, Beacons, TikTok, Airbnb…
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                    Ton audience ne fera pas la différence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte 3 */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                    Aucun skill technique nécessaire
                  </h3>
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                      Pas de design, pas de code, rien à apprendre.
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                    Choisis un template, remplis les champs, c'est prêt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte 4 */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                    Export instantané en haute qualité
                  </h3>
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                      Exporte en PNG / JPG en quelques secondes.
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                    Qualité 4K, parfaite pour stories, pubs et pages de vente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section Tarification */}
      <PricingSection />
    </section>
  );
});

Hero.displayName = "Hero";

// TimelineDemo Component
const TimelineDemo = () => {
  const data: TimelineEntryNew[] = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-gray-300 text-xs md:text-sm font-normal mb-8">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="text-gray-300 text-xs md:text-sm font-normal mb-8">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="text-gray-300 text-xs md:text-sm font-normal mb-8">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Changelog",
      content: (
        <div>
          <p className="text-gray-300 text-xs md:text-sm font-normal mb-4">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-gray-400 text-xs md:text-sm">
              ✅ Card grid component
            </div>
            <div className="flex gap-2 items-center text-gray-400 text-xs md:text-sm">
              ✅ Startup template Aceternity
            </div>
            <div className="flex gap-2 items-center text-gray-400 text-xs md:text-sm">
              ✅ Random file upload lol
            </div>
            <div className="flex gap-2 items-center text-gray-400 text-xs md:text-sm">
              ✅ Himesh Reshammiya Music CD
            </div>
            <div className="flex gap-2 items-center text-gray-400 text-xs md:text-sm">
              ✅ Salman Bhai Fan Club registrations open
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full relative">
      <Timeline data={data} />
    </div>
  );
};

// Main Component
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <footer className="w-full py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 text-center">
            Proofy propose des outils de démonstration visuelle à des fins marketing. L'utilisateur est seul responsable de l'usage qu'il en fait.
          </p>
        </div>
      </footer>
    </main>
  );
}
