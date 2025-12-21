import { Routes, Route } from "react-router-dom";
import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";
import NotFound from "@/components/NotFound";
import ExtensionCallback from "@/components/ExtensionCallback";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "./ErrorBoundary";
import { WelcomePage } from "@/components/WelcomePage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { ExtensionPage } from "@/components/dashboard/ExtensionPage";
import { ExtensionConnectionsPage } from "@/components/dashboard/ExtensionConnectionsPage";
import { SettingsPage } from "@/components/dashboard/SettingsPage";
import { BillingPage } from "@/components/dashboard/BillingPage";
import { SalesNotificationsPage } from "@/components/dashboard/SalesNotificationsPage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/extension-callback" element={<ExtensionCallback />} />
        <Route 
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<DashboardHome />} />
          <Route path="extension" element={<ExtensionPage />} />
          <Route path="connections" element={<ExtensionConnectionsPage />} />
          <Route path="sales-notifications" element={<SalesNotificationsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
