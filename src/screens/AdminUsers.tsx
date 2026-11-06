/**
 * SVAMS — Admin Users (User Management)
 * Officer accounts + roles (ADM-01).
 */

import { Card, PageHeader, Table, Button, Badge } from "../shared/ui"
import { apiService } from "../api/service"
import { useEffect, useState } from "react"

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService
      .getUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const setStatus = async (id: string, status: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)))
  }

  if (loading)
    return <div className="police-panel p-12 text-center">Loading…</div>

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Officer accounts + role assignment"
      />
      <Card padding="md">
        <Table
          columns={[
            { key: "employeeId", label: "Employee ID" },
            { key: "name", label: "Name" },
            {
              key: "role",
              label: "Role",
              render: (row: any) => <Badge variant="primary">{row.role}</Badge>,
            },
            {
              key: "policeStation",
              label: "Station",
              render: (row: any) => <span>{row.policeStation || "—"}</span>,
            },
            {
              key: "status",
              label: "Status",
              render: (row: any) => (
                <Badge variant={row.status === "active" ? "success" : "danger"}>
                  {row.status}
                </Badge>
              ),
            },
            {
              key: "action",
              label: "Action",
              render: (row: any) => (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setStatus(
                        row.id,
                        row.status === "active" ? "inactive" : "active",
                      )
                    }
                  >
                    {row.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              ),
            },
          ]}
          data={users}
        />
      </Card>
    </div>
  )
}
