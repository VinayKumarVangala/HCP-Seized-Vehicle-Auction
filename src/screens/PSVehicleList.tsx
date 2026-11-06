/**
 * SVAMS — PS Vehicle List
 * Filterable registry with bulk actions (PS-02).
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../api/service"
import {
  Card,
  PageHeader,
  Badge,
  Table,
  Button,
  Input,
  Select,
} from "../shared/ui"
import type { Vehicle } from "../api/types"

export const PSVehicleList = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await apiService.getVehicles({
      search,
      vehicleType: typeFilter as any,
      limit: 50,
    })
    setVehicles(res.data)
    setLoading(false)
  }

  const columns = [
    { key: "registrationNumber", label: "Registration No." },
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "vehicleType", label: "Type" },
    { key: "ownerName", label: "Owner" },
    { key: "currentValue", label: "Est. Value (₹)" },
    {
      key: "vahanVerified",
      label: "VAHAN",
      render: (row: any) => (
        <Badge variant={row.vahanVerified ? "success" : "default"}>
          {row.vahanVerified ? "Verified" : "Pending"}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Vehicle List"
        subtitle="Filterable registry of seized vehicles with bulk actions"
        actions={
          <Button variant="primary" onClick={() => navigate("/ps-new-seizure")}>
            + Register Vehicle
          </Button>
        }
      />

      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by reg. number / owner / model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            placeholder="Vehicle type"
            options={[
              { value: "2W", label: "2-Wheeler" },
              { value: "4W", label: "4-Wheeler" },
              { value: "Commercial", label: "Commercial" },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Button variant="primary" onClick={load} className="w-full">
            Apply
          </Button>
        </div>

        {loading ? (
          <div className="police-panel p-8 text-center text-police-muted">
            Loading vehicles…
          </div>
        ) : (
          <Table columns={columns} data={vehicles} />
        )}
      </Card>
    </div>
  )
}
