/**
 * SVAMS — Finance Dashboard
 * Payments, EMD, Refunds, Reconciliation (FIN-01).
 */

import { Card, PageHeader, KPICard, Table, Badge } from "../shared/ui"

export const FinDashboard = () => (
  <div>
    <PageHeader
      title="Finance Dashboard"
      subtitle="Payments, EMD, Refunds, Reconciliation"
    />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Total Revenue"
        value="₹1,250,000"
        trend={12}
        trendDirection="up"
        variant="success"
      />
      <KPICard
        title="EMD Collected"
        value="₹85,000"
        trend={5}
        trendDirection="up"
        variant="primary"
      />
      <KPICard
        title="Pending Payments"
        value="₹360,000"
        trend={-8}
        trendDirection="down"
        variant="warning"
      />
      <KPICard
        title="Refunds Processed"
        value="₹45,000"
        trend={0}
        trendDirection="neutral"
        variant="info"
      />
    </div>
    <Card padding="md">
      <h3 className="text-sm font-bold text-police-text mb-4">
        Recent Payments
      </h3>
      <Table
        columns={[
          { key: "bidder", label: "Bidder" },
          { key: "lot", label: "Lot" },
          {
            key: "type",
            label: "Type",
            render: (row: any) => <Badge variant="success">{row.type}</Badge>,
          },
          {
            key: "amount",
            label: "Amount",
            render: (row: any) => <span>₹{row.amount.toLocaleString()}</span>,
          },
          {
            key: "status",
            label: "Status",
            render: (row: any) => (
              <Badge variant={row.status === "paid" ? "success" : "default"}>
                {row.status}
              </Badge>
            ),
          },
        ]}
        data={[
          {
            bidder: "Mohammed Ismail",
            lot: "LOT-2026-001",
            type: "EMD",
            amount: 20000,
            status: "paid",
          },
          {
            bidder: "Mohammed Ismail",
            lot: "LOT-2026-001",
            type: "Sale Payment",
            amount: 380000,
            status: "pending",
          },
        ]}
      />
    </Card>
  </div>
)
