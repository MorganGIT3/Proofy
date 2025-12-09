import { Routes, Route } from "react-router-dom";
import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";
import NotFound from "@/components/NotFound";
import { ErrorBoundary } from "./ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
