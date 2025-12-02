import { Routes, Route, useNavigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LandingPage } from "@/components/LandingPage";
import { Integrations } from "@/components/Integrations";
import { NewDashboardApp } from "@/components/NewDashboardApp";
import { OnboardingPage } from "@/components/OnboardingPage";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { signOutUser } from "@/lib/supabase";
import { ErrorBoundary } from "./ErrorBoundary";

function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/onboarding');
  };

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      // Déconnexion Supabase
      await signOutUser();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Redirection vers la page d'accueil
      navigate('/');
    }
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark">
            <Routes>
              <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
              <Route path="/landingpage" element={<LandingPage onLogin={handleLogin} />} />
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <OnboardingPage onContinue={handleOnboardingComplete} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <NewDashboardApp onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
