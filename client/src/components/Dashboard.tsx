import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
    <div className="min-h-screen bg-black text-white">
      <style>{`
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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/favicon.png" alt="Proofy" className="h-8 w-8 object-contain rounded" />
              <div>
                <h1 className="text-xl font-semibold text-white">Proofy</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800">
                <User size={16} className="text-gray-400" />
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-400">{getUserEmail()}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 border-gray-800 text-white hover:bg-gray-800/50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Bienvenue, {getUserDisplayName()} 👋
          </h2>
          <p className="text-gray-400 text-lg">
            Générez vos preuves visuelles ultra-réalistes en quelques clics
          </p>
        </div>

        {/* Dashboard Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Card */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-white">Générer une preuve visuelle</h3>
            <p className="text-gray-400 mb-6">
              Créez des dashboards ultra-réalistes pour montrer vos ventes, revenus et activité.
            </p>
            <div className="space-y-4">
              <Button variant="gradient" size="lg" className="w-full">
                Créer un nouveau dashboard
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                Voir mes dashboards
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Statistiques</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-gray-400">Dashboards créés</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-gray-400">Exports réalisés</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Actions rapides</h4>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Templates
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Paramètres
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Aide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

