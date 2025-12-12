import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from './AuthForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Rediriger vers le dashboard si déjà connecté
  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      // La navigation se fera automatiquement via le callback OAuth
    } catch (err: any) {
      console.error("Error signing in with Google:", err);
      setError(err.message || "Erreur lors de la connexion avec Google");
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithApple();
      // La navigation se fera automatiquement via le callback OAuth
    } catch (err: any) {
      console.error("Error signing in with Apple:", err);
      setError(err.message || "Erreur lors de la connexion avec Apple");
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }
    if (!validateEmail(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }
    setError(null);
    setShowPasswordField(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      // La navigation se fera automatiquement via le useEffect qui détecte l'utilisateur
    } catch (err: any) {
      console.error("Error with email authentication:", err);
      
      // Gérer les erreurs spécifiques de Supabase
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('Invalid credentials')) {
        // Si l'utilisateur n'existe pas, proposer l'inscription
        if (!isSignUp) {
          setError('Email ou mot de passe incorrect. Voulez-vous créer un compte ?');
          setIsSignUp(true);
        } else {
          setError('Erreur lors de la création du compte. Veuillez réessayer.');
        }
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Veuillez vérifier votre email avant de vous connecter');
      } else if (err.message?.includes('User already registered')) {
        setError('Cet email est déjà utilisé. Essayez de vous connecter.');
        setIsSignUp(false);
      } else {
        setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setShowPasswordField(false);
    setPassword('');
    setError(null);
  };

  const handleSkip = () => {
    navigate('/');
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si l'utilisateur est déjà connecté (redirection en cours)
  if (user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
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
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 200px;
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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInFromLeft 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>

      {/* Effets lumineux orange dans le fond */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Glow en haut à droite */}
        <div 
          className="absolute top-10 right-4 sm:top-20 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite"
          }}
        />
        {/* Glow au milieu gauche */}
        <div 
          className="absolute top-1/2 left-4 sm:left-10 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)",
            animation: "pulse 5s ease-in-out infinite",
            animationDelay: "1s"
          }}
        />
        {/* Glow en bas à droite */}
        <div 
          className="absolute bottom-10 sm:bottom-20 right-1/4 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)",
            animation: "pulse 6s ease-in-out infinite",
            animationDelay: "2s"
          }}
        />
        {/* Glow au centre */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full opacity-12 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)",
            animation: "pulse 4.5s ease-in-out infinite",
            animationDelay: "0.5s"
          }}
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-30 animate-slide-in-left">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 border-gray-800 text-white hover:bg-gray-800/50"
        >
          <ArrowLeft size={16} />
          Page d'accueil
        </Button>
      </div>

      {/* Background Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center animate-fade-in"
        style={{
          animationDelay: "0.2s",
          opacity: 0
        }}
        aria-hidden="true"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="https://i.postimg.cc/Ss6yShGy/glows.png"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto max-w-xl max-h-[50vh] object-contain"
            loading="eager"
          />
        </div>
      </div>
      
      <div className="relative z-20 animate-scale-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center max-w-sm mx-auto animate-fade-in">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-sm rounded-xl border bg-black/90 border-gray-800 text-white shadow-sm animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="p-6 pt-0 grid gap-4">
              {/* Logo and Title */}
              <div className="text-center pt-6">
                <div className="mb-4 flex justify-center">
                  <img src="/favicon.png" alt="Proofy" className="h-12 w-12 object-contain rounded-[4px]" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">Bienvenue sur Proofy</h2>
                <p className="text-gray-300 mt-2">Crée tes preuves visuelles en quelques secondes.</p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      disabled={showPasswordField || isLoading}
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-white/20 pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                {!showPasswordField && (
                  <Button 
                    type="submit" 
                    className="w-full transition-transform hover:scale-[1.03] bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white hover:opacity-90"
                    disabled={isLoading}
                  >
                    Continuer
                  </Button>
                )}
              </form>

              {/* Password Field with Animation */}
              {showPasswordField && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-slide-down">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">Mot de passe</Label>
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Changer d'email
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      disabled={isLoading}
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full transition-transform hover:scale-[1.03] bg-gradient-to-t from-orange-500 to-orange-600 shadow-lg shadow-orange-500 border border-orange-400 text-white hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : isSignUp ? "Créer un compte" : "Se connecter"}
                  </Button>
                  
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setError(null);
                      }}
                      className="text-xs text-gray-400 hover:text-white transition-colors w-full text-center"
                    >
                      Pas encore de compte ? Créer un compte
                    </button>
                  )}
                  
                  {isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setError(null);
                      }}
                      className="text-xs text-gray-400 hover:text-white transition-colors w-full text-center"
                    >
                      Déjà un compte ? Se connecter
                    </button>
                  )}
                </form>
              )}

              {/* OR Separator */}
              {!showPasswordField && (
                <>
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black px-2 text-gray-400">ou</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <Button 
                    className="w-full transition-transform hover:scale-[1.03] bg-white border border-gray-300 text-black hover:bg-gray-100"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    {isLoading ? "Connexion..." : "Continuer avec Google"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
