import { useEffect, useState } from 'react';

interface CallbackState {
  status: 'loading' | 'success' | 'error';
  errorMessage?: string;
}

export default function ExtensionCallback() {
  const [state, setState] = useState<CallbackState>({ status: 'loading' });

  useEffect(() => {
    (function() {
      console.log('[Vercel Callback] Page chargée');
      console.log('[Vercel Callback] URL:', window.location.href);
      console.log('[Vercel Callback] Hash:', window.location.hash);
      
      // Extraire les tokens depuis l'URL hash
      const hash = window.location.hash.substring(1);
      if (!hash) {
        console.error('[Vercel Callback] Aucun hash trouvé dans l\'URL');
        setState({
          status: 'error',
          errorMessage: 'Aucun token trouvé dans l\'URL'
        });
        return;
      }
      
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      if (error) {
        console.error('[Vercel Callback] Erreur:', error, errorDescription);
        setState({
          status: 'error',
          errorMessage: errorDescription || error
        });
        
        // L'erreur sera capturée par chrome.identity.launchWebAuthFlow dans l'URL
        // Pas besoin d'envoyer de message, l'extension lira l'erreur depuis l'URL
        
        setTimeout(() => {
          window.close();
        }, 3000);
        return;
      }
      
      if (!accessToken || !refreshToken) {
        console.error('[Vercel Callback] Tokens manquants');
        setState({
          status: 'error',
          errorMessage: 'Tokens manquants dans l\'URL'
        });
        setTimeout(() => {
          window.close();
        }, 3000);
        return;
      }
      
      console.log('[Vercel Callback] Tokens trouvés dans l\'URL');
      console.log('[Vercel Callback] Les tokens seront automatiquement capturés par chrome.identity.launchWebAuthFlow');
      console.log('[Vercel Callback] L\'extension extraira les tokens depuis l\'URL hash');
      
      // Afficher un message de succès
      // Les tokens sont dans l'URL hash et seront capturés par chrome.identity.launchWebAuthFlow
      // L'extension n'a pas besoin de recevoir un message, elle lit directement depuis l'URL
      setState({
        status: 'success'
      });
      
      // Attendre un peu avant de fermer pour que chrome.identity capture l'URL
      setTimeout(() => {
        window.close();
      }, 2000);
    })();
  }, []);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      background: '#000',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div className="container" style={{ padding: '20px' }}>
        {state.status === 'loading' && (
          <>
            <div className="spinner" style={{
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid #fff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Authentification en cours...</p>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
              Cette fenêtre se fermera automatiquement
            </p>
          </>
        )}
        
        {state.status === 'success' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#4caf50' }}>✓ Authentification réussie !</h2>
            <p>Les tokens ont été capturés.</p>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
              Cette fenêtre se fermera automatiquement...
            </p>
          </div>
        )}
        
        {state.status === 'error' && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#ff4444' }}>
              {state.errorMessage === 'Aucun token trouvé dans l\'URL' || state.errorMessage === 'Tokens manquants dans l\'URL' ? 'Erreur' : 'Erreur d\'authentification'}
            </h2>
            <p>{state.errorMessage}</p>
          </div>
        )}
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
