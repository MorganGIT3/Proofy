import { Navigate, useLocation } from 'react-router-dom'
import { useSubscription, PlanTier } from '@/hooks/useSubscription'
import { Loader2 } from 'lucide-react'

interface PlanProtectedRouteProps {
  children: React.ReactNode
  requiredPlan?: 'BASIC' | 'LIVE' | null  // null = n'importe quel plan payant
  fallbackPath?: string
}

// Hiérarchie des plans
const PLAN_HIERARCHY: Record<PlanTier, number> = {
  'FREE': 0,
  'BASIC': 1,
  'LIVE': 2
}

export function PlanProtectedRoute({ 
  children, 
  requiredPlan = null,
  fallbackPath = '/dashboard/billing'
}: PlanProtectedRouteProps) {
  const { planName, isLoading, isActive } = useSubscription()
  const location = useLocation()

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si on demande juste un plan actif (peu importe lequel)
  if (requiredPlan === null) {
    if (!isActive) {
      return (
        <Navigate 
          to={fallbackPath} 
          state={{ 
            from: location,
            message: 'Vous devez avoir un abonnement actif pour accéder à cette fonctionnalité.',
            requiredPlan: 'any'
          }} 
          replace 
        />
      )
    }
    return <>{children}</>
  }

  // Vérifier la hiérarchie des plans
  const userPlanLevel = PLAN_HIERARCHY[planName]
  const requiredPlanLevel = PLAN_HIERARCHY[requiredPlan]

  if (userPlanLevel < requiredPlanLevel) {
    const message = planName === 'FREE'
      ? `Cette fonctionnalité nécessite le plan ${requiredPlan}. Souscrivez à un abonnement pour y accéder.`
      : `Cette fonctionnalité nécessite le plan ${requiredPlan}. Vous avez actuellement le plan ${planName}.`

    return (
      <Navigate 
        to={fallbackPath} 
        state={{ 
          from: location,
          message,
          requiredPlan,
          currentPlan: planName
        }} 
        replace 
      />
    )
  }

  return <>{children}</>
}
