/**
 * SVAMS — Bidder Dashboard
 * Bidder overview and active lots.
 */

import { Card, PageHeader, KPICard, Table, Button, Badge } from "../shared/ui"

export const BIDDashboard = () => (
  <div>
    <PageHeader
      title="Bidder Dashboard"
      subtitle="Your active lots and bidding activity"
    />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <KPICard title="Active Lots" value="3" trend={0} variant="primary" />
      <KPICard title="My Bids" value="2" trend={0} variant="info" />
      <KPICard
        title="Wallet Balance"
        value="₹50,000"
        trend={0}
        variant="success"
      />
      <KPICard
        title="EMD Deposited"
        value="₹20,000"
        trend={0}
        variant="warning"
      />
    </div>
    <Card padding="md">
      <h3 className="text-sm font-bold text-police-text mb-4">My Bids</h3>
      <Table
        columns={[
          { key: "lot", label: "Lot" },
          {
            key: "vehicle",
            label: "Vehicle",
            render: (row: any) => <span>{row.vehicle}</span>,
          },
          {
            key: "amount",
            label: "Your Bid",
            render: (row: any) => (
              <span className="font-medium">
                ₹{row.amount.toLocaleString()}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row: any) => (
              <Badge variant={row.status === "winning" ? "success" : "default"}>
                {row.status}
              </Badge>
            ),
          },
        ]}
        data={[
          {
            lot: "LOT-2026-001",
            vehicle: "TS09AB1234 — Swift Dzire",
            amount: 380000,
            status: "winning",
          },
          {
            lot: "LOT-2026-002",
            vehicle: "TS09CD5678 — Hero Splendor",
            amount: 42000,
            status: "outbid",
          },
        ]}
      />
    </Card>
    <div className="mt-6">
      <Button variant="primary" onClick={() => {}}>
        Browse Auctions
      </Button>
    </div>
  </div>
)
