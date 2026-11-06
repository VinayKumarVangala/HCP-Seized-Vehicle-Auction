/**
 * SVAMS — SHO Approval Queue
 * Pending seizures with approve/reject (SHO-01, SHO-02).
 */

import { useState } from "react"
import { Card, PageHeader, Table, Button, Alert } from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect } from "react"

export const SHOApprovalQueue = () => {
  const [seizures, setSeizures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService
      .getSeizures({ limit: 50 })
      .then((r) =>
        setSeizures(r.data.filter((s: any) => s.status === "pending_approval")),
      )
      .finally(() => setLoading(false))
  }, [])

  const approve = async (id: string) => {
    await apiService.updateSeizure(id, { status: "approved" })
    setSeizures(
      seizures.map((s) => (s.id === id ? { ...s, status: "approved" } : s)),
    )
  }

  const reject = async (id: string) => {
    const reason = prompt("Rejection reason:")
    if (reason) {
      await apiService.updateSeizure(id, {
        status: "rejected",
        rejectionReason: reason,
      })
      setSeizures(seizures.filter((s) => s.id !== id))
    }
  }

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="SHO Approval Queue"
        subtitle="Review and approve/reject seizures submitted by PS officers"
      />
      {seizures.length === 0 && (
        <Alert type="info">No seizures pending approval.</Alert>
      )}
      <Card padding="md">
        <Table
          columns={[
            {
              key: "seizureNumber",
              label: "Seizure No.",
              render: (row: any) => (
                <span className="font-medium">{row.seizureNumber}</span>
              ),
            },
            {
              key: "registrationNumber",
              label: "Vehicle",
              render: (row: any) => (
                <span>{row.vehicle?.registrationNumber || "—"}</span>
              ),
            },
            {
              key: "seizedByName",
              label: "Submitted By",
              render: (row: any) => <span>{row.seizedByName || "—"}</span>,
            },
            {
              key: "seizureDate",
              label: "Date",
              render: (row: any) => (
                <span>{new Date(row.seizureDate).toLocaleDateString()}</span>
              ),
            },
            {
              key: "action",
              label: "Action",
              render: (row: any) => (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => approve(row.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => reject(row.id)}
                  >
                    Reject
                  </Button>
                </div>
              ),
            },
          ]}
          data={seizures}
        />
      </Card>
    </div>
  )
}
