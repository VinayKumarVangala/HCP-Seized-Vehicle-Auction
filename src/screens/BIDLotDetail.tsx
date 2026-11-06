/**
 * SVAMS — BIDLotDetail
 * Vehicle specs, inspection, terms (BID-02).
 */

import { useParams } from "react-router-dom"
import { Card, PageHeader, Badge, Button, Alert } from "../shared/ui"
import { useNavigate } from "react-router-dom"

export const BIDLotDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Lot Detail"
        subtitle={`Lot ${id} — Vehicle specs, inspection, terms`}
      />
      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-police-text mb-3">
              Vehicle Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-police-muted">Registration</span>
                <span className="font-medium">TS09AB1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-police-muted">Make / Model</span>
                <span className="font-medium">Maruti Suzuki Swift Dzire</span>
              </div>
              <div className="flex justify-between">
                <span className="text-police-muted">Year</span>
                <span className="font-medium">2019</span>
              </div>
              <div className="flex justify-between">
                <span className="text-police-muted">Condition</span>
                <span className="font-medium">As-is where-is</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-police-text mb-3">Terms</h3>
            <Alert type="info">
              EMD of ₹20,000 required before bidding. Payment due within 7 days
              of winning.
            </Alert>
            <Badge variant="primary" className="mb-2">
              Reserve Price: ₹400,000
            </Badge>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/bid-bidding/${id}`)}
          >
            Place Bid
          </Button>
          <Button variant="ghost" onClick={() => navigate("/bid-browse")}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}
