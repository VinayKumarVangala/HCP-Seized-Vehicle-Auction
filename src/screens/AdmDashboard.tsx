/**
 * SVAMS — Admin Dashboard
 * System overview and metrics.
 */

import { Card, PageHeader, KPICard, Table } from "../shared/ui"

export const AdmDashboard = () => (
  <div>
    <PageHeader
      title="Admin Dashboard"
      subtitle="System overview and metrics"
    />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Total Users"
        value="24"
        trend={2}
        trendDirection="up"
        variant="primary"
      />
      <KPICard
        title="Active Seizures"
        value="14"
        trend={0}
        trendDirection="neutral"
        variant="info"
      />
      <KPICard
        title="Active Lots"
        value="3"
        trend={1}
        trendDirection="up"
        variant="success"
      />
      <KPICard
        title="Pending Notices"
        value="6"
        trend={-2}
        trendDirection="down"
        variant="warning"
      />
    </div>
    <Card padding="md">
      <h3 className="text-sm font-bold text-police-text mb-4">
        System Activity
      </h3>
      <Table
        columns={[
          { key: "user", label: "User" },
          { key: "role", label: "Role" },
          { key: "action", label: "Action" },
          {
            key: "time",
            label: "Time",
            render: (row: any) => (
              <span className="text-xs text-police-muted">{row.time}</span>
            ),
          },
        ]}
        data={[
          {
            user: "Ravi Kumar",
            role: "PS",
            action: "Created seizure SEZ-2026-0003",
            time: "10:30 AM",
          },
          {
            user: "Suresh Reddy",
            role: "SHO",
            action: "Approved seizure SEZ-2026-0002",
            time: "09:15 AM",
          },
          {
            user: "Karthik Naidu",
            role: "AuctionCell",
            action: "Published lot LOT-2026-001",
            time: "08:00 AM",
          },
        ]}
      />
    </Card>
  </div>
)
