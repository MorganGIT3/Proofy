import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from './AuthForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
  const { user, loading, signInWithGoogle, signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleEmailLogin = () => {
    console.log("Email login clicked");
    // TODO: Navigate to email login form
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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInFromLeft 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>

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
        className="absolute left-1/2 top-1/2 w-full max-w-7xl pointer-events-none z-0 animate-fade-in"
        style={{
          transform: "translate(-50%, -50%)",
          animationDelay: "0.2s",
          opacity: 0
        }}
        aria-hidden="true"
      >
        <img
          src="https://i.postimg.cc/Ss6yShGy/glows.png"
          alt=""
          className="w-full h-auto"
          loading="eager"
        />
      </div>
      
      <div className="relative z-20 animate-scale-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center max-w-sm mx-auto animate-fade-in">
            {error}
          </div>
        )}
        <AuthForm
        logoSrc="/favicon.png"
        logoAlt="Proofy"
        title="Bienvenue sur Proofy"
        description="Connectez-vous pour générer vos preuves visuelles"
        primaryAction={{
          label: isLoading ? "Connexion..." : "Continuer avec Google",
          icon: <GoogleIcon />,
          onClick: handleGoogleLogin,
        }}
        secondaryActions={[
          {
            label: isLoading ? "Connexion..." : "Continuer avec Apple",
            icon: <AppleIcon />,
            onClick: handleAppleLogin,
          },
          {
            label: "Continuer avec Email",
            onClick: handleEmailLogin,
          },
        ]}
        skipAction={{
          label: "Continuer sans compte",
          onClick: handleSkip,
        }}
      />
      </div>
    </div>
  );
};

export default LoginPage;
