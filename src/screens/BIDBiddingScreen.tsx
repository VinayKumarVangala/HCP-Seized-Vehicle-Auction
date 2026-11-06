/**
 * SVAMS — BIDBiddingScreen
 * Real-time bidder interface with auto-bid (BID-03, BID-04).
 */

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Card, PageHeader, Button, Input, Badge } from "../shared/ui"
import { wsService } from "../api/websocket"
import type { WebSocketMessageType } from "../api/types"

export const BIDBiddingScreen = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentBid, setCurrentBid] = useState(380000)
  const [myBid, setMyBid] = useState("")
  const [maxBid, setMaxBid] = useState("")
  const [autoBid, setAutoBid] = useState(false)
  ;[wsService]

  useEffect(() => {
    const unsub = wsService.subscribe(
      "auction:bid_placed" as WebSocketMessageType,
      (msg: any) => {
        setCurrentBid(msg.payload.amount)
      },
    )
    return () => unsub()
  }, [])

  const placeBid = async () => {
    const amount = Number(myBid)
    if (amount <= currentBid) {
      alert("Bid must be higher than current bid")
      return
    }
    setCurrentBid(amount)
    setMyBid("")
  }

  return (
    <div>
      <PageHeader
        title="Place Bid"
        subtitle={`Lot ${id} — Real-time bidder interface`}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">
            Current Bid (H1)
          </h3>
          <div className="text-center">
            <span className="text-4xl font-mono font-bold text-police-green">
              ₹{currentBid.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Your bid amount"
              type="number"
              value={myBid}
              onChange={(e) => setMyBid(e.target.value)}
              className="flex-1"
            />
            <Button variant="primary" onClick={placeBid}>
              Place Bid
            </Button>
          </div>
        </Card>
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">Auto-Bid</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoBid}
                onChange={(e) => setAutoBid(e.target.checked)}
                className="rounded border-police-border text-police-green focus:ring-police-green"
              />
              <label className="text-sm text-police-text">
                Enable auto-bidding
              </label>
            </div>
            <Input
              placeholder="Maximum bid (₹)"
              type="number"
              value={maxBid}
              onChange={(e) => setMaxBid(e.target.value)}
              disabled={!autoBid}
            />
            <p className="text-xs text-police-muted">
              System will bid on your behalf up to your maximum.
            </p>
          </div>
        </Card>
        <Card padding="md">
          <h3 className="text-sm font-bold text-police-text mb-4">
            Your Status
          </h3>
          <Badge variant="success" className="mb-2">
            Winning bidder
          </Badge>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-police-muted">Your last bid</span>
              <span className="font-medium">₹380,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-police-muted">Reserve price</span>
              <span className="font-medium">₹400,000</span>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/bid-lot-detail/${id}`)}
        >
          Back to Lot
        </Button>
      </div>
    </div>
  )
}
