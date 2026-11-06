/**
 * SVAMS — Login Screen
 * Role selection + demo credentials (AUTH-03).
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../shared/ui"
import type { RoleCode } from "../api/types"

const DEMO_CREDS: Record<RoleCode, { employeeId: string; name: string }> = {
  PS: { employeeId: "TS-PS-0312", name: "Ravi Kumar (PS Officer)" },
  SHO: { employeeId: "TS-SHO-0087", name: "Suresh Reddy (SHO)" },
  Legal: { employeeId: "TS-LEG-0024", name: "Anita Rao (Legal Officer)" },
  AuctionCell: {
    employeeId: "TS-AUC-0011",
    name: "Karthik Naidu (Auction Cell)",
  },
  Finance: {
    employeeId: "TS-FIN-0033",
    name: "Lakshmi Devi (Finance Officer)",
  },
  Admin: { employeeId: "TS-ADM-0001", name: "Srinivas IPS (Admin)" },
  Bidder: { employeeId: "TS-BID-0247", name: "Mohammed Ismail (Bidder)" },
}

export const LoginScreen = () => {
  const [role, setRole] = useState<RoleCode>("PS")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login({ employeeId: DEMO_CREDS[role].employeeId, password, role })
      // Navigate to role's default dashboard
      const defaultRoutes: Record<RoleCode, string> = {
        PS: "/ps-dashboard",
        SHO: "/sho-approval-queue",
        Legal: "/legal-dashboard",
        AuctionCell: "/auc-dashboard",
        Finance: "/fin-dashboard",
        Admin: "/adm-dashboard",
        Bidder: "/bid-dashboard",
      }
      navigate(defaultRoutes[role], { replace: true })
    } catch {
      setError(
        "Invalid credentials. Try any password with a valid role in mock mode.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-police-light">
      <div className="police-panel w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/logos/hyd-city-police.png"
            alt="Hyderabad City Police"
            className="h-10 w-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-police-text mb-2">
          SVAMS Login
        </h2>
        <p className="text-sm text-police-muted mb-6">
          Seized Vehicle Auction Management System — Telangana Police
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-police-text mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleCode)}
              className="police-input w-full"
            >
              {Object.entries(DEMO_CREDS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name} ({key})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-police-text mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Any password works in mock mode"
              className="police-input w-full"
            />
          </div>
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
              {error}
            </div>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-police-border">
          <p className="text-xs text-police-muted text-center">
            Demo credentials: any password. Select your role from the dropdown.
          </p>
        </div>
      </div>
    </div>
  )
}
