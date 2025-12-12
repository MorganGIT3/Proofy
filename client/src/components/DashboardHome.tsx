import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Grid3x3, Image as ImageIcon, Download, Trash2, Eye } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<any[]>([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black w-full">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-30 w-full">
        <div className="w-full px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Mes dashboards
              </h1>
              <p className="text-gray-400 mt-1">Gérez et visualisez tous vos dashboards</p>
            </div>
            <motion.button
              onClick={() => navigate('/dashboard/create')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white to-gray-300 text-black font-semibold rounded-lg hover:from-white hover:to-white transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Nouveau dashboard</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full px-6 md:px-8 py-12">
        {dashboards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-gray-800 flex items-center justify-center mb-6">
              <Grid3x3 size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Aucun dashboard</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Créez votre premier dashboard pour commencer à générer des preuves visuelles ultra-réalistes
            </p>
            <motion.button
              onClick={() => navigate('/dashboard/create')}
              className="px-8 py-4 bg-gradient-to-r from-white to-gray-300 text-black font-semibold rounded-lg hover:from-white hover:to-white transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Créer mon premier dashboard
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dashboards.map((dashboard, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/50 transition-all duration-300"
              >
                {/* Preview Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <ImageIcon size={48} className="text-gray-600" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{dashboard.name || 'Dashboard sans nom'}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {dashboard.type || 'Type non spécifié'} • {dashboard.createdAt || 'Date inconnue'}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-lg text-sm text-white transition-colors">
                      <Eye size={16} />
                      <span>Voir</span>
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-lg text-white transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-gray-800 rounded-lg text-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

