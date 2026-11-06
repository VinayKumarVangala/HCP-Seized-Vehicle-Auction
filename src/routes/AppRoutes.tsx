/**
 * SVAMS — Role-Based Routes with Guards
 * RBAC-001: All routes check user role before rendering.
 */

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import type { RoleCode } from "../api/types"
import { Spinner } from "../shared/ui/DataDisplay"

export type RoleGuard = RoleCode | RoleCode[]

interface RouteGuardProps {
  children: React.ReactNode
  roles: RoleGuard
}

export const RouteGuard = ({ children, roles }: RouteGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth()
  const allowed = Array.isArray(roles) ? roles : [roles]

  if (loading) return <Spinner />

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (!allowed.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

interface RequireAuthProps {
  children: React.ReactNode
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Spinner />

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}

// Helper to check role from current route match (used by screens that self-guard)
export const useRequiredRole = (allowed: RoleGuard) => {
  const { user } = useAuth()
  const roles = Array.isArray(allowed) ? allowed : [allowed]
  return user ? roles.includes(user.role) : false
}
