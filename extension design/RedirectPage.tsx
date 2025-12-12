import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface RedirectPageProps {
  onRedirectComplete: () => void;
}

export const RedirectPage: React.FC<RedirectPageProps> = ({ onRedirectComplete }) => {
  useEffect(() => {
    // Simuler une redirection après 2 secondes
    const timer = setTimeout(() => {
      onRedirectComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onRedirectComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-8 relative">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        <img 
          src="./favicon.png" 
          alt="Proofy" 
          className="h-20 w-20 object-contain mx-auto"
        />
      </motion.div>

      {/* Success Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="relative">
          <CheckCircle2 
            size={64} 
            className="text-orange-500"
            strokeWidth={2}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500/20"
            initial={{ scale: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl sm:text-3xl font-semibold text-center mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        <span
          style={{
            background: "linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.8))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Vous êtes maintenant connecté !
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-base text-gray-400 text-center mb-8 max-w-sm"
      >
        Vous allez être redirigé vers votre dashboard
      </motion.p>

      {/* Loading Spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center gap-3"
      >
        <Loader2 
          size={20} 
          className="text-orange-500 animate-spin"
        />
        <span className="text-sm text-gray-400">Redirection en cours...</span>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-xs mt-8"
      >
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

