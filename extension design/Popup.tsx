import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomePage } from './WelcomePage';
import { LoginPage } from './LoginPage';
import { SettingsPage } from './SettingsPage';
import { RedirectPage } from './RedirectPage';

type Page = 'welcome' | 'login' | 'settings' | 'redirect';

export const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleFakeItClick = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('redirect');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  const handleRedirectComplete = () => {
    setCurrentPage('settings');
  };

  return (
    <div className="w-[400px] h-[600px] bg-black text-white overflow-hidden relative">
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-10 right-4 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite"
          }}
        />
        <div 
          className="absolute bottom-10 left-4 w-40 h-40 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)",
            animation: "pulse 5s ease-in-out infinite",
            animationDelay: "1s"
          }}
        />
      </div>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {currentPage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full"
          >
            <WelcomePage onFakeItClick={handleFakeItClick} />
          </motion.div>
        )}
        
        {currentPage === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full"
          >
            <LoginPage 
              onLoginSuccess={handleLoginSuccess}
              onBack={handleBackToWelcome}
            />
          </motion.div>
        )}
        
        {currentPage === 'redirect' && (
          <motion.div
            key="redirect"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full"
          >
            <RedirectPage onRedirectComplete={handleRedirectComplete} />
          </motion.div>
        )}
        
        {currentPage === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full"
          >
            <SettingsPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popup;
