/**
 * SVAMS — AUC Create Lot (6-step wizard)
 * Lot details → Vehicle selection → Pricing → Scheduling → Terms → Review (AUC-02).
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../api/service"
import {
  Card,
  PageHeader,
  Stepper,
  Button,
  Input,
  Select,
  Textarea,
} from "../shared/ui"

const STEPS = [
  { id: "lot", label: "Lot Details" },
  { id: "vehicles", label: "Vehicle Selection" },
  { id: "pricing", label: "Pricing" },
  { id: "schedule", label: "Scheduling" },
  { id: "terms", label: "Terms" },
  { id: "review", label: "Review" },
]

export const AUCCreateLot = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<any>({})

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.createLot({
        title: form.title,
        description: form.description,
        reservePrice: Number(form.reservePrice || 0),
        startingBid: Number(form.startingBid || 0),
        bidIncrement: Number(form.bidIncrement || 5000),
        vehicleIds: form.vehicleIds || [],
        startDate: form.startDate || new Date().toISOString(),
        endDate: form.endDate || new Date().toISOString(),
        terms: form.terms || "",
        location: form.location || "Hyderabad Auction Yard",
      })
      navigate("/auc-dashboard")
    } catch {
      alert("Failed to create lot")
    }
  }

  const current = STEPS[step]

  return (
    <div>
      <PageHeader
        title="Create Lot"
        subtitle="6-step auction lot creation wizard"
      />
      <Stepper steps={STEPS} activeStep={step} />
      <Card padding="md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {current.id === "lot" && (
            <>
              <Input
                label="Lot Title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                label="Description"
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <Input
                label="Location"
                defaultValue="Hyderabad Auction Yard"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <Button variant="secondary" onClick={back} disabled={step === 0}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Vehicle Selection
              </Button>
            </>
          )}
          {current.id === "vehicles" && (
            <>
              <p className="text-sm text-police-muted">
                Select eligible vehicles for this lot.
              </p>
              <Select
                label="Vehicles"
                options={[
                  { value: "v1", label: "TS09AB1234 — Maruti Swift Dzire" },
                  { value: "v3", label: "TS09EF9012 — Tata Ace" },
                ]}
                value={form.vehicles}
                onChange={(e) =>
                  setForm({ ...form, vehicleIds: [e.target.value] })
                }
              />
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Pricing
              </Button>
            </>
          )}
          {current.id === "pricing" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Reserve Price (₹)"
                  type="number"
                  onChange={(e) =>
                    setForm({ ...form, reservePrice: e.target.value })
                  }
                />
                <Input
                  label="Starting Bid (₹)"
                  type="number"
                  onChange={(e) =>
                    setForm({ ...form, startingBid: e.target.value })
                  }
                />
                <Input
                  label="Bid Increment (₹)"
                  type="number"
                  defaultValue="5000"
                  onChange={(e) =>
                    setForm({ ...form, bidIncrement: e.target.value })
                  }
                />
              </div>
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Scheduling
              </Button>
            </>
          )}
          {current.id === "schedule" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="datetime-local"
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
                <Input
                  label="End Date"
                  type="datetime-local"
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Terms
              </Button>
            </>
          )}
          {current.id === "terms" && (
            <>
              <Textarea
                label="Terms & Conditions"
                defaultValue="As-is where-is basis. EMD required."
                rows={4}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
              />
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Review
              </Button>
            </>
          )}
          {current.id === "review" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-police-muted block">Title:</span>{" "}
                  {form.title}
                </div>
                <div>
                  <span className="text-police-muted block">
                    Reserve Price:
                  </span>{" "}
                  ₹{form.reservePrice}
                </div>
                <div>
                  <span className="text-police-muted block">Starting Bid:</span>{" "}
                  ₹{form.startingBid}
                </div>
                <div>
                  <span className="text-police-muted block">Schedule:</span>{" "}
                  {form.startDate} → {form.endDate}
                </div>
              </div>
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Create Lot
              </Button>
            </>
          )}
        </form>
      </Card>
    </div>
  )
}
