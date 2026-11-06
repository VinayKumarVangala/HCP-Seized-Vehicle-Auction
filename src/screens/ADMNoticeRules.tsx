/**
 * SVAMS — ADM Notice Rules
 * Configurable compliance rules (ADM-02).
 */

import { useState } from "react"
import { Card, PageHeader, Table, Button, Input, Badge } from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect } from "react"

export const ADMNoticeRules = () => {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService
      .getNoticeRules()
      .then(setRules)
      .finally(() => setLoading(false))
  }, [])

  const updateRule = async (id: string, field: string, value: any) => {
    await apiService.updateNoticeRule(id, { [field]: value })
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="Notice Rules"
        subtitle="Configure notice intervals, delivery methods, escalation rules"
      />
      <Card padding="md">
        <Table
          columns={[
            { key: "vehicleType", label: "Vehicle Type" },
            { key: "crimeType", label: "Crime Type" },
            { key: "noticesRequired", label: "Notices Required" },
            {
              key: "intervals",
              label: "Intervals (days)",
              render: (row: any) => <span>{row.intervals.join(", ")}</span>,
            },
            { key: "escalationDays", label: "Escalation (days)" },
            {
              key: "edit",
              label: "Edit",
              render: (row: any) => (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    defaultValue={row.escalationDays}
                    className="w-20 p-0 border-0 bg-transparent text-sm"
                    onChange={(e) =>
                      updateRule(
                        row.id,
                        "escalationDays",
                        Number(e.target.value),
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert("Saved")}
                  >
                    Save
                  </Button>
                </div>
              ),
            },
          ]}
          data={rules}
        />
      </Card>
      <div className="mt-4">
        <Badge variant={rules.every((r) => r.isActive) ? "success" : "default"}>
          All rules active
        </Badge>
      </div>
    </div>
  )
}
