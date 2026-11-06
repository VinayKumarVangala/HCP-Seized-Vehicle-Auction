/**
 * SVAMS — AppShell Layout
 * Sidebar + topbar with logos (README architecture).
 */

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useNav } from "../nav"
import {
  MenuIcon,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  Search,
  Bell,
  User,
  Car,
  FileText,
  Calendar,
  View,
  Gavel,
  Package,
  Activity,
  Building2,
  Settings,
  Users,
  DollarSign,
} from "../shared/ui"
import type { RoleCode } from "../api/types"

const ICON_MAP: Record<string, React.ComponentType<{
  size?: number | string
}>> = {
  LayoutDashboard,
  Car,
  FileText,
  Calendar,
  Bell,
  Gavel,
  Package,
  Activity,
  Building2,
  Settings,
  Users,
  Search,
  DollarSign,
  View,
}

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth()
  const { setActiveScreen } = useNav()
  const location = useLocation()
  const role = user?.role as RoleCode
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menu = role ? getMenuForRole(role) : []

  const isActive = (route: string) => location.pathname.includes(route)

  return (
    <div className="flex h-screen bg-police-light">
      {/* Sidebar (collapsible, R-017 responsive) */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 police-panel border-r border-police-border transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:relative sm:translate-x-0 sm:static sm:z-auto sm:border-r sm:border-police-border`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-police-border">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logos/hyd-city-police.png"
              alt="Hyderabad City Police"
              className="h-8 w-auto"
            />
            <span className="text-sm font-bold text-police-green hidden sm:inline">
              SVAMS
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded p-1.5 hover:bg-police-light text-police-muted sm:hidden"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={20} />
          </button>
        </div>
        <nav className="py-4 space-y-1">
          {menu.map((item) => {
            const Icon = ICON_MAP[item.icon]
            return (
              <Link
                key={item.route}
                to={`/${item.route}`}
                onClick={() => setActiveScreen(item.route)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive(item.route)
                    ? "bg-police-green text-white"
                    : "text-police-text hover:bg-police-light"
                }`}
              >
                <span className="w-5 text-center">
                  {Icon ? <Icon size={16} /> : null}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="mt-6 px-4 border-t border-police-border pt-4">
            <div className="flex items-center gap-2 px-2">
              <AvatarUser alt={user?.name ?? "User"} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-police-text truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-police-muted truncate uppercase">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-police-danger hover:bg-red-50 rounded-lg transition-colors mt-3"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-police-border bg-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="rounded p-1.5 hover:bg-police-light text-police-muted sm:hidden"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <img
                src="/assets/logos/hyd-city-police.png"
                alt="Hyderabad City Police"
                className="h-7 w-auto"
              />
              <span className="text-sm font-bold text-police-green">SVAMS</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 relative">
            <input
              type="text"
              placeholder="Search vehicles, seizures, lots…"
              className="police-input w-64 pl-9"
            />
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-police-muted"
            />
          </div>
          <div className="flex items-center gap-3">
            <Bell size={20} className="relative" />
            <User size={20} />
            <span className="text-sm font-medium text-police-text hidden sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
      </div>
    </div>
  )
}

// Role menu resolution (mirrors nav.tsx getMenuForRole) — kept local to avoid circular deps
const ROLE_MENU_ITEMS: Array<{
  label: string
  route: string
  icon: string
  roles: RoleCode[]
}> = [
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

const getMenuForRole = (role: RoleCode) =>
  ROLE_MENU_ITEMS.filter((i) => i.roles.includes(role)).sort((a, b) =>
    a.label.localeCompare(b.label),
  )

const AvatarUser = ({ alt }: { alt: string }) => (
  <div className="flex items-center justify-center rounded-full border border-police-border bg-white h-8 w-8 text-xs">
    {alt
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)}
  </div>
)
