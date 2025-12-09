import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Moon, Sun } from "lucide-react";

// Inlined Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "lg" | "icon";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variantClasses = {
      default: "bg-white text-black hover:bg-gray-100",
      outline: "border border-gray-800 bg-transparent hover:bg-gray-800/50 text-white",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button className={combinedClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Inlined ThemeToggle component
const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="w-10 h-10" aria-label="Toggle theme">
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const NotFoundAnimation = () => {
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setAnimationLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out forwards;
        }
      `}</style>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="animate-fade-in-up space-y-6 sm:space-y-8">
          <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 mx-auto animate-bounce-in">
            {animationLoaded ? (
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center border-2 border-white/10">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white/60">404</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-500">Loading...</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Oops! Page Not Found
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            The page you're looking for seems to have wandered off into the digital wilderness. Don't worry, it happens to the best of us!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Button
              onClick={handleGoHome}
              variant="default"
              size="lg"
              className="group w-full sm:w-auto bg-white text-black hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] min-h-[48px] sm:min-h-[44px]"
              aria-label="Go to home"
            >
              <Home className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-105" />
              Take Me Home
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="group w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] hover:bg-gray-800/50 min-h-[48px] sm:min-h-[44px]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Go Back
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            If you think this is a mistake, please{" "}
            <a href="mailto:support@proofy.com" className="text-white/70 hover:text-white hover:underline transition-colors duration-200 font-medium">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundAnimation;

