/**
 * SVAMS — Police Station Dashboard
 * KPIs, recent seizures, quick actions (PS-01).
 */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { apiService } from "../api/service"
import {
  Card,
  PageHeader,
  KPICard,
  Badge,
  Table,
  Button,
  Alert,
} from "../shared/ui"

export const PSDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalSeizures: 0,
    pendingNotices: 0,
    approvedVehicles: 0,
    alerts: 0,
  })
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const seizures = await apiService.getSeizures({ limit: 5 })
        const notifications = await apiService.getNotifications(
          user?.role as any,
        )
        setRecent(seizures.data)
        setStats({
          totalSeizures: seizures.total,
          pendingNotices: notifications.filter((n: any) => !n.read).length,
          approvedVehicles: seizures.data.filter(
            (s: any) => s.status === "approved",
          ).length,
          alerts: notifications.length,
        })
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.role])

  if (loading)
    return (
      <div className="police-panel p-12 text-center">Loading dashboard…</div>
    )

  return (
    <div>
      <PageHeader
        title="PS Dashboard"
        subtitle={`Welcome back, ${user?.name}. Manage seizures, notices, and vehicle records.`}
        actions={
          <Button variant="primary" onClick={() => navigate("/ps-new-seizure")}>
            New Seizure
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Seizures"
          value={stats.totalSeizures}
          trend={12}
          trendDirection="up"
          variant="primary"
        />
        <KPICard
          title="Pending Notices"
          value={stats.pendingNotices}
          trend={-5}
          trendDirection="down"
          variant="warning"
        />
        <KPICard
          title="Approved Vehicles"
          value={stats.approvedVehicles}
          trend={8}
          trendDirection="up"
          variant="success"
        />
        <KPICard
          title="Alerts"
          value={stats.alerts}
          trend={0}
          trendDirection="neutral"
          variant="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">
            Recent Seizures
          </h3>
          {recent.length ? (
            <Table
              columns={[
                { key: "seizureNumber", label: "Seizure No." },
                {
                  key: "registrationNumber",
                  label: "Vehicle",
                  render: (row: any) => (
                    <span>{row.vehicle?.registrationNumber || "—"}</span>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (row: any) => (
                    <Badge
                      variant={
                        row.status === "approved"
                          ? "success"
                          : row.status === "pending_approval"
                            ? "warning"
                            : "default"
                      }
                    >
                      {row.status.replace(/_/g, " ")}
                    </Badge>
                  ),
                },
              ]}
              data={recent}
            />
          ) : (
            <Alert type="info">No recent seizures.</Alert>
          )}
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate("/ps-new-seizure")}
            >
              Record New Seizure
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/ps-vehicle-list")}
            >
              View Vehicle List
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/ps-notice-tracking")}
            >
              Track Notices
            </Button>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">
            Status Guide
          </h3>
          <div className="space-y-2 text-xs text-police-muted">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="w-20">
                Legally Cleared
              </Badge>{" "}
              Ready for auction lot
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="w-20">
                Pending Approval
              </Badge>{" "}
              Awaiting SHO review
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="danger" className="w-20">
                Court Stay
              </Badge>{" "}
              Blocked from auction
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
