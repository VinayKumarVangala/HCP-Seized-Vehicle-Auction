/**
 * SVAMS — Navigation Context
 * Role-based menus, screen map, and active route tracking (RBAC-002).
 */

import { createContext, useContext, useState, useCallback } from "react"
import type { RoleCode } from "./api/types"

export interface NavItem {
  label: string
  route: string
  icon: string
  roles: RoleCode[]
}

export type ScreenMap = Record<string, React.ComponentType>

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    route: "ps-dashboard",
    icon: "LayoutDashboard",
    roles: ["PS"],
  },
  {
    label: "Vehicle List",
    route: "ps-vehicle-list",
    icon: "Car",
    roles: ["PS"],
  },
  {
    label: "New Seizure",
    route: "ps-new-seizure",
    icon: "FileText",
    roles: ["PS"],
  },
  {
    label: "Vehicle Detail",
    route: "ps-vehicle-detail",
    icon: "View",
    roles: ["PS"],
  },
  {
    label: "Notice Tracking",
    route: "ps-notice-tracking",
    icon: "Calendar",
    roles: ["PS"],
  },
  {
    label: "Approval Queue",
    route: "sho-approval-queue",
    icon: "Bell",
    roles: ["SHO"],
  },
  {
    label: "Review Vehicle",
    route: "sho-review-vehicle",
    icon: "View",
    roles: ["SHO"],
  },
  {
    label: "Legal Dashboard",
    route: "legal-dashboard",
    icon: "Gavel",
    roles: ["Legal"],
  },
  {
    label: "Auction Dashboard",
    route: "auc-dashboard",
    icon: "LayoutDashboard",
    roles: ["AuctionCell"],
  },
  {
    label: "Eligible Vehicles",
    route: "auc-eligible",
    icon: "Car",
    roles: ["AuctionCell"],
  },
  {
    label: "Create Lot",
    route: "auc-create-lot",
    icon: "Package",
    roles: ["AuctionCell"],
  },
  {
    label: "Live Auction",
    route: "auc-live-auction",
    icon: "Activity",
    roles: ["AuctionCell"],
  },
  {
    label: "Sale Confirmation",
    route: "auc-sale-confirmation",
    icon: "FileText",
    roles: ["AuctionCell"],
  },
  {
    label: "Finance Dashboard",
    route: "fin-dashboard",
    icon: "DollarSign",
    roles: ["Finance"],
  },
  {
    label: "Admin Dashboard",
    route: "adm-dashboard",
    icon: "Building2",
    roles: ["Admin"],
  },
  {
    label: "Notice Rules",
    route: "adm-notice-rules",
    icon: "Settings",
    roles: ["Admin"],
  },
  {
    label: "User Management",
    route: "adm-users",
    icon: "Users",
    roles: ["Admin"],
  },
  {
    label: "Bidder Dashboard",
    route: "bid-dashboard",
    icon: "LayoutDashboard",
    roles: ["Bidder"],
  },
  {
    label: "Browse Auctions",
    route: "bid-browse",
    icon: "Search",
    roles: ["Bidder"],
  },
  {
    label: "Lot Detail",
    route: "bid-lot-detail",
    icon: "View",
    roles: ["Bidder"],
  },
  {
    label: "Bidding",
    route: "bid-bidding",
    icon: "DollarSign",
    roles: ["Bidder"],
  },
]

export const getMenuForRole = (role: RoleCode): NavItem[] =>
  NAV_ITEMS.filter((item) => item.roles.includes(role)).sort((a, b) =>
    a.label.localeCompare(b.label),
  )

type NavContextType = {
  activeScreen: string
  setActiveScreen: (route: string) => void
  getMenu: (role: RoleCode) => NavItem[]
  screenMap: ScreenMap
  registerScreen: (route: string, component: React.ComponentType) => void
}

const NavContext = createContext<NavContextType | null>(null)

export const useNav = (): NavContextType => {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error("useNav must be used within a NavProvider")
  return ctx
}

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeScreen, setActiveScreen] = useState("")
  const [screenMap, setScreenMap] = useState<ScreenMap>({})

  const registerScreen = useCallback(
    (route: string, component: React.ComponentType) => {
      setScreenMap((prev) => ({ ...prev, [route]: component }))
    },
    [],
  )

  const getMenu = useCallback((role: RoleCode) => getMenuForRole(role), [])

  return (
    <NavContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        getMenu,
        screenMap,
        registerScreen,
      }}
    >
      {children}
    </NavContext.Provider>
  )
}

export default NavContext
