import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

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

      <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            Paramètres
          </h1>
          <p className="text-gray-400 text-lg">
            Gérez les paramètres et préférences de votre compte
          </p>
        </div>

        {/* Account Information Card */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Informations du compte</h2>
              <p className="text-gray-400 text-sm">Vos informations personnelles</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom
                </label>
                <div className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
                  {getUserDisplayName()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
                  {getUserEmail()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
