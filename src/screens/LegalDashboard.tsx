/**
 * SVAMS — Legal Dashboard
 * Cases under review, court stays, claims (LEG-01).
 */

import { Card, PageHeader, Badge, KPICard, Table } from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect, useState } from "react"

export const LegalDashboard = () => {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService
      .getSeizures({ limit: 50 })
      .then((r) =>
        setCases(
          r.data.filter((s: any) => s.courtStay || s.status === "legal_review"),
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="Legal Dashboard"
        subtitle="Cases under legal review, court stays, and claims"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard
          title="Cases Under Review"
          value={cases.length}
          trend={0}
          variant="warning"
        />
        <KPICard
          title="Court Stays"
          value={cases.filter((c) => c.courtStay).length}
          trend={0}
          variant="danger"
        />
        <KPICard
          title="Legally Cleared"
          value={cases.filter((c) => c.status === "legally_cleared").length}
          trend={0}
          variant="success"
        />
      </div>
      <Card padding="md">
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
              key: "courtStay",
              label: "Court Stay",
              render: (row: any) => (
                <Badge variant={row.courtStay ? "danger" : "success"}>
                  {row.courtStay ? "Active" : "None"}
                </Badge>
              ),
            },
            { key: "status", label: "Status" },
          ]}
          data={cases}
        />
      </Card>
    </div>
  )
}
