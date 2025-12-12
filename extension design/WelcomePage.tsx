import React from 'react';
import { motion } from 'framer-motion';

interface WelcomePageProps {
  onFakeItClick: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onFakeItClick }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-8 relative">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <img 
          src="./favicon.png" 
          alt="Proofy" 
          className="h-16 w-16 object-contain mx-auto"
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl sm:text-3xl font-medium text-center leading-tight mb-6"
        style={{ letterSpacing: "-0.05em" }}
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
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            >
              <motion.path
                d="M 0,10 Q 100,0 200,10 Q 300,20 400,10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </motion.svg>
          </span>
        </span>
      </motion.h1>

      {/* Fake It Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        type="button"
        onClick={onFakeItClick}
        className="w-full p-4 text-lg rounded-xl relative overflow-hidden transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white flex items-center justify-center gap-2"
        aria-label="Fake it"
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
        <span className="relative z-10 font-semibold">Fake it</span>
      </motion.button>
    </div>
  );
};
