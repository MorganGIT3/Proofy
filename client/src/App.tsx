import { Routes, Route } from "react-router-dom";
import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";
import NotFound from "@/components/NotFound";
import ExtensionCallback from "@/components/ExtensionCallback";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "./ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/extension-callback" element={<ExtensionCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
