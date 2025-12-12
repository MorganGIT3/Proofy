import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExtensionCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Cette page ne sera jamais vraiment vue car chrome.identity intercepte
    // Mais elle DOIT exister pour que Google accepte l'URL
    console.log('Extension callback page loaded');
    
    // Optionnel : rediriger vers le dashboard après 2 secondes
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      textAlign: 'center',
      background: '#000',
      color: '#fff'
    }}>
      <h1>Authentification réussie</h1>
      <p>Vous pouvez fermer cette fenêtre.</p>
    </div>
  );
}
