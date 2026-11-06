/**
 * SVAMS — PS Vehicle Detail (8 tabs)
 * Overview, Notices, Documents, Valuation, etc.
 */

import { useParams } from "react-router-dom"
import {
  Card,
  PageHeader,
  Tabs,
  Badge,
  Button,
  Table,
  Alert,
} from "../shared/ui"
import { useAuth } from "../contexts/AuthContext"
import { apiService } from "../api/service"
import { useState, useEffect } from "react"

export const PSVehicleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [tab, setTab] = useState("overview")
  const [seizure, setSeizure] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (id) {
        const s = await apiService.getSeizure(id)
        setSeizure(s ?? null)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "notices", label: "Notices" },
    { id: "documents", label: "Documents" },
    { id: "valuation", label: "Valuation" },
    { id: "compliance", label: "Compliance" },
    { id: "audit", label: "Audit" },
    { id: "history", label: "History" },
    { id: "approval", label: "Approval" },
  ]

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="Vehicle Detail"
        subtitle={`Seizure ${seizure?.seizureNumber || id}`}
      />
      <Tabs tabs={tabs} activeId={tab} onChange={setTab} />
      <Card padding="md">
        {tab === "overview" && seizure ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-police-muted text-sm block">
                Registration
              </span>
              <span className="font-medium">
                {seizure.vehicle?.registrationNumber || "—"}
              </span>
            </div>
            <div>
              <span className="text-police-muted text-sm block">Status</span>
              <Badge variant="success">{seizure.status}</Badge>
            </div>
            <div>
              <span className="text-police-muted text-sm block">Seized By</span>
              <span className="font-medium">{seizure.seizedByName || "—"}</span>
            </div>
          </div>
        ) : (
          <Alert type="info">Seizure not found.</Alert>
        )}
        {tab === "notices" && (
          <Table
            columns={[
              { key: "noticeType", label: "Notice Type" },
              { key: "noticeNumber", label: "Notice No." },
              { key: "status", label: "Status" },
              { key: "dueDate", label: "Due Date" },
            ]}
            data={seizure?.notices || []}
          />
        )}
      </Card>
      <div className="mt-4 flex gap-2">
        <Button variant="ghost" onClick={() => window.history.back()}>
          Back
        </Button>
        {user && seizure && (
          <Button
            variant="primary"
            onClick={() => alert("Submitted for SHO approval")}
          >
            Submit for Approval
          </Button>
        )}
      </div>
    </div>
  )
}
