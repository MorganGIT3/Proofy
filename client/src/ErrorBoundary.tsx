import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#000',
          color: '#fff',
          fontFamily: 'system-ui',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Erreur de chargement</h1>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
              Une erreur s'est produite lors du chargement de l'application.
            </p>
            {this.state.error && (
              <details style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#1a1a1a',
                borderRadius: '8px',
                textAlign: 'left'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Détails de l'erreur
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.875rem'
                }}>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



