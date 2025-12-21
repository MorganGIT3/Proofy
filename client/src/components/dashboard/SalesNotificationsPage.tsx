import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export const SalesNotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUnderstood = () => {
    navigate('/dashboard');
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center"
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

      {/* Modal/Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full mx-4"
      >
        <Card className="bg-gray-900/90 backdrop-blur-md border-orange-500/30 shadow-2xl shadow-orange-500/20">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
                <Bell className="w-8 h-8 text-orange-500" />
              </div>

              {/* Title */}
              <h2
                className="text-2xl sm:text-3xl font-medium"
                style={{
                  background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.05em"
                }}
              >
                Sales Notifications
              </h2>

              {/* Message */}
              <p className="text-gray-300 text-base leading-relaxed">
                Cette fonctionnalité n'est pas encore disponible. Un peu de patience, nos équipes travaillent activement dessus.
              </p>

              {/* Button */}
              <motion.button
                onClick={handleUnderstood}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-t from-orange-500 to-orange-600 text-white font-medium rounded-lg border border-orange-400 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300"
              >
                Compris
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
