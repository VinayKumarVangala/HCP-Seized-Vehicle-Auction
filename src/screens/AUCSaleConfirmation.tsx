/**
 * SVAMS — AUCSaleConfirmation
 * Post-auction sale confirmation & payment flow (AUC-06).
 */

import { Card, PageHeader, Button, Alert } from "../shared/ui"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export const AUCSaleConfirmation = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Sale Confirmation"
        subtitle={`Lot ${id} — Confirm winner and process payment`}
      />
      <Card padding="md">
        <Alert type="success">
          <strong>Lot {id}</strong> has been closed. Winner:{" "}
          <strong>Mohammed Ismail</strong> — Bid: <strong>₹380,000</strong>.
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-sm text-police-muted">Reserve Price</p>
            <p className="font-medium">₹400,000</p>
          </div>
          <div>
            <p className="text-sm text-police-muted">Winning Bid</p>
            <p className="font-medium text-police-green">₹380,000</p>
          </div>
          <div>
            <p className="text-sm text-police-muted">EMD Collected</p>
            <p className="font-medium">₹20,000</p>
          </div>
          <div>
            <p className="text-sm text-police-muted">Balance Due</p>
            <p className="font-medium text-police-danger">₹360,000</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button
            variant="primary"
            onClick={() => alert("Sale certificate generated")}
          >
            Generate Sale Certificate
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/auc-dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
