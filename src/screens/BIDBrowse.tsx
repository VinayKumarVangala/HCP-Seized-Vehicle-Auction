/**
 * SVAMS — BIDBrowse
 * Public auction listing (BID-01).
 */

import { Card, PageHeader, Badge, Table, Button } from "../shared/ui"

export const BIDBrowse = () => (
  <div>
    <PageHeader
      title="Browse Auctions"
      subtitle="View all active/live auction lots with vehicle details"
    />
    <Card padding="md">
      <Table
        columns={[
          { key: "lotNumber", label: "Lot No." },
          { key: "title", label: "Title" },
          {
            key: "status",
            label: "Status",
            render: (row: any) => <Badge variant="success">{row.status}</Badge>,
          },
          {
            key: "currentBid",
            label: "Current Bid",
            render: (row: any) => (
              <span className="font-medium">
                ₹{row.currentBid.toLocaleString()}
              </span>
            ),
          },
          {
            key: "endDate",
            label: "Ends",
            render: (row: any) => (
              <span className="text-xs text-police-muted">{row.endDate}</span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: () => (
              <Button variant="primary" size="sm">
                View Lot
              </Button>
            ),
          },
        ]}
        data={[
          {
            lotNumber: "LOT-2026-001",
            title: "Seized Vehicles Auction Lot 1",
            status: "live",
            currentBid: 380000,
            endDate: "Mar 1, 2026 12:00 PM",
          },
          {
            lotNumber: "LOT-2026-002",
            title: "Two-Wheeler Lot",
            status: "published",
            currentBid: 0,
            endDate: "Mar 3, 2026 10:00 AM",
          },
        ]}
      />
    </Card>
  </div>
)
