/**
 * SVAMS — AUC Eligible Vehicles
 * Vehicles cleared for auction (AUC-01).
 */

import { Card, PageHeader, Table, Button } from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect, useState } from "react"

export const AUCEligibleVehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService
      .getSeizures({ limit: 50 })
      .then((r) => setVehicles(r.data.filter((s: any) => s.eligibleForAuction)))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="Eligible Vehicles"
        subtitle="Vehicles cleared for auction (legal + SHO approved)"
      />
      <Card padding="md">
        <Table
          columns={[
            { key: "seizureNumber", label: "Seizure No." },
            {
              key: "registrationNumber",
              label: "Vehicle",
              render: (row: any) => (
                <span className="font-medium">
                  {row.vehicle?.registrationNumber || "—"}
                </span>
              ),
            },
            {
              key: "currentValue",
              label: "Est. Value",
              render: (row: any) => (
                <span>₹{row.currentValue?.toLocaleString() || "—"}</span>
              ),
            },
            {
              key: "action",
              label: "Action",
              render: () => (
                <Button variant="primary" size="sm">
                  Add to Lot
                </Button>
              ),
            },
          ]}
          data={vehicles}
        />
      </Card>
    </div>
  )
}
