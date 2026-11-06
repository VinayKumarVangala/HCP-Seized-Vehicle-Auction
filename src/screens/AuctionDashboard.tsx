/**
 * SVAMS — Auction Cell Dashboard
 * Auction overview and metrics.
 */

import { Card, PageHeader, KPICard, Table, Badge } from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect, useState } from "react"

export const AuctionDashboard = () => {
  const [lots, setLots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService
      .getLots({ limit: 50 })
      .then((r) => setLots(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="Auction Dashboard"
        subtitle="Auction overview and active lots"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Active Lots"
          value={lots.filter((l) => l.status === "live").length}
          trend={0}
          variant="primary"
        />
        <KPICard
          title="Total Lots"
          value={lots.length}
          trend={0}
          variant="info"
        />
        <KPICard
          title="Current Highest Bid"
          value={lots
            .reduce((m, l) => Math.max(m, l.currentBid), 0)
            .toLocaleString()}
          trend={0}
          variant="success"
        />
        <KPICard
          title="Lots Closed"
          value={lots.filter((l) => l.status === "closed").length}
          trend={0}
          variant="info"
        />
      </div>
      <Card padding="md">
        <Table
          columns={[
            { key: "lotNumber", label: "Lot No." },
            { key: "title", label: "Title" },
            {
              key: "status",
              label: "Status",
              render: (row: any) => (
                <Badge variant={row.status === "live" ? "success" : "default"}>
                  {row.status}
                </Badge>
              ),
            },
            {
              key: "currentBid",
              label: "Current Bid",
              render: (row: any) => (
                <span>₹{row.currentBid.toLocaleString()}</span>
              ),
            },
          ]}
          data={lots}
        />
      </Card>
    </div>
  )
}
