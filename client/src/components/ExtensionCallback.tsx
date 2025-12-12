import { useEffect, useState } from 'react';

interface CallbackState {
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export default function ExtensionCallback() {
  const [state, setState] = useState<CallbackState>({ status: 'loading' });

  useEffect(() => {
    console.log('[Vercel Callback] Page chargée');
    console.log('[Vercel Callback] URL:', window.location.href);
    console.log('[Vercel Callback] Hash:', window.location.hash);
    
    // Extraire les tokens depuis l'URL hash
    const hash = window.location.hash.substring(1);
    if (!hash) {
      console.error('[Vercel Callback] Aucun hash trouvé dans l\'URL');
      setState({
        status: 'error',
        message: 'Aucun token trouvé dans l\'URL'
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
        message: errorDescription || error
      });
      
      // Essayer d'envoyer l'erreur à l'extension
      try {
        if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
          (window as any).chrome.runtime.sendMessage({
            type: 'OAUTH_CALLBACK',
            error: errorDescription || error
          });
        }
      } catch (e) {
        console.error('[Vercel Callback] Erreur lors de l\'envoi du message:', e);
      }
      
      setTimeout(() => {
        window.close();
      }, 3000);
      return;
    }
    
    if (!accessToken || !refreshToken) {
      console.error('[Vercel Callback] Tokens manquants');
      setState({
        status: 'error',
        message: 'Tokens manquants dans l\'URL'
      });
      setTimeout(() => {
        window.close();
      }, 3000);
      return;
    }
    
    console.log('[Vercel Callback] Tokens trouvés, envoi à l\'extension...');
    
    // Essayer d'envoyer les tokens à l'extension
    // Note: Cela ne fonctionnera que si la page est chargée dans le contexte de l'extension
    // Sinon, l'extension devra lire les tokens depuis l'URL capturée par chrome.identity
    try {
      if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
        (window as any).chrome.runtime.sendMessage({
          type: 'OAUTH_CALLBACK',
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken
          }
        }, function(response: any) {
          console.log('[Vercel Callback] Réponse de l\'extension:', response);
          if (response && response.success) {
            setState({
              status: 'success',
              message: 'Authentification réussie !'
            });
            setTimeout(() => {
              window.close();
            }, 2000);
          } else {
            // Même sans réponse de l'extension, on considère que c'est un succès
            // car chrome.identity.launchWebAuthFlow a capturé l'URL
            setState({
              status: 'success',
              message: 'Authentification réussie !'
            });
            setTimeout(() => {
              window.close();
            }, 2000);
          }
        });
      } else {
        // Si chrome.runtime n'est pas disponible, les tokens seront lus depuis l'URL
        // par chrome.identity.launchWebAuthFlow
        console.log('[Vercel Callback] chrome.runtime non disponible, les tokens seront lus depuis l\'URL');
        setState({
          status: 'success',
          message: 'Authentification réussie !'
        });
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    } catch (e) {
      console.error('[Vercel Callback] Erreur lors de l\'envoi du message:', e);
      // Les tokens seront lus depuis l'URL par chrome.identity
      setState({
        status: 'success',
        message: 'Authentification réussie !'
      });
      setTimeout(() => {
        window.close();
      }, 2000);
    }
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
      <div style={{ padding: '20px' }}>
        {state.status === 'loading' && (
          <>
            <div style={{
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
          <>
            <h2 style={{ color: '#4caf50', marginBottom: '10px' }}>✓ {state.message}</h2>
            <p>Vous pouvez fermer cette fenêtre</p>
          </>
        )}
        
        {state.status === 'error' && (
          <>
            <h2 style={{ color: '#ff4444', marginBottom: '10px' }}>Erreur d'authentification</h2>
            <p>{state.message}</p>
          </>
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
