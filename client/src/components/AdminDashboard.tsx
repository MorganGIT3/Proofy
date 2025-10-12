import React, { useState, useEffect } from 'react';
import { getCurrentAdminSession, logoutAdmin, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Shield, Phone, TrendingUp, Users, Calendar, Plus, Minus, BarChart3, RefreshCw, Mail, UserCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminSession {
  code: string;
  name: string;
  level: string;
  description: string;
  permissions: string[];
  loginTime: string;
}

interface AdminCallStats {
  id: string;
  admin_name: string;
  call_count: number;
  weekly_count: number;
  last_updated: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  total_calls: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdminDashboard() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminCallStats[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUsersExpanded, setIsUsersExpanded] = useState(false);

  useEffect(() => {
    const session = getCurrentAdminSession();
    setAdminSession(session);
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Charger les stats des admins (TOUJOURS)
      await loadAdminStats();
      
      // Charger les utilisateurs (ne pas bloquer si erreur)
      try {
        await loadUsers();
      } catch (userError) {
        console.log('Pas d\'utilisateurs pour le moment:', userError);
        setUsers([]); // Continuer sans utilisateurs
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminStats = async () => {
    try {
      // D'abord, essayer de charger depuis localStorage (mode offline)
      const localStats = localStorage.getItem('admin_call_stats_local');
      
      // Essayer de charger depuis Supabase
      const { data: existingStats, error } = await supabase
        .from('admin_call_stats')
        .select('*')
        .order('admin_name');

      if (error || !existingStats || existingStats.length === 0) {
        // Si la table n'existe pas, utiliser localStorage
        console.log('Table admin_call_stats non trouvée, utilisation du localStorage');
        
        if (localStats) {
          const parsedStats = JSON.parse(localStats);
          setAdminStats(parsedStats);
          const total = parsedStats.reduce((sum: number, stat: AdminCallStats) => sum + stat.call_count, 0);
          const weekly = parsedStats.reduce((sum: number, stat: AdminCallStats) => sum + stat.weekly_count, 0);
          setTotalCalls(total);
          setWeeklyTotal(weekly);
        } else {
          // Créer des données par défaut
          const defaultStats: AdminCallStats[] = [
            {
              id: 'yohan',
              admin_name: 'Yohan',
              call_count: 0,
              weekly_count: 0,
              last_updated: new Date().toISOString()
            },
            {
              id: 'morgan',
              admin_name: 'Morgan',
              call_count: 0,
              weekly_count: 0,
              last_updated: new Date().toISOString()
            }
          ];
          localStorage.setItem('admin_call_stats_local', JSON.stringify(defaultStats));
          setAdminStats(defaultStats);
          setTotalCalls(0);
          setWeeklyTotal(0);
        }
        return;
      }

      // Si Supabase fonctionne, utiliser ces données
      setAdminStats(existingStats);
      const total = existingStats.reduce((sum, stat) => sum + stat.call_count, 0);
      const weekly = existingStats.reduce((sum, stat) => sum + stat.weekly_count, 0);
      setTotalCalls(total);
      setWeeklyTotal(weekly);
      
      // Sauvegarder aussi dans localStorage comme backup
      localStorage.setItem('admin_call_stats_local', JSON.stringify(existingStats));
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      
      // Utiliser localStorage en fallback
      const localStats = localStorage.getItem('admin_call_stats_local');
      if (localStats) {
        const parsedStats = JSON.parse(localStats);
        setAdminStats(parsedStats);
        const total = parsedStats.reduce((sum: number, stat: AdminCallStats) => sum + stat.call_count, 0);
        const weekly = parsedStats.reduce((sum: number, stat: AdminCallStats) => sum + stat.weekly_count, 0);
        setTotalCalls(total);
        setWeeklyTotal(weekly);
      } else {
        // Créer des données par défaut
        const defaultStats: AdminCallStats[] = [
          {
            id: 'yohan',
            admin_name: 'Yohan',
            call_count: 0,
            weekly_count: 0,
            last_updated: new Date().toISOString()
          },
          {
            id: 'morgan',
            admin_name: 'Morgan',
            call_count: 0,
            weekly_count: 0,
            last_updated: new Date().toISOString()
          }
        ];
        localStorage.setItem('admin_call_stats_local', JSON.stringify(defaultStats));
        setAdminStats(defaultStats);
        setTotalCalls(0);
        setWeeklyTotal(0);
      }
    }
  };

  const loadUsers = async () => {
    try {
      console.log('🔍 Chargement des utilisateurs depuis Supabase...');
      setUsers([]); // Initialiser vide pour éviter les erreurs
      
      // Méthode simple et sûre
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (profilesError) {
        console.log('⚠️ Table user_profiles non disponible:', profilesError.message);
        // Pas d'utilisateurs pour le moment, mais pas de crash
        setUsers([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ Aucun utilisateur dans user_profiles');
        setUsers([]);
        return;
      }

      console.log(`✅ ${profiles.length} utilisateurs trouvés`);
      
      // Créer les profils utilisateur avec les appels
      const usersWithCalls: UserProfile[] = [];
      
      for (const profile of profiles) {
        try {
          const { data: calls } = await supabase
            .from('call_history')
            .select('id')
            .eq('user_id', profile.user_id)
            .limit(50);

          usersWithCalls.push({
            id: profile.user_id || profile.id || 'unknown',
            email: profile.email || 'Non renseigné',
            full_name: profile.full_name || profile.email?.split('@')[0] || 'Utilisateur',
            created_at: profile.created_at || new Date().toISOString(),
            total_calls: calls?.length || 0
          });
        } catch (callError) {
          console.log('Erreur chargement appels pour un user:', callError);
          // Ajouter quand même l'utilisateur sans ses appels
          usersWithCalls.push({
            id: profile.user_id || profile.id || 'unknown',
            email: profile.email || 'Non renseigné',
            full_name: profile.full_name || profile.email?.split('@')[0] || 'Utilisateur',
            created_at: profile.created_at || new Date().toISOString(),
            total_calls: 0
          });
        }
      }

      setUsers(usersWithCalls);
      console.log(`✅ ${usersWithCalls.length} utilisateurs chargés avec succès`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      setUsers([]); // En cas d'erreur, liste vide mais pas de crash
    }
  };

  const incrementCallCount = async (adminName: string) => {
    setIsUpdating(adminName);
    try {
      const stat = adminStats.find(s => s.admin_name === adminName);
      if (!stat) return;

      const updatedStat = {
        ...stat,
        call_count: stat.call_count + 1,
        weekly_count: stat.weekly_count + 1,
        last_updated: new Date().toISOString()
      };

      // Essayer de mettre à jour dans Supabase
      try {
        const { error } = await supabase
          .from('admin_call_stats')
          .update({
            call_count: updatedStat.call_count,
            weekly_count: updatedStat.weekly_count,
            last_updated: updatedStat.last_updated
          })
          .eq('admin_name', adminName);

        if (error) {
          console.log('Supabase non disponible, utilisation du localStorage');
          throw error;
        }
      } catch (supabaseError) {
        console.log('Mise à jour en mode local uniquement');
      }

      // Toujours mettre à jour le localStorage
      const updatedStats = adminStats.map(s => 
        s.admin_name === adminName ? updatedStat : s
      );
      localStorage.setItem('admin_call_stats_local', JSON.stringify(updatedStats));

      // Recharger les stats
      await loadAdminStats();
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const decrementCallCount = async (adminName: string) => {
    setIsUpdating(adminName);
    try {
      const stat = adminStats.find(s => s.admin_name === adminName);
      if (!stat) return;

      // Ne pas descendre en dessous de 0
      if (stat.call_count <= 0 && stat.weekly_count <= 0) {
        console.log('Les compteurs sont déjà à 0');
        setIsUpdating(null);
        return;
      }

      const updatedStat = {
        ...stat,
        call_count: Math.max(0, stat.call_count - 1),
        weekly_count: Math.max(0, stat.weekly_count - 1),
        last_updated: new Date().toISOString()
      };

      // Essayer de mettre à jour dans Supabase
      try {
        const { error } = await supabase
          .from('admin_call_stats')
          .update({
            call_count: updatedStat.call_count,
            weekly_count: updatedStat.weekly_count,
            last_updated: updatedStat.last_updated
          })
          .eq('admin_name', adminName);

        if (error) {
          console.log('Supabase non disponible, utilisation du localStorage');
          throw error;
        }
      } catch (supabaseError) {
        console.log('Mise à jour en mode local uniquement');
      }

      // Toujours mettre à jour le localStorage
      const updatedStats = adminStats.map(s => 
        s.admin_name === adminName ? updatedStat : s
      );
      localStorage.setItem('admin_call_stats_local', JSON.stringify(updatedStats));

      // Recharger les stats
      await loadAdminStats();
    } catch (error) {
      console.error('Erreur lors de la décrémentation:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminSession(null);
    window.location.reload();
  };

  const handleRefreshUsers = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-xl"
        >
          Chargement du tableau de bord...
        </motion.div>
      </div>
    );
  }

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <Card className="w-96 bg-gray-800/80 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Accès Refusé</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Aucune session admin active trouvée
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = adminStats.map(stat => ({
    name: stat.admin_name,
    'Appels totaux': stat.call_count,
    'Cette semaine': stat.weekly_count
  }));

  const pieData = adminStats.map(stat => ({
    name: stat.admin_name,
    value: stat.call_count
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard Admin
            </h1>
            <p className="text-gray-300">
              Suivi des appels d'accompagnement • {adminSession.name}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </motion.div>

        {/* Statistiques Globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Total des appels
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-4xl font-bold">{totalCalls}</div>
              <p className="text-blue-100 text-xs mt-1">Tous les temps</p>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-none text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Cette semaine
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-4xl font-bold">{weeklyTotal}</div>
              <p className="text-green-100 text-xs mt-1">Reset chaque lundi</p>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{users.length}</div>
              <p className="text-purple-100 text-xs mt-1">Comptes créés</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {adminStats.length > 0 ? Math.round(totalCalls / adminStats.length) : 0}
              </div>
              <p className="text-orange-100 text-xs mt-1">Par coach</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compteurs Individuels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {adminStats.map((stat, index) => (
            <Card key={stat.id} className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center justify-between flex-wrap gap-3">
                  <span className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-400" />
                    {stat.admin_name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => decrementCallCount(stat.admin_name)}
                      disabled={isUpdating === stat.admin_name || (stat.call_count <= 0 && stat.weekly_count <= 0)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      -1 Appel
                    </Button>
                    <Button
                      onClick={() => incrementCallCount(stat.admin_name)}
                      disabled={isUpdating === stat.admin_name}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      +1 Appel
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-white">{stat.call_count}</div>
                    <div className="text-gray-400 text-sm mt-1">Total appels</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-400">{stat.weekly_count}</div>
                    <div className="text-gray-400 text-sm mt-1">Cette semaine</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Dernière mise à jour: {new Date(stat.last_updated).toLocaleString('fr-FR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Graphiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Bar Chart */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Répartition des appels
              </CardTitle>
              <CardDescription className="text-gray-400">
                Comparaison des performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Appels totaux" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Cette semaine" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Distribution totale
              </CardTitle>
              <CardDescription className="text-gray-400">
                Pourcentage par coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liste des utilisateurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
          <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Users className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <CardTitle className="text-white">Utilisateurs inscrits</CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {users.length} compte{users.length > 1 ? 's' : ''} créé{users.length > 1 ? 's' : ''} • Cliquez pour {isUsersExpanded ? 'masquer' : 'voir'} les utilisateurs
            </CardDescription>
                </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRefreshUsers}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  <Button
                    onClick={() => setIsUsersExpanded(!isUsersExpanded)}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    {isUsersExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Masquer
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Afficher
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {isUsersExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
              <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <UserCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Aucun utilisateur inscrit pour le moment</p>
                  <p className="text-gray-500 text-sm mt-2">Les nouveaux inscrits apparaîtront automatiquement ici</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-700/50 transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Colonne 1 : Avatar + Nom */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium flex items-center gap-2">
                              {user.full_name}
                            </div>
                            <div className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>

                        {/* Colonne 2 : Date d'inscription */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase">Inscrit le</div>
                            <div className="text-white font-medium">
                              {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-gray-400 text-xs">
                              à {new Date(user.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Colonne 3 : Nombre d'appels */}
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-400" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase">Appels réservés</div>
                            <div className="text-2xl font-bold text-green-400">
                              {user.total_calls}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {user.total_calls === 0 && 'Aucun appel'}
                              {user.total_calls === 1 && '1 appel réservé'}
                              {user.total_calls > 1 && `${user.total_calls} appels réservés`}
                            </div>
                          </div>
                        </div>

                        {/* Colonne 4 : Statut */}
                        <div className="flex justify-end">
                          <div className="text-center">
                            {user.total_calls > 0 ? (
                              <Badge className="bg-green-500 text-white">
                                ✓ Actif
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                                En attente
                              </Badge>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                </div>
              </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Footer avec statistiques */}
              {users.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-white">{users.length}</div>
                      <div className="text-xs text-gray-400 mt-1">Total d'utilisateurs</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {users.filter(u => u.total_calls > 0).length}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Utilisateurs actifs</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {users.reduce((sum, u) => sum + u.total_calls, 0)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Total d'appels réservés</div>
                </div>
              </div>
            </div>
              )}
          </CardContent>
            </motion.div>
            )}
        </Card>
        </motion.div>
      </div>
    </div>
  );
}
