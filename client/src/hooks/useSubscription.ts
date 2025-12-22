import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// Types
export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_product_id: string | null
  plan_name: 'BASIC' | 'LIVE' | null
  billing_period: 'monthly' | 'yearly' | null
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export type PlanTier = 'FREE' | 'BASIC' | 'LIVE'

export interface UseSubscriptionReturn {
  subscription: Subscription | null
  isLoading: boolean
  error: Error | null
  isActive: boolean
  planName: PlanTier
  isPro: boolean      // true si BASIC ou LIVE
  isLive: boolean     // true uniquement si LIVE
  refresh: () => Promise<void>
}

// Statuts considérés comme "actifs"
const ACTIVE_STATUSES = ['active', 'trialing']

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fonction pour récupérer l'abonnement
  const fetchSubscription = useCallback(async () => {
    // Si pas d'utilisateur, pas d'abonnement
    if (!user) {
      setSubscription(null)
      setIsLoading(false)
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle() // Utiliser maybeSingle au lieu de single pour éviter l'erreur si pas de résultat

      if (fetchError) {
        console.error('Error fetching subscription:', fetchError)
        throw fetchError
      }

      // data peut être null si pas d'abonnement = utilisateur FREE
      setSubscription(data)
      
    } catch (err) {
      console.error('useSubscription error:', err)
      setError(err instanceof Error ? err : new Error('Erreur lors de la récupération de l\'abonnement'))
      setSubscription(null)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Charger l'abonnement au montage et quand l'utilisateur change
  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`subscription-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Subscription changed:', payload)
          // Rafraîchir les données
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchSubscription])

  // Calculer les états dérivés
  const isActive = subscription 
    ? ACTIVE_STATUSES.includes(subscription.status) 
    : false

  // IMPORTANT: Par défaut = FREE si pas d'abonnement actif
  const planName: PlanTier = isActive && subscription?.plan_name
    ? subscription.plan_name
    : 'FREE'

  const isPro = planName === 'BASIC' || planName === 'LIVE'
  const isLive = planName === 'LIVE'

  return {
    subscription,
    isLoading,
    error,
    isActive,
    planName,
    isPro,
    isLive,
    refresh: fetchSubscription
  }
}
