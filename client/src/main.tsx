import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Vérifier que root existe avant de rendre
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id='root' in your HTML.");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
} catch (error) {
  console.error("Failed to render app:", error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; font-family: system-ui;">
        <div style="text-align: center; padding: 2rem;">
          <h1>Erreur de chargement</h1>
          <p>Une erreur s'est produite lors du chargement de l'application.</p>
          <pre style="margin-top: 1rem; padding: 1rem; background: #1a1a1a; border-radius: 8px; overflow: auto;">${error}</pre>
        </div>
      </div>
    `;
  }
}
