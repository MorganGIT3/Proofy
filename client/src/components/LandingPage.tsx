import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import { CheckCheck, GraduationCap, Users, Briefcase, Megaphone, Video, TrendingUp } from "lucide-react";

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient";
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
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95"
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
    { name: 'Choisissez votre plan', href: '#tarifs' },
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
          isScrolled && 'bg-black/90 max-w-4xl rounded-2xl backdrop-blur-md lg:px-5'
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
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard');
                      setMenuState(false);
                    }}
                    className={cn(isScrolled && 'lg:inline-flex')}
                  >
                    <span>Dashboard</span>
                  </Button>
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
      <div className="relative z-10 mx-auto flex w-fit rounded-xl bg-gray-800 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-12 rounded-xl sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors sm:text-base text-sm",
            selected === "0"
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-12 w-full rounded-xl border-4 shadow-sm shadow-orange-600 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Facturation mensuelle</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-12 flex-shrink-0 rounded-xl sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors sm:text-base text-sm",
            selected === "1"
              ? "text-white"
              : "text-gray-400 hover:text-white",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-12 w-full rounded-xl border-4 shadow-sm shadow-orange-600 border-orange-600 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Facturation annuelle
            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-white border border-orange-500/50">
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [key, setKey] = useState(0);

  React.useEffect(() => {
    if (displayPrice !== price) {
      setIsAnimating(true);
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
          setTimeout(() => {
            setIsAnimating(false);
            setKey(prev => prev + 1);
          }, 150);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [price]);

  return (
    <motion.span
      key={key}
      className="text-3xl sm:text-4xl font-semibold text-white inline-block overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isAnimating ? [1, 0.7, 1] : 1,
        y: isAnimating ? [0, -15, 0] : 0,
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut"
      }}
    >
      {displayPrice}€
    </motion.span>
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
        "Dashboards ultra-réalistes",
        "Visuels pour stories, pubs & tunnels",
        "Exports HD sans watermark",
        "Tous les templates inclus",
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
        "Notifications de ventes en direct sur écran verrouillé",
        "Plan Proofy Basic inclus",
        "Scénarios programmables (toutes les X minutes/heures)",
        "Effet \"vente en direct\"",
        "FOMO en temps réel",
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
      <article className="text-left mb-6 space-y-4 max-w-2xl relative z-10">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl mx-auto px-4 sm:px-6 leading-tight mb-4"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em"
          }}
        >
          Choisissez votre plan
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-base text-sm text-gray-400 w-[80%]"
        >
          Des offres adaptées à vos besoins. Créez des preuves visuelles qui convertissent.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="w-fit" />
        </TimelineContent>
      </article>

      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 py-6 relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={cn(
                "relative border",
                plan.popular
                  ? "ring-2 ring-orange-500 bg-gray-900/50 border-orange-500/30"
                  : "bg-gray-900/50 border-gray-800"
              )}
            >
              <CardHeader className="text-left p-4 sm:p-6">
                <div className="flex justify-between">
                  <h3 className="xl:text-3xl md:text-2xl text-2xl sm:text-3xl font-semibold text-white mb-2">
                    PROOFY {plan.name}
                  </h3>
                  {plan.popular && (
                    <div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Populaire
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-baseline">
                  <AnimatedPrice 
                    price={isYearly ? plan.yearlyPrice : plan.price} 
                    isYearly={isYearly}
                  />
                  <span className="text-gray-400 ml-1 text-sm sm:text-base">
                    /{isYearly ? "an" : "mois"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 p-4 sm:p-6">
                <motion.button
                  onClick={() => navigate('/login')}
                  className={cn(
                    "w-full mb-6 p-3 sm:p-4 text-lg sm:text-xl rounded-xl relative overflow-hidden transition-all duration-300",
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

                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <h2 className="text-xl font-semibold uppercase text-white mb-3">
                    Fonctionnalités
                  </h2>
                  <h4 className="font-medium text-base text-gray-300 mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="h-6 w-6 bg-gray-800 border border-orange-500 rounded-full grid place-content-center mt-0.5 mr-3">
                          <CheckCheck className="h-4 w-4 text-orange-500" />
                        </span>
                        <span className="text-sm text-gray-300">{feature}</span>
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
              description: "Modifiez votre dashboard Beacons en direct avec notre extension (sur le site officiel de beacons)"
            },
            { 
              name: "Shopify", 
              status: "soon",
              description: "Bientôt disponible"
            },
            { 
              name: "Stripe", 
              status: "soon",
              description: "Bientôt disponible"
            },
            { 
              name: "TikTok", 
              status: "soon",
              description: "Bientôt disponible"
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
                
                {/* Placeholder pour la vidéo/visuel */}
                <div className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg mb-4 flex items-center justify-center border border-gray-800/50 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 50%)`,
                      animation: 'pulse 4s ease-in-out infinite'
                    }} />
                  </div>
                  {platform.status === "active" ? (
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mx-auto mb-2">
                        <Play size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400">Vidéo de démo</p>
                    </div>
                  ) : (
                    <div className="relative z-10 text-center">
                      <p className="text-xs sm:text-sm text-gray-500">Bientôt disponible</p>
                    </div>
                  )}
          </div>
                
                <p className="text-xs sm:text-sm text-gray-400 break-words">{platform.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
});

PricingSection.displayName = "PricingSection";

// Hero Component
const Hero = React.memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-12 sm:py-16 md:py-24 overflow-hidden"
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
        <span style={{ color: "#ff6b35" }}>
          sur toutes les plateformes.
        </span>
      </h1>

      <p className="text-sm md:text-base text-center max-w-2xl px-4 sm:px-6 mb-6 sm:mb-10" style={{ color: '#9ca3af' }}>
        Transforme l'attention en conversions grâce à des preuves visuelles instantanées.
      </p>

      {/* Boutons CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-10 sm:mb-16">
        <motion.button
          type="button"
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className="w-full sm:w-auto mb-0 p-3 sm:p-4 text-lg sm:text-xl rounded-xl relative overflow-hidden transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white flex items-center justify-center gap-2"
          aria-label={user ? "Accéder au dashboard" : "Créer mes preuves"}
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
          <span className="relative z-10">{user ? "Accéder au dashboard" : "Créer mes preuves"}</span>
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
            <h3 className="text-xl font-semibold uppercase text-white mb-6">
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

      {/* Section Tarification */}
      <PricingSection />
    </section>
  );
});

Hero.displayName = "Hero";

// Main Component
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <Hero />
    </main>
  );
}
