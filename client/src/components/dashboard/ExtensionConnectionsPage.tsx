import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, RefreshCw, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/useSubscription';

interface Connection {
  id: string;
  device_id: string;
  browser: string;
  browser_version: string;
  os: string;
  ip_address: string | null;
  connected_at: string;
  last_used_at: string;
}

// Fonction pour formater les dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const ExtensionConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const { planName, isLoading: subscriptionLoading } = useSubscription();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [totalUniqueConnections, setTotalUniqueConnections] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Get connection limit based on subscription tier
  const getMaxConnections = (): number => {
    switch (planName) {
      case 'FREE':
        return 0; // No connections allowed for free users
      case 'BASIC':
        return 2;
      case 'LIVE':
        return 5;
      default:
        return 0;
    }
  };
  
  const maxConnections = getMaxConnections();

  // Fonction pour récupérer les connexions depuis Supabase
  const fetchConnections = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:41',message:'fetchConnections called',data:{userId:user?.id,userExists:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!user) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:44',message:'User is null, returning early',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setLoading(false);
      return;
    }

    try {
      setError(null);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:49',message:'Before Supabase query',data:{userId:user.id,userIdType:typeof user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      const { data, error: fetchError } = await supabase
        .from('extension_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:56',message:'After Supabase query',data:{hasError:!!fetchError,errorCode:fetchError?.code,errorMessage:fetchError?.message,dataLength:data?.length,dataType:Array.isArray(data)?'array':'other'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (fetchError) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:59',message:'Supabase error thrown',data:{errorCode:fetchError.code,errorMessage:fetchError.message,errorDetails:fetchError.details},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw fetchError;
      }

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:65',message:'Setting connections',data:{connectionsCount:data?.length||0,firstConnection:data?.[0]?{id:data[0].id,browser:data[0].browser}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      // Filter to keep only unique IP addresses (most recent first since already sorted)
      const uniqueConnections = (data || []).reduce((acc: Connection[], connection) => {
        // Skip if IP is null or empty
        if (!connection.ip_address) {
          acc.push(connection);
          return acc;
        }
        
        // Check if this IP already exists in the accumulator
        const ipExists = acc.some(c => c.ip_address === connection.ip_address);
        if (!ipExists) {
          acc.push(connection);
        }
        return acc;
      }, []);
      
      // Store total unique connections count for display
      setTotalUniqueConnections(uniqueConnections.length);
      
      // Apply connection limit after deduplication
      const limitedConnections = uniqueConnections.slice(0, maxConnections);
      
      setConnections(limitedConnections);
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:68',message:'Catch block executed',data:{errorType:err?.constructor?.name,errorMessage:err?.message,errorCode:err?.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching connections:', err);
      setError(err.message || 'Erreur lors de la récupération des connexions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Charger les connexions au montage
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/1cf9d3a6-dd04-4ef4-b7e4-f06ce268b4f9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExtensionConnectionsPage.tsx:75',message:'useEffect triggered',data:{userExists:!!user,userId:user?.id,loading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (user) {
      fetchConnections();
    }
  }, [user, fetchConnections]);

  // Fonction pour actualiser
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchConnections();
  };

  // Fonction pour déconnecter
  const handleDisconnect = async (connectionId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('extension_connections')
        .delete()
        .eq('id', connectionId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Recharger la liste après suppression
      await fetchConnections();
    } catch (err: any) {
      console.error('Error disconnecting:', err);
      setError(err.message || 'Erreur lors de la déconnexion');
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute"
          style={{
            width: "1200px",
            height: "1200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            Connexions d'extension
          </h1>
          <p className="text-gray-400 text-lg">
            Gérez vos sessions actives de l'extension Chrome. {maxConnections > 0 ? `Maximum ${maxConnections} connexion${maxConnections > 1 ? 's' : ''} autorisée${maxConnections > 1 ? 's' : ''}.` : 'Aucune connexion autorisée avec votre plan actuel.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800/50 transition-colors opacity-50 cursor-not-allowed"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </motion.button>
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            whileHover={{ scale: refreshing ? 1 : 1.05 }}
            whileTap={{ scale: refreshing ? 1 : 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && connections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Aucune connexion d'extension active.
            </p>
          </div>
        )}

        {/* Connections List */}
        {!loading && connections.length > 0 && (
          <div className="space-y-4">
            {connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-semibold text-white">
                            {connection.browser} {connection.browser_version}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 mb-1">Système d'exploitation</p>
                            <p className="text-white">{connection.os}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Adresse IP</p>
                            <p className="text-white">{connection.ip_address || 'Non disponible'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Dernière utilisation</p>
                            <p className="text-white">{formatDate(connection.last_used_at)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Connecté</p>
                            <p className="text-white">{formatDate(connection.connected_at)}</p>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleDisconnect(connection.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors ml-4"
                      >
                        <X className="h-4 w-4" />
                        <span>Déconnecter</span>
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Limit Warning */}
        {!loading && !subscriptionLoading && (
          <>
            {totalUniqueConnections >= maxConnections && maxConnections > 0 && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-sm">
                Vous avez atteint la limite de {maxConnections} connexions autorisées ({totalUniqueConnections} / {maxConnections} utilisées).
              </div>
            )}
            {maxConnections === 0 && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                Aucune connexion autorisée avec votre plan actuel. Veuillez souscrire à un plan Basic ou Live pour utiliser l'extension.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
