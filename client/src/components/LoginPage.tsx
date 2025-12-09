import React from 'react';
import { useNavigate } from 'react-router-dom';

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      outline: "border border-gray-800 bg-transparent hover:bg-gray-800/50 text-white",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
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

// Inline Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-md border border-gray-800 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Inline Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium text-white ${className}`}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

// Inline Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={`h-4 w-4 rounded border-gray-800 bg-black/50 text-white focus:ring-2 focus:ring-white/20 ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

const ArrowLeft = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
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
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    // TODO: Add actual login logic here
    // After successful login, navigate to dashboard or home
    // navigate('/dashboard');
  };

  return (
    <section className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Image and Animated Bubbles */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out opacity-20"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1742273330004-ef9c9d228530?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDY0fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900)` }}
      >
        {/* Animated Bubbles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-bubble opacity-0"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4 md:p-8 lg:p-12">
        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-md bg-black/90 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-xl border border-gray-800">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <img src="/favicon.png" alt="Proofy" className="h-12 w-12" />
            <h1 className="text-2xl font-bold text-white ml-3">Proofy</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 text-center">Connexion</h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Connectez-vous pour générer vos preuves visuelles
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal text-gray-300 cursor-pointer">
                  Se souvenir de moi
                </Label>
              </div>
              <a href="#forgot-password" className="text-sm text-white/70 hover:text-white hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full">
              Se connecter
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Pas encore de compte ?{' '}
                <a href="#signup" className="text-white hover:underline font-medium">
                  S'inscrire
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* CSS for bubble animation */}
      <style>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--rand-x-offset) * 10vw)) scale(1.2);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble var(--animation-duration, 15s) ease-in-out infinite;
          animation-fill-mode: forwards;
          --rand-x-offset: ${Math.random() > 0.5 ? 1 : -1};
        }
      `}</style>
    </section>
  );
};

export default LoginPage;

