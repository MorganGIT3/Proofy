import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - RizeAppHub™
const supabaseUrl = 'https://dewpygnammmyvhporthh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRld3B5Z25hbW1teXZocG9ydGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjA4NjksImV4cCI6MjA3MjQ5Njg2OX0.JQ0ugaiP3CMI0O2otvaacq1UG8Bil0J0Djbegbb22Gg'

// Créer le client Supabase avec les options d'authentification
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce'
  }
})

// Codes admin avec différents niveaux d'accès
const ADMIN_CODES = {
  'admin123': { 
    name: 'Admin Principal', 
    level: 'admin', 
    description: 'Accès administrateur standard',
    permissions: ['read', 'write', 'delete']
  },
  'smartapp2024': { 
    name: 'RizeAppHub 2024', 
    level: 'admin', 
    description: 'Accès RizeAppHub™ 2024',
    permissions: ['read', 'write']
  },
  'academy2024': { 
    name: 'Academy 2024', 
    level: 'admin', 
    description: 'Accès académie 2024',
    permissions: ['read', 'write']
  },
  'master2024': { 
    name: 'Master 2024', 
    level: 'super_admin', 
    description: 'Accès master avec privilèges étendus',
    permissions: ['read', 'write', 'delete', 'admin_manage']
  },
  'superadmin': { 
    name: 'Super Admin', 
    level: 'super_admin', 
    description: 'Accès super administrateur',
    permissions: ['read', 'write', 'delete', 'admin_manage', 'system_manage']
  }
}

// Fonction pour vérifier le code admin via Supabase
export const verifyAdminCode = async (code: string): Promise<{ valid: boolean; adminInfo?: any }> => {
  try {
    const normalizedCode = code.toLowerCase().trim()
    
    // Vérifier d'abord dans les codes locaux (fallback)
    const localAdminInfo = ADMIN_CODES[normalizedCode as keyof typeof ADMIN_CODES]
    if (localAdminInfo) {
      console.log(`Accès admin accordé (local): ${localAdminInfo.name} (${localAdminInfo.level})`)
      
      // Stocker les infos admin dans le localStorage pour la session
      localStorage.setItem('admin_session', JSON.stringify({
        code: normalizedCode,
        ...localAdminInfo,
        loginTime: new Date().toISOString()
      }))
      
      return { valid: true, adminInfo: localAdminInfo }
    }
    
    // Essayer de vérifier via Supabase
    try {
      const { data, error } = await supabase
        .from('admin_codes')
        .select('*')
        .eq('code', normalizedCode)
        .eq('is_active', true)
        .single()
      
      if (error || !data) {
        return { valid: false }
      }
      
      // Vérifier les limites d'utilisation
      if (data.max_uses && data.used_count >= data.max_uses) {
        console.log('Code admin épuisé')
        return { valid: false }
      }
      
      // Vérifier l'expiration
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        console.log('Code admin expiré')
        return { valid: false }
      }
      
      // Incrémenter le compteur d'utilisation
      await supabase
        .from('admin_codes')
        .update({ used_count: data.used_count + 1 })
        .eq('id', data.id)
      
      const adminInfo = {
        name: data.name,
        level: data.level,
        description: data.description,
        permissions: data.level === 'super_admin' 
          ? ['read', 'write', 'delete', 'admin_manage', 'system_manage']
          : ['read', 'write', 'delete']
      }
      
      console.log(`Accès admin accordé (Supabase): ${adminInfo.name} (${adminInfo.level})`)
      
      // Stocker les infos admin dans le localStorage pour la session
      localStorage.setItem('admin_session', JSON.stringify({
        code: normalizedCode,
        ...adminInfo,
        loginTime: new Date().toISOString()
      }))
      
      return { valid: true, adminInfo }
      
    } catch (supabaseError) {
      console.log('Supabase non disponible, utilisation des codes locaux')
      return { valid: false }
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification du code admin:', error)
    return { valid: false }
  }
}

// Fonction pour obtenir la session admin actuelle
export const getCurrentAdminSession = () => {
  try {
    const session = localStorage.getItem('admin_session')
    if (session) {
      const adminData = JSON.parse(session)
      // Vérifier si la session n'est pas expirée (24h)
      const loginTime = new Date(adminData.loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff < 24) {
        return adminData
      } else {
        localStorage.removeItem('admin_session')
        return null
      }
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération de la session admin:', error)
    return null
  }
}

// Fonction pour déconnecter l'admin
export const logoutAdmin = () => {
  localStorage.removeItem('admin_session')
  console.log('Session admin fermée')
}

// Fonction utilitaire pour créer ou mettre à jour le profil utilisateur
export const ensureUserProfile = async (userId: string, email: string, fullName?: string): Promise<boolean> => {
  try {
    // Vérifier si le profil existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    // Si le profil n'existe pas, le créer
    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: email,
          full_name: fullName || email.split('@')[0] || 'Utilisateur',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('⚠️ Erreur lors de la création du profil:', insertError);
        return false;
      }
      
      console.log('✅ Profil utilisateur créé');
      return true;
    }
    
    return true;
  } catch (error: any) {
    console.error('⚠️ Erreur lors de la vérification/création du profil:', error);
    return false;
  }
}

// Fonction pour créer un utilisateur - VERSION SIMPLIFIÉE
export const signUpUser = async (email: string, password: string, fullName?: string) => {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('🔵 INSCRIPTION - Début');
    console.log('📧 Email:', email);
    console.log('👤 Nom:', fullName || 'Non fourni');
    console.log('═══════════════════════════════════════════════');
    
    // NETTOYER L'EMAIL
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const error = new Error('Email invalide');
      console.error('❌ Erreur: Email invalide');
      return { data: null, error };
    }
    
    if (!password || password.length < 6) {
      const error = new Error('Le mot de passe doit contenir au moins 6 caractères');
      console.error('❌ Erreur: Mot de passe trop court');
      return { data: null, error };
    }
    
    // CRÉER LE COMPTE DANS SUPABASE AUTH - VERSION SIMPLE
    console.log('📤 Envoi de la demande à Supabase Auth...');
    
    const signUpResult = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          full_name: fullName?.trim() || ''
        },
        emailRedirectTo: `${window.location.origin}`
      }
    });
    
    console.log('📥 Réponse de Supabase Auth reçue');
    console.log('   - User créé:', !!signUpResult.data?.user);
    console.log('   - Session créée:', !!signUpResult.data?.session);
    console.log('   - User ID:', signUpResult.data?.user?.id);
    console.log('   - Email:', signUpResult.data?.user?.email);
    console.log('   - Erreur:', signUpResult.error?.message || 'Aucune');
    
    // VÉRIFIER LES ERREURS
    if (signUpResult.error) {
      console.error('❌ ERREUR SUPABASE:', signUpResult.error);
      console.log('═══════════════════════════════════════════════');
      return { 
        data: signUpResult.data, 
        error: signUpResult.error 
      };
    }
    
    // VÉRIFIER QUE L'UTILISATEUR A ÉTÉ CRÉÉ
    if (!signUpResult.data?.user) {
      const error = new Error('Aucun utilisateur créé. Vérifiez votre configuration Supabase.');
      console.error('❌ ERREUR: Aucun utilisateur créé');
      console.log('═══════════════════════════════════════════════');
      return { 
        data: signUpResult.data, 
        error 
      };
    }
    
    console.log('✅ COMPTE CRÉÉ DANS SUPABASE AUTH');
    console.log('   User ID:', signUpResult.data.user.id);
    
    // CRÉER LE PROFIL UTILISATEUR SI SESSION ACTIVE
    if (signUpResult.data.session) {
      console.log('✅ SESSION ACTIVE - Création du profil...');
      
      // Attendre un peu pour laisser le trigger SQL faire son travail
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer le profil manuellement si nécessaire
      const profileCreated = await ensureUserProfile(
        signUpResult.data.user.id,
        signUpResult.data.user.email || cleanEmail,
        fullName?.trim() || signUpResult.data.user.user_metadata?.full_name
      );
      
      if (profileCreated) {
        console.log('✅ PROFIL UTILISATEUR CRÉÉ');
      }
    } else {
      console.log('⚠️ Pas de session active (email à confirmer)');
      console.log('   Le profil sera créé lors de la première connexion');
    }
    
    console.log('✅ INSCRIPTION RÉUSSIE');
    console.log('═══════════════════════════════════════════════');
    
    // RETOURNER LE SUCCÈS
    return { 
      data: signUpResult.data, 
      error: null 
    };
    
  } catch (error: any) {
    console.error('❌ EXCEPTION LORS DE L\'INSCRIPTION:', error);
    console.log('═══════════════════════════════════════════════');
    return { 
      data: null, 
      error: error || new Error('Erreur inattendue lors de l\'inscription') 
    };
  }
}

// Fonction pour connecter un utilisateur
export const signInUser = async (email: string, password: string) => {
  try {
    console.log('🔵 Tentative de connexion pour:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return { data, error }
    }
    
    // Si la connexion réussit, s'assurer que le profil utilisateur existe
    if (data.user && data.session) {
      console.log('✅ Connexion réussie, vérification du profil utilisateur...');
      
      // Créer le profil si nécessaire
      await ensureUserProfile(
        data.user.id,
        data.user.email || email,
        data.user.user_metadata?.full_name
      );
    }
    
    return { data, error }
  } catch (error) {
    console.error('❌ Exception lors de la connexion:', error)
    return { data: null, error }
  }
}

// Fonction pour déconnecter un utilisateur
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    return { error }
  }
}

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (email: string) => {
  try {
    console.log('Demande de réinitialisation de mot de passe pour:', email)
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    console.log('Réponse réinitialisation:', { data, error })
    
    if (error) {
      console.error('Erreur réinitialisation:', error)
      return { data, error }
    }
    
    console.log('Email de réinitialisation envoyé avec succès')
    return { data, error }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    return { data: null, error }
  }
}

// Fonction pour obtenir l'utilisateur actuel
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

// Interface pour le profil utilisateur avec dates d'accompagnement
export interface UserProfile {
  id: string
  user_id: string
  email: string | null
  full_name: string | null
  accompaniment_start_date: string | null
  accompaniment_end_date: string | null
  created_at: string
  updated_at: string
}

// Récupérer le profil utilisateur avec les dates d'accompagnement
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erreur dans getUserProfile:', error)
    return null
  }
}

// Fonction pour mettre à jour les dates d'accompagnement (admin seulement)
export const updateUserAccompanimentDates = async (
  userId: string, 
  startDate: string | null, 
  endDate: string | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        accompaniment_start_date: startDate,
        accompaniment_end_date: endDate,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Erreur lors de la mise à jour des dates:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erreur dans updateUserAccompanimentDates:', error)
    return { success: false, error: error.message }
  }
}

// Récupérer tous les profils utilisateurs (admin seulement)
export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des profils:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erreur dans getAllUserProfiles:', error)
    return []
  }
}

// ===== FONCTIONS CALENDRIER =====

// Interface pour les événements du calendrier
export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  description?: string
  event_date: string
  start_time?: string
  end_time?: string
  is_all_day: boolean
  event_type: 'appointment' | 'meeting' | 'call' | 'task' | 'reminder' | 'personal'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  color: string
  location?: string
  participants?: any[]
  notes?: string
  created_at: string
  updated_at: string
}

// Récupérer tous les événements d'un utilisateur pour une période donnée
export const getCalendarEvents = async (startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })

    if (startDate && endDate) {
      query = query
        .gte('event_date', startDate.toISOString().split('T')[0])
        .lte('event_date', endDate.toISOString().split('T')[0])
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des événements:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Erreur dans getCalendarEvents:', error)
    return []
  }
}

// Créer un nouvel événement
export const createCalendarEvent = async (eventData: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        ...eventData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de l\'événement:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans createCalendarEvent:', error)
    return null
  }
}

// Mettre à jour un événement
export const updateCalendarEvent = async (eventId: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .update(eventData)
      .eq('id', eventId)
      .eq('user_id', user.id) // Sécurité : s'assurer que l'utilisateur ne peut modifier que ses événements
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans updateCalendarEvent:', error)
    return null
  }
}

// Supprimer un événement
export const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', user.id) // Sécurité : s'assurer que l'utilisateur ne peut supprimer que ses événements

    if (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Erreur dans deleteCalendarEvent:', error)
    return false
  }
}

// ===== FONCTIONS CAL.COM =====

// Configuration Cal.com
const CAL_COM_USERNAME = 'smartappacademy' // Remplacez par votre nom d'utilisateur Cal.com

// Interface pour les événements Cal.com
export interface CalComEvent {
  id: number
  title: string
  description?: string
  startTime: string
  endTime: string
  attendees: Array<{
    email: string
    name?: string
    timeZone?: string
  }>
  eventType: {
    id: number
    title: string
    length: number
    slug: string
  }
  status: 'ACCEPTED' | 'PENDING' | 'CANCELLED'
  location?: string
  uid: string
}

// Interface pour les types d'événements Cal.com (simplifiée)
export interface CalComEventType {
  id: string
  title: string
  slug: string
  length: number
  description?: string
  price?: string
}

// Types d'événements prédéfinis (vous pouvez les personnaliser)
export const getCalComEventTypes = async (): Promise<CalComEventType[]> => {
  // Retourner des types d'événements prédéfinis
  return [
    {
      id: 'audit-gratuit',
      title: 'Audit Gratuit',
      slug: 'audit-gratuit',
      length: 30,
      description: 'Analyse complète de votre stratégie marketing actuelle',
      price: 'Gratuit'
    },
    {
      id: 'strategie-personnalisee',
      title: 'Stratégie Personnalisée',
      slug: 'strategie-personnalisee',
      length: 60,
      description: 'Plan d\'action sur mesure pour votre entreprise',
      price: 'Sur devis'
    },
    {
      id: 'formation-ia',
      title: 'Formation IA',
      slug: 'formation-ia',
      length: 45,
      description: 'Formation sur l\'utilisation de l\'IA dans le marketing',
      price: 'Sur devis'
    }
  ]
}

// Obtenir l'URL Cal.com pour un type d'événement
export const getCalComBookingUrl = (eventSlug: string): string => {
  return `https://cal.com/${CAL_COM_USERNAME}/${eventSlug}`
}

// Obtenir l'URL principale Cal.com
export const getCalComMainUrl = (): string => {
  return `https://cal.com/${CAL_COM_USERNAME}`
}

// ===== FONCTIONS TOKENS UTILISATEURS =====

// Interface pour les tokens utilisateur
export interface UserTokens {
  id: string
  user_id: string
  tokens_available: number
  tokens_used: number
  last_reset_date: string
  created_at: string
  updated_at: string
}

// Récupérer les tokens d'un utilisateur
export const getUserTokens = async (): Promise<UserTokens | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erreur lors de la récupération des tokens:', error)
      throw error
    }

    // Si l'utilisateur n'a pas d'enregistrement, en créer un
    if (!data) {
      const { data: newTokens, error: insertError } = await supabase
        .from('user_tokens')
        .insert({
          user_id: user.id,
          tokens_available: 1,
          tokens_used: 0,
          last_reset_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

      if (insertError) {
        console.error('Erreur lors de la création des tokens:', insertError)
        throw insertError
      }

      return newTokens
    }

    return data
  } catch (error) {
    console.error('Erreur dans getUserTokens:', error)
    return null
  }
}

// Utiliser un token pour réserver un appel
export const useBookingToken = async (): Promise<{ success: boolean; message: string; tokensRemaining?: number }> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    // Appeler la fonction PostgreSQL pour utiliser un token
    const { data, error } = await supabase.rpc('use_booking_token', {
      user_uuid: user.id
    })

    if (error) {
      console.error('Erreur lors de l\'utilisation du token:', error)
      throw error
    }

    // Récupérer les tokens mis à jour
    const updatedTokens = await getUserTokens()

    if (data) {
      return {
        success: true,
        message: 'Token utilisé avec succès',
        tokensRemaining: updatedTokens?.tokens_available || 0
      }
    } else {
      return {
        success: false,
        message: 'Aucun token disponible. Vos tokens se rechargent tous les lundis.',
        tokensRemaining: updatedTokens?.tokens_available || 0
      }
    }
  } catch (error) {
    console.error('Erreur dans useBookingToken:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'utilisation du token'
    }
  }
}

// Réinitialiser manuellement les tokens (pour les tests)
export const resetUserTokens = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { error } = await supabase
      .from('user_tokens')
      .update({
        tokens_available: 1,
        tokens_used: 0,
        last_reset_date: new Date().toISOString().split('T')[0]
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur lors de la réinitialisation des tokens:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Erreur dans resetUserTokens:', error)
    return false
  }
}

// ===== FONCTIONS NOTES D'APPELS =====

// Interface pour les notes d'appels
export interface CallNote {
  id: string
  call_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

// Interface pour les détails d'appel
export interface CallDetails {
  id: string
  user_id: string
  call_date: string
  call_time: string
  call_duration: string
  call_type: string
  status: 'scheduled' | 'completed' | 'cancelled'
  cal_com_event_id?: string
  created_at: string
  updated_at: string
}

// Récupérer les détails d'un appel
export const getCallDetails = async (callId: string): Promise<CallDetails | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_details')
      .select('*')
      .eq('id', callId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération des détails d\'appel:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans getCallDetails:', error)
    return null
  }
}

// Créer ou mettre à jour les détails d'un appel
export const upsertCallDetails = async (callData: Omit<CallDetails, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CallDetails | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_details')
      .upsert({
        ...callData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la sauvegarde des détails d\'appel:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans upsertCallDetails:', error)
    return null
  }
}

// Récupérer toutes les notes d'un appel
export const getCallNotes = async (callId: string): Promise<CallNote[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_notes')
      .select('*')
      .eq('call_id', callId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des notes:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Erreur dans getCallNotes:', error)
    return []
  }
}

// Créer une nouvelle note
export const createCallNote = async (callId: string, content: string): Promise<CallNote | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_notes')
      .insert({
        call_id: callId,
        user_id: user.id,
        content: content.trim()
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la note:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans createCallNote:', error)
    return null
  }
}

// Mettre à jour une note
export const updateCallNote = async (noteId: string, content: string): Promise<CallNote | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_notes')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de la note:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans updateCallNote:', error)
    return null
  }
}

// Supprimer une note
export const deleteCallNote = async (noteId: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { error } = await supabase
      .from('call_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur lors de la suppression de la note:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Erreur dans deleteCallNote:', error)
    return false
  }
}

// Récupérer tous les appels d'un utilisateur
export const getUserCalls = async (): Promise<CallDetails[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_details')
      .select('*')
      .eq('user_id', user.id)
      .order('call_date', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des appels:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Erreur dans getUserCalls:', error)
    return []
  }
}

// ===== FONCTIONS HISTORIQUE DES APPELS =====

// Interface pour l'historique des appels
export interface CallHistory {
  id: string
  user_id: string
  call_date: string
  call_type: 'weekly_call' | 'consultation' | 'support' | 'other'
  duration_minutes?: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  cal_com_event_id?: string
  created_at: string
  updated_at: string
}

// Récupérer l'historique des appels d'un utilisateur
export const getCallHistory = async (): Promise<CallHistory[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_history')
      .select('*')
      .eq('user_id', user.id)
      .order('call_date', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Erreur dans getCallHistory:', error)
    return []
  }
}

// Ajouter un appel à l'historique
export const addCallToHistory = async (callData: {
  call_date: string
  call_type?: 'weekly_call' | 'consultation' | 'support' | 'other'
  duration_minutes?: number
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  cal_com_event_id?: string
}): Promise<CallHistory | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { data, error } = await supabase
      .from('call_history')
      .insert({
        user_id: user.id,
        ...callData
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'appel:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur dans addCallToHistory:', error)
    return null
  }
}

// Mettre à jour les notes d'un appel
export const updateCallNotes = async (callId: string, notes: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { error } = await supabase
      .from('call_history')
      .update({ 
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', callId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur lors de la mise à jour des notes:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Erreur dans updateCallNotes:', error)
    return false
  }
}

// Supprimer un appel de l'historique
export const deleteCallFromHistory = async (callId: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    const { error } = await supabase
      .from('call_history')
      .delete()
      .eq('id', callId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erreur lors de la suppression de l\'appel:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Erreur dans deleteCallFromHistory:', error)
    return false
  }
}
