import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart2, ShoppingBag, CreditCard, Music, Store, Search, Check } from 'lucide-react';

interface DashboardType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  logo?: string; // URL or SVG path for logo
  available: boolean;
  comingSoon?: boolean;
}

const dashboardTypes: DashboardType[] = [
  {
    id: 'beacons',
    name: 'Beacons',
    description: 'Générez des dashboards ultra-réalistes pour montrer vos ventes, revenus et activité',
    icon: BarChart2,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/chartdotjs.svg',
    available: true,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Créez des preuves visuelles de vos ventes Shopify',
    icon: ShoppingBag,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg',
    available: false,
    comingSoon: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Générez des dashboards de paiements Stripe réalistes',
    icon: CreditCard,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/stripe.svg',
    available: false,
    comingSoon: true,
  },
  {
    id: 'tiktokshop',
    name: 'TikTok Shop',
    description: 'Créez des preuves de vos ventes TikTok Shop',
    icon: Music,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg',
    available: false,
    comingSoon: true,
  },
  {
    id: 'googlesc',
    name: 'Google SC',
    description: 'Générez des dashboards Google Shopping Campaigns',
    icon: Search,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googleshopping.svg',
    available: false,
    comingSoon: true,
  },
];

export const CreateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (type: DashboardType) => {
    if (type.available) {
      setSelectedType(type.id);
      // Navigate to beacons dashboard creation
      setTimeout(() => {
        navigate('/dashboard/create/beacons');
      }, 300);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black w-full">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-30 w-full">
        <div className="w-full px-6 md:px-8 py-6">
          <div className="flex items-center gap-6">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Créer un dashboard
              </h1>
              <p className="text-gray-400 mt-1">Choisissez le type de dashboard à créer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full px-6 md:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dashboardTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            const isAvailable = type.available;

            return (
              <motion.div
                key={type.id}
                variants={cardVariants}
                onClick={() => handleSelect(type)}
                className={`group relative bg-gradient-to-br ${
                  isAvailable
                    ? 'from-gray-900/50 to-gray-950/50 border-gray-800/50 hover:border-gray-700/50 cursor-pointer'
                    : 'from-gray-950/30 to-gray-900/30 border-gray-900/50 cursor-not-allowed opacity-60'
                } border rounded-xl overflow-hidden transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-white/20 scale-105' : ''
                }`}
                whileHover={isAvailable ? { scale: 1.02, y: -4 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
              >
                {/* Status Badge */}
                {type.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full text-xs text-gray-300">
                    Bientôt disponible
                  </div>
                )}

                {isAvailable && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white flex items-center gap-1">
                    <Check size={12} />
                    <span>Disponible</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-8">
                  {/* Logo/Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                      isAvailable
                        ? 'from-white/10 to-white/5 border border-gray-800'
                        : 'from-gray-900/50 to-gray-950/50 border border-gray-900'
                    } flex items-center justify-center mb-6 transition-all duration-300 ${
                      isAvailable ? 'group-hover:from-white/20 group-hover:to-white/10' : ''
                    }`}
                  >
                    {type.logo ? (
                      <img
                        src={type.logo}
                        alt={type.name}
                        className={`w-10 h-10 ${isAvailable ? 'opacity-100' : 'opacity-40 grayscale'}`}
                        style={{ filter: isAvailable ? 'brightness(0) invert(1)' : 'brightness(0) invert(0.4)' }}
                      />
                    ) : (
                      <Icon
                        size={32}
                        className={isAvailable ? 'text-white' : 'text-gray-600'}
                      />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-2">{type.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{type.description}</p>

                  {/* Action Button */}
                  {isAvailable ? (
                    <motion.button
                      className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-300 text-black font-semibold rounded-lg hover:from-white hover:to-white transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Créer
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 text-gray-600 font-semibold rounded-lg cursor-not-allowed"
                    >
                      Indisponible
                    </button>
                  )}
                </div>

                {/* Hover Effect */}
                {isAvailable && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
};

