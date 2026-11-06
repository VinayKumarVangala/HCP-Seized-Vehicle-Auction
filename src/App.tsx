/**
 * SVAMS — Root Component
 * Routing + AuthProvider + AppShell layout wrapper.
 */

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { AppShell } from "./components/AppShell"
import { LoginScreen } from "./screens/LoginScreen"
import {
  PSDashboard,
  PSVehicleList,
  PSNewSeizure,
  PSVehicleDetail,
  PSNoticeTracking,
  SHOApprovalQueue,
  SHOReviewVehicle,
  LegalDashboard,
  AuctionDashboard,
  AUCEligibleVehicles,
  AUCCreateLot,
  AUCLiveAuction,
  AUCSaleConfirmation,
  FinDashboard,
  AdmDashboard,
  ADMNoticeRules,
  AdminUsers,
  BIDDashboard,
  BIDBrowse,
  BIDLotDetail,
  BIDBiddingScreen,
} from "./screens"
import { RouteGuard, RequireAuth } from "./routes/AppRoutes"
import type { RoleCode } from "./api/types"

const DefaultRoute = () => <Navigate to="/login" replace />

// Public routes — no auth required
const PUBLIC_ROUTES: Array<{
  path: string
  element: React.ReactNode
}> = [
  { path: "/login", element: <LoginScreen /> },
]

// Protected routes — auth + role required
const PROTECTED_ROUTES: Array<{
  path: string
  element: React.ReactNode
  roles?: RoleCode[]
}> = [
  { path: "/ps-dashboard", element: <PSDashboard />, roles: ["PS"] },
  { path: "/ps-vehicle-list", element: <PSVehicleList />, roles: ["PS"] },
  { path: "/ps-new-seizure", element: <PSNewSeizure />, roles: ["PS"] },
  {
    path: "/ps-vehicle-detail/:id",
    element: <PSVehicleDetail />,
    roles: ["PS"],
  },
  { path: "/ps-notice-tracking", element: <PSNoticeTracking />, roles: ["PS"] },
  {
    path: "/sho-approval-queue",
    element: <SHOApprovalQueue />,
    roles: ["SHO"],
  },
  {
    path: "/sho-review-vehicle/:id",
    element: <SHOReviewVehicle />,
    roles: ["SHO"],
  },
  { path: "/legal-dashboard", element: <LegalDashboard />, roles: ["Legal"] },
  {
    path: "/auc-dashboard",
    element: <AuctionDashboard />,
    roles: ["AuctionCell"],
  },
  {
    path: "/auc-eligible",
    element: <AUCEligibleVehicles />,
    roles: ["AuctionCell"],
  },
  {
    path: "/auc-create-lot",
    element: <AUCCreateLot />,
    roles: ["AuctionCell"],
  },
  {
    path: "/auc-live-auction/:id",
    element: <AUCLiveAuction />,
    roles: ["AuctionCell"],
  },
  {
    path: "/auc-sale-confirmation/:id",
    element: <AUCSaleConfirmation />,
    roles: ["AuctionCell"],
  },
  { path: "/fin-dashboard", element: <FinDashboard />, roles: ["Finance"] },
  { path: "/adm-dashboard", element: <AdmDashboard />, roles: ["Admin"] },
  { path: "/adm-notice-rules", element: <ADMNoticeRules />, roles: ["Admin"] },
  { path: "/adm-users", element: <AdminUsers />, roles: ["Admin"] },
  { path: "/bid-dashboard", element: <BIDDashboard />, roles: ["Bidder"] },
  { path: "/bid-browse", element: <BIDBrowse />, roles: ["Bidder"] },
  { path: "/bid-lot-detail/:id", element: <BIDLotDetail />, roles: ["Bidder"] },
  {
    path: "/bid-bidding/:id",
    element: <BIDBiddingScreen />,
    roles: ["Bidder"],
  },
]

export const App = () => {
  const [mounted, setMounted] = useState(false)

  // Mount after first render to avoid SSR/hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          {PUBLIC_ROUTES.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          {/* Protected routes */}
          {PROTECTED_ROUTES.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <RequireAuth>
                  <AppShell>
                    {r.roles ? (
                      <RouteGuard roles={r.roles}>{r.element}</RouteGuard>
                    ) : (
                      r.element
                    )}
                  </AppShell>
                </RequireAuth>
              }
            />
          ))}
          <Route path="/" element={<DefaultRoute />} />
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
