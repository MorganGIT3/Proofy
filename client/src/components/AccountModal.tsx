import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, User, LogOut, Upload } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '');
  const [username, setUsername] = useState(user?.email?.split('@')[0] || '');
  const [useCustomUsername, setUseCustomUsername] = useState(true);

  if (!isOpen) return null;

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Utilisateur';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveProfile = () => {
    // TODO: Implémenter la sauvegarde du profil
    console.log('Saving profile:', { displayName, username });
    // Ici vous pourriez appeler une API pour mettre à jour le profil
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl h-[85vh] bg-black border border-gray-800 rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-gray-800"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Account</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Basic information</h4>
                  
                  {/* Avatar Section */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-800 text-white hover:bg-gray-800/50 mb-2"
                      >
                        <Upload size={16} />
                        Change Avatar
                      </Button>
                      <p className="text-xs text-gray-400">Or drag and drop an image anywhere on this area</p>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="mb-4">
                    <label htmlFor="displayName" className="text-sm font-medium text-gray-300 mb-2 block">
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Display Name"
                    />
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label htmlFor="username" className="text-sm font-medium text-gray-300 mb-2 block">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Username"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="customUsername"
                        checked={useCustomUsername}
                        onChange={(e) => setUseCustomUsername(e.target.checked)}
                        className="rounded border-gray-700 bg-gray-900"
                      />
                      <label htmlFor="customUsername" className="text-sm text-gray-400">
                        Use custom username
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            </div>
        </div>

        {/* Footer with Logout */}
        <div className="border-t border-gray-800 p-4 flex items-center justify-between bg-gray-900/30">
          <div className="text-sm text-gray-400">
            Connecté en tant que <span className="text-white">{getUserEmail()}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-400 border-red-400/50 hover:bg-red-400/10"
          >
            <LogOut size={16} />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};
