import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SettingOption {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const settingsOptions: SettingOption[] = [
  {
    id: 'editor-mode',
    label: 'Editor Mode',
    description: 'Activer le mode éditeur pour modifier les dashboards',
  },
  {
    id: 'auto-save',
    label: 'Auto-save',
    description: 'Sauvegarder automatiquement les modifications',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Recevoir des notifications pour les mises à jour',
  },
  {
    id: 'dark-theme',
    label: 'Dark Theme',
    description: 'Utiliser le thème sombre par défaut',
  },
  {
    id: 'high-quality',
    label: 'High Quality Export',
    description: 'Exporter en qualité maximale (4K)',
  },
  {
    id: 'watermark',
    label: 'Watermark',
    description: 'Ajouter un watermark Proofy sur les exports',
  },
];

export const SettingsPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['editor-mode']);

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) 
        ? prev.filter(opt => opt !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col px-6 py-8 relative overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="./favicon.png" 
            alt="Proofy" 
            className="h-8 w-8 object-contain rounded"
          />
          <h1 className="text-2xl font-semibold text-white">Paramètres</h1>
        </div>
        <p className="text-sm text-gray-400">
          Configurez vos préférences pour une expérience optimale
        </p>
      </motion.div>

      {/* Settings Options */}
      <div className="flex-1 space-y-3">
        {settingsOptions.map((option, index) => {
          const isSelected = selectedOptions.includes(option.id);
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => toggleOption(option.id)}
                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden ${
                  isSelected
                    ? 'bg-gray-900/50 border-orange-500/50 shadow-lg shadow-orange-500/20'
                    : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect when selected */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                )}

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        isSelected ? 'text-white' : 'text-gray-300'
                      }`}>
                        {option.label}
                      </h3>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-orange-500"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {option.description}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-orange-500 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/50'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6 pt-6 border-t border-gray-800"
      >
        <motion.button
          className="w-full p-4 text-lg rounded-xl relative overflow-hidden transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white flex items-center justify-center gap-2 font-semibold"
          whileHover={{ 
            scale: 1.02,
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
          <span className="relative z-10">Enregistrer les paramètres</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
