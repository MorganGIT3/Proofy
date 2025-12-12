import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface FirstNameModalProps {
  isOpen: boolean;
  onSave: (firstName: string) => Promise<void>;
}

export const FirstNameModal: React.FC<FirstNameModalProps> = ({ isOpen, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      setError('Veuillez entrer votre prénom');
      return;
    }

    if (firstName.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSave(firstName.trim());
    } catch (err: any) {
      console.error('Error saving first name:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop avec blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="rounded-xl border bg-black/95 border-gray-800 text-white shadow-lg">
          <div className="p-8">
            {/* Titre */}
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Pour commencer à crée tes preuves inscris ton Prénom !
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Nous avons besoin de ton prénom pour personnaliser ton expérience
            </p>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ prénom */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white text-base">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Entrez votre prénom"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-white/20 focus-visible:ring-2 h-12 text-base rounded-lg"
                  required
                  autoFocus
                  minLength={2}
                />
                {error && (
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                )}
              </div>

              {/* Bouton de validation */}
              <Button
                type="submit"
                disabled={isLoading || !firstName.trim() || firstName.trim().length < 2}
                className="w-full h-12 text-base font-medium transition-transform hover:scale-[1.02] bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 border border-orange-400 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Enregistrement...' : 'Continuer'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
