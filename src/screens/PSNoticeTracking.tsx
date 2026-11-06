/**
 * SVAMS — PS Notice Tracking (3-notice compliance)
 * Track Registered Post, Speed Post, Newspaper notices (PS-07).
 */

import { useState } from "react"
import {
  Card,
  PageHeader,
  Badge,
  Table,
  Button,
  NoticeTracker,
} from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect } from "react"

export const PSNoticeTracking = () => {
  const [seizures, setSeizures] = useState<any[]>([])
  const [selected, setSelected] = useState<string>("")

  useEffect(() => {
    apiService.getSeizures({ limit: 50 }).then((r) => setSeizures(r.data))
  }, [])

  const sel = seizures.find((s) => s.id === selected)

  return (
    <div>
      <PageHeader
        title="Notice Tracking"
        subtitle="3-notice compliance table + delivery status drawer"
      />
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
              key: "complianceNoticeCount",
              label: "Notices Recorded",
              render: (row: any) => <span>{row.complianceNoticeCount}/3</span>,
            },
            {
              key: "status",
              label: "Status",
              render: (row: any) => (
                <Badge
                  variant={
                    row.complianceNoticeCount >= 3 ? "success" : "warning"
                  }
                >
                  {row.complianceNoticeCount >= 3 ? "Complete" : "Pending"}
                </Badge>
              ),
            },
            {
              key: "action",
              label: "Action",
              render: (row: any) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(row.id)}
                >
                  Track
                </Button>
              ),
            },
          ]}
          data={seizures}
        />
      </Card>

      {sel && (
        <Card padding="md" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-police-text">
              Notice Compliance — {sel.seizureNumber}
            </h3>
            <Button variant="ghost" onClick={() => setSelected("")}>
              Close
            </Button>
          </div>
          <NoticeTracker
            stages={[
              {
                type: "registered_post",
                label: "Registered Post",
                status: "delivered",
              },
              { type: "speed_post", label: "Speed Post", status: "delivered" },
              { type: "newspaper", label: "Newspaper", status: "pending" },
            ]}
          />
          <Table
            columns={[
              { key: "noticeType", label: "Type" },
              { key: "noticeNumber", label: "Notice No." },
              { key: "status", label: "Status" },
              { key: "attempts", label: "Attempts" },
            ]}
            data={sel.notices || []}
          />
          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={() => alert("Notice recorded")}>
              Record Notice
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
