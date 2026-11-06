/**
 * SVAMS — Authentication Context
 * Session-based auth, CSRF, role-based permissions, auto-refresh (AUTH-01..05).
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type {
  User,
  AuthSession,
  RoleCode,
  LoginCredentials,
} from "../api/types"
import { apiService } from "../api/service"

type AuthContextType = {
  user: User | null
  token: string | null
  csrfToken: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (creds: LoginCredentials) => Promise<void>
  logout: () => void
  hasPermission: (role: RoleCode, action: string) => boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

// Role-based action permissions (RBAC-003)
const ROLE_PERMISSIONS: Record<RoleCode, string[]> = {
  Admin: ["*"],
  AuctionCell: ["lots:create", "lots:publish", "bids:view", "auctions:conduct"],
  Finance: ["payments:process", "refunds:process", "revenue:view"],
  Legal: ["clearance:grant", "court-stays:manage", "claims:review"],
  SHO: ["seizures:approve", "seizures:reject", "seizures:review"],
  PS: ["seizures:create", "notices:record", "documents:upload"],
  Bidder: ["bids:place", "wallet:view", "auctions:browse"],
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const hasPermission = useCallback(
    (role: RoleCode, action: string): boolean => {
      if (role === "Admin") return true
      const perms = ROLE_PERMISSIONS[role]
      if (perms?.includes("*")) return true
      return perms?.includes(action) ?? false
    },
    [],
  )

  const login = async (creds: LoginCredentials) => {
    const session: AuthSession = await apiService.login(creds)
    setUser(session.user)
    setToken(session.token)
    setCsrfToken(session.csrfToken)
    localStorage.setItem("svams_token", session.token)
    localStorage.setItem("svams_csrf", session.csrfToken)
    localStorage.setItem("svams_user", JSON.stringify(session.user))
    localStorage.setItem("svams_expires", session.expiresAt)
    startSessionRefresh()
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setCsrfToken(null)
    localStorage.removeItem("svams_token")
    localStorage.removeItem("svams_csrf")
    localStorage.removeItem("svams_user")
    localStorage.removeItem("svams_expires")
    stopSessionRefresh()
    window.location.href = "/login"
  }

  const refreshSession = async () => {
    if (!token) return
    try {
      // Mock: re-issue a new token with extended expiry
      const newExpires = new Date(Date.now() + 3600000).toISOString()
      localStorage.setItem("svams_expires", newExpires)
    } catch {
      // swallow - session refresh failures are non-fatal
    }
  }

  let refreshTimer: ReturnType<typeof setInterval> | null = null

  const startSessionRefresh = () => {
    stopSessionRefresh()
    // Auto-refresh every 5 minutes (AUTH-05)
    refreshTimer = setInterval(refreshSession, 5 * 60 * 1000)
  }

  const stopSessionRefresh = () => {
    if (refreshTimer) clearInterval(refreshTimer)
    refreshTimer = null
  }

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("svams_token")
    const storedUser = localStorage.getItem("svams_user")
    const storedCsrf = localStorage.getItem("svams_csrf")
    const storedExpires = localStorage.getItem("svams_expires")

    if (storedToken && storedUser && storedExpires) {
      const expires = new Date(storedExpires).getTime()
      if (Date.now() < expires) {
        setToken(storedToken)
        setCsrfToken(storedCsrf)
        setUser(JSON.parse(storedUser))
        startSessionRefresh()
      } else {
        // Session expired
        logout()
      }
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        csrfToken,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        hasPermission,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
