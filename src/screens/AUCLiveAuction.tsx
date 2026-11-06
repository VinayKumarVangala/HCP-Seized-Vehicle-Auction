/**
 * SVAMS — AUCLiveAuction
 * Real-time operator view with timer, H1 pulse, bid feed (AUC-04, AUC-05).
 */

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Card, PageHeader, KPICard, Table, Button, Alert } from "../shared/ui"
import { wsService } from "../api/websocket"
import type { WebSocketMessageType } from "../api/types"

export const AUCLiveAuction = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentBid, setCurrentBid] = useState(0)
  const [bids, setBids] = useState<any[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const unsub = wsService.subscribe(
      "auction:bid_placed" as WebSocketMessageType,
      (msg: any) => {
        setBids((prev) => [msg.payload, ...prev])
        setCurrentBid(msg.payload.amount)
      },
    )
    return () => unsub()
  }, [])

  return (
    <div>
      <PageHeader
        title="Live Auction"
        subtitle={`Lot ${id} — Real-time bidding`}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Time Left"
          value={paused ? "Paused" : "Live"}
          trend={0}
          variant={paused ? "danger" : "primary"}
        />
        <KPICard
          title="Current Bid (H1)"
          value={`₹${currentBid.toLocaleString()}`}
          trend={0}
          variant="success"
        />
        <KPICard
          title="Total Bids"
          value={bids.length}
          trend={0}
          variant="info"
        />
        <KPICard
          title="Status"
          value={paused ? "Paused" : "Live"}
          trend={0}
          variant={paused ? "warning" : "success"}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">
            Operator Controls
          </h3>
          <div className="space-y-3">
            <Button
              variant={paused ? "primary" : "danger"}
              className="w-full"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "Resume Auction" : "Pause Auction"}
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => alert("Extend timer by 10 min")}
            >
              Auto-Extend Timer
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/auc-dashboard")}
            >
              Close Lot
            </Button>
          </div>
        </Card>
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">Bid Feed</h3>
          {bids.length ? (
            <Table
              columns={[
                { key: "bidderName", label: "Bidder" },
                {
                  key: "amount",
                  label: "Amount",
                  render: (row: any) => (
                    <span className="font-medium">
                      ₹{row.amount.toLocaleString()}
                    </span>
                  ),
                },
                {
                  key: "placedAt",
                  label: "Time",
                  render: (row: any) => (
                    <span className="text-xs text-police-muted">
                      {new Date(row.placedAt).toLocaleTimeString()}
                    </span>
                  ),
                },
              ]}
              data={bids}
            />
          ) : (
            <Alert type="info">No bids yet.</Alert>
          )}
        </Card>
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">Timer</h3>
          <div className="text-center">
            <span className="text-4xl font-mono font-bold text-police-green">
              {paused ? "Paused" : "Live"}
            </span>
          </div>
        </Card>
      </div>
    </div>
  )
}
