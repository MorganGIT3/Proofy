import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TimelineContent } from '@/components/ui/timeline-animation';
import { cn } from '@/lib/utils';
import { CheckCheck } from 'lucide-react';

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

// Platform Icons (simplified SVG representations)
const BeaconsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="url(#beaconsGrad)"/>
    <defs>
      <linearGradient id="beaconsGrad" x1="0" y1="0" x2="40" y2="40">
        <stop offset="0%" stopColor="#FF9900"/>
        <stop offset="100%" stopColor="#FF6600"/>
      </linearGradient>
    </defs>
    <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">B</text>
  </svg>
);

const ShopifyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#95BF47"/>
    <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">S</text>
  </svg>
);

const StripeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#635BFF"/>
    <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">$</text>
  </svg>
);

const TikTokIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#000000"/>
    <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">T</text>
  </svg>
);

const AirbnbIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#FF5A5F"/>
    <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">A</text>
  </svg>
);

interface PlatformCard {
  name: string;
  status: 'active' | 'soon';
  icon: React.ReactNode;
  image: string;
  position: { x: string; y: string };
}

const platforms: PlatformCard[] = [
  { name: 'Beacons.ai', status: 'active', icon: <BeaconsIcon />, image: '/beacons image .jpg', position: { x: '10%', y: '20%' } },
  { name: 'Shopify', status: 'soon', icon: <ShopifyIcon />, image: '/new_shopify image.jpeg', position: { x: '30%', y: '15%' } },
  { name: 'Stripe', status: 'soon', icon: <StripeIcon />, image: '/stripe image.jpg', position: { x: '50%', y: '25%' } },
  { name: 'TikTok', status: 'soon', icon: <TikTokIcon />, image: '/tik-tok image.jpg', position: { x: '70%', y: '20%' } },
  { name: 'Airbnb', status: 'soon', icon: <AirbnbIcon />, image: '/new_airbnb image.jpg', position: { x: '90%', y: '18%' } },
];

export const DashboardHome: React.FC = () => {
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
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Section 1: Platform Cards */}
        <div className="mb-16 relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-8 sm:mb-12"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            Plateformes disponibles
          </h2>

          {/* Floating Icons */}
          <div className="absolute inset-0 pointer-events-none">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                className="absolute flex flex-col items-center gap-2"
                style={{
                  left: platform.position.x,
                  top: platform.position.y,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -20, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.3 + index * 0.1 },
                  scale: { duration: 0.6, delay: 0.3 + index * 0.1 },
                  y: {
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(255, 153, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 153, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(255, 153, 0, 0.4)",
                  }}
                >
                  {platform.icon}
                </div>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  {platform.name.split('.')[0]}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Platform Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 mt-56 md:mt-64 lg:mt-72">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "relative overflow-hidden border h-full",
                    platform.status === "active"
                      ? "bg-gray-900/50 border-orange-500/50"
                      : "bg-gray-900/30 border-gray-800/50 opacity-60"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{platform.name}</h3>
                      {platform.status === "soon" && (
                        <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                          SOON
                        </span>
                      )}
                      {platform.status === "active" && (
                        <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
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
                              <svg className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-300 font-medium">Vidéo de démo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div
          className="px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 relative"
          ref={pricingRef}
        >
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
        </div>
      </div>
    </div>
  );
};
