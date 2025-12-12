import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export const CreateBeaconsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardName, setDashboardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!dashboardName.trim()) return;

    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsCreating(false);
    
    // Navigate to dashboard editor or preview
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black w-full">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-30 w-full">
        <div className="w-full px-6 md:px-8 py-6">
          <div className="flex items-center gap-6">
            <motion.button
              onClick={() => navigate('/dashboard/create')}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Créer un dashboard Beacons
              </h1>
              <p className="text-gray-400 mt-1">Configurez votre nouveau dashboard</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-4xl mx-auto px-6 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 rounded-xl p-8"
        >
          {/* Dashboard Name */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Nom du dashboard
            </label>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Ex: Dashboard Ventes Q1 2024"
              className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
            />
          </div>

          {/* Preview Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Aperçu
            </label>
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="text-center z-10">
                <Sparkles size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aperçu du dashboard</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleCreate}
              disabled={!dashboardName.trim() || isCreating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-white to-gray-300 text-black font-semibold rounded-lg hover:from-white hover:to-white transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={dashboardName.trim() && !isCreating ? { scale: 1.02 } : {}}
              whileTap={dashboardName.trim() && !isCreating ? { scale: 0.98 } : {}}
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Créer le dashboard</span>
                </>
              )}
            </motion.button>
            <motion.button
              onClick={() => navigate('/dashboard/create')}
              className="px-6 py-3 bg-gray-900/50 border border-gray-800 text-white font-semibold rounded-lg hover:bg-gray-800/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

