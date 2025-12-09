import React from "react";
import { useNavigate } from "react-router-dom";

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95"
    };
    
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icons
const ArrowRight = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Play = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Menu = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Video Demo Modal Component
const VideoDemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scaleIn">
        <div className="relative w-full max-w-4xl bg-black border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {/* Video Placeholder */}
              <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
                  }} />
                </div>
                
                {/* Play icon animation */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                    <Play size={40} className="text-white ml-1" />
                  </div>
                  <div className="text-white/60 text-sm font-medium animate-pulse">
                    Vidéo en création...
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Démo vidéo à venir
                </h3>
              </div>

              {/* CTA Button */}
              <Button
                type="button"
                variant="gradient"
                size="lg"
                onClick={onClose}
                className="mt-4"
              >
                Compris
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const Check = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Navigation Component
const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Proofy" className="h-8 w-8" />
            <div className="text-xl font-semibold text-white">Proofy</div>
          </div>
          
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="#fonctionnalites" className="text-sm text-white/60 hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-sm text-white/60 hover:text-white transition-colors">
              Tarifs
            </a>
            <a href="#demo" className="text-sm text-white/60 hover:text-white transition-colors">
              Démo
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button type="button" variant="ghost" size="sm">
              Connexion
            </Button>
            <Button type="button" variant="default" size="sm">
              Commencer
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 animate-[slideDown_0.3s_ease-out]">
          <div className="px-6 py-4 flex flex-col gap-4">
            <a
              href="#fonctionnalites"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fonctionnalités
            </a>
            <a
              href="#tarifs"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarifs
            </a>
            <a
              href="#demo"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Démo
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Button type="button" variant="ghost" size="sm">
                Connexion
              </Button>
              <Button type="button" variant="default" size="sm">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = "Navigation";

// Hero Component
const Hero = React.memo(() => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-20 md:py-24"
      style={{
        animation: "fadeIn 0.6s ease-out"
      }}
    >
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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Sous-titre psychologique */}
      <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full">
        <span className="text-xs text-center whitespace-nowrap" style={{ color: '#9ca3af' }}>
          Les gens n'achètent pas des promesses. Ils achètent ce qu'ils voient.
        </span>
      </aside>

      {/* Titre principal */}
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl px-6 leading-tight mb-6"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em"
        }}
      >
        Montre des résultats <br />avant même de les avoir.
      </h1>

      <p className="text-sm md:text-base text-center max-w-2xl px-6 mb-10" style={{ color: '#9ca3af' }}>
        Transforme l'attention en conversions grâce à des preuves visuelles instantanées.
      </p>

      {/* Boutons CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-16">
        <Button
          type="button"
          variant="gradient"
          size="lg"
          className="rounded-lg flex items-center justify-center"
          aria-label="Générer mes preuves"
          onClick={() => navigate('/login')}
        >
          Générer mes preuves
          <ArrowRight size={20} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-lg border-gray-700 text-white hover:bg-gray-800/50 flex items-center justify-center"
          aria-label="Voir la démo"
          onClick={() => setIsVideoModalOpen(true)}
        >
          <Play size={20} />
          Voir la démo
        </Button>
      </div>

      {/* Video Demo Modal */}
      <VideoDemoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />

      {/* Image dashboard preview */}
      <div className="w-full max-w-5xl relative pb-20">
        <div
          className="absolute left-1/2 w-[90%] pointer-events-none z-0"
          style={{
            top: "-23%",
            transform: "translateX(-50%)"
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
        
        <div className="relative z-10">
          <img
            src="https://i.postimg.cc/SKcdVTr1/Dashboard2.png"
            alt="Aperçu du dashboard Proofy montrant des analytics et métriques"
            className="w-full h-auto rounded-lg shadow-2xl"
            loading="eager"
          />
        </div>
      </div>

      {/* Fonctionnalités */}
      <div id="fonctionnalites" className="w-full max-w-3xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <Check size={18} className="text-white mt-0.5 flex-shrink-0" />
            <span>Crée des dashboards ultra-réalistes</span>
          </div>
          <div className="flex items-start gap-3">
            <Check size={18} className="text-white mt-0.5 flex-shrink-0" />
            <span>Affiche ventes, revenus & activité</span>
          </div>
          <div className="flex items-start gap-3">
            <Check size={18} className="text-white mt-0.5 flex-shrink-0" />
            <span>Parfait pour stories, pubs & tunnels</span>
          </div>
          <div className="flex items-start gap-3">
            <Check size={18} className="text-white mt-0.5 flex-shrink-0" />
            <span>Notifications en direct sur écran verrouillé</span>
          </div>
          <div className="flex items-start gap-3 md:col-span-2">
            <Check size={18} className="text-white mt-0.5 flex-shrink-0" />
            <span>Sans code. Sans installation. Instantané.</span>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

// Main Component
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
    </main>
  );
}
