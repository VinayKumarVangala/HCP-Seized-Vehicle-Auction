/**
 * SVAMS — PS New Seizure (6-step wizard)
 * Vehicle details → Seizure details → Owner details → Documents → Valuation → Review → Submit (PS-03).
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../api/service"
import { notificationService } from "../api/notifications"
import {
  Card,
  PageHeader,
  Stepper,
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
} from "../shared/ui"

const STEPS = [
  { id: "vehicle", label: "Vehicle Details" },
  { id: "seizure", label: "Seizure Details" },
  { id: "owner", label: "Owner Details" },
  { id: "documents", label: "Documents" },
  { id: "valuation", label: "Valuation" },
  { id: "review", label: "Review & Submit" },
]

export const PSNewSeizure = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiService.createSeizure({
        vehicleId: form.vehicleId || "v1",
        policeStation: "Hyderabad Central",
        seizureDate: form.seizureDate || new Date().toISOString(),
        seizureLocation: form.seizureLocation || "",
        seizureReason: form.seizureReason || "",
        firNumber: form.firNumber || "",
        firDate: form.firDate || new Date().toISOString(),
      })
      await notificationService.notifySeizureCreated(
        form.seizureNumber || "SEZ-NEW",
        form.registrationNumber || "TS09",
        "SHO",
      )
      navigate("/ps-dashboard")
    } catch {
      alert("Failed to create seizure")
    } finally {
      setSubmitting(false)
    }
  }

  const current = STEPS[step]

  return (
    <div>
      <PageHeader title="New Seizure" subtitle="6-step seizure entry wizard" />
      <Stepper steps={STEPS} activeStep={step} />
      <Card padding="md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {current.id === "vehicle" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Registration Number"
                  placeholder="TS09AB1234"
                  onChange={(e) =>
                    setForm({ ...form, registrationNumber: e.target.value })
                  }
                />
                <Select
                  label="Vehicle Type"
                  options={[
                    { value: "2W", label: "2-Wheeler" },
                    { value: "4W", label: "4-Wheeler" },
                    { value: "Commercial", label: "Commercial" },
                  ]}
                  value={form.vehicleType}
                  onChange={(e) =>
                    setForm({ ...form, vehicleType: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Make"
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                />
                <Input
                  label="Model"
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Year"
                  type="number"
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
                <Input
                  label="Color"
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
                <Input
                  label="Chassis Number"
                  onChange={(e) =>
                    setForm({ ...form, chassisNumber: e.target.value })
                  }
                />
              </div>
              <Button variant="secondary" onClick={back} disabled={step === 0}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Seizure Details
              </Button>
            </>
          )}
          {current.id === "seizure" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Seizure Location"
                  onChange={(e) =>
                    setForm({ ...form, seizureLocation: e.target.value })
                  }
                />
                <Input
                  label="Seizure Date"
                  type="date"
                  onChange={(e) =>
                    setForm({ ...form, seizureDate: e.target.value })
                  }
                />
                <Input
                  label="FIR Number"
                  onChange={(e) =>
                    setForm({ ...form, firNumber: e.target.value })
                  }
                />
              </div>
              <Textarea
                label="Seizure Reason"
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, seizureReason: e.target.value })
                }
              />
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Owner Details
              </Button>
            </>
          )}
          {current.id === "owner" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Owner Name"
                  onChange={(e) =>
                    setForm({ ...form, ownerName: e.target.value })
                  }
                />
                <Input
                  label="Owner Address"
                  onChange={(e) =>
                    setForm({ ...form, ownerAddress: e.target.value })
                  }
                />
              </div>
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Documents
              </Button>
            </>
          )}
          {current.id === "documents" && (
            <>
              <p className="text-sm text-police-muted">
                Upload seizure memo, RC, insurance, photos, FIR.
              </p>
              <Input
                label="Document File"
                type="file"
                className="police-input p-0 border-0 bg-transparent"
              />
              <Button variant="ghost" onClick={() => {}}>
                Add Document
              </Button>
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button variant="primary" onClick={next}>
                Next: Valuation
              </Button>
            </>
          )}
          {current.id === "valuation" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Assessed Value (₹)"
                  type="number"
                  onChange={(e) =>
                    setForm({ ...form, assessedValue: e.target.value })
                  }
                />
                <Input
                  label="Market Value (₹)"
                  type="number"
                  onChange={(e) =>
                    setForm({ ...form, marketValue: e.target.value })
                  }
                />
              </div>
              <Input
                label="Valuer Name"
                onChange={(e) =>
                  setForm({ ...form, valuerName: e.target.value })
                }
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
                  <span className="text-police-muted block">Registration:</span>{" "}
                  {form.registrationNumber || "—"}
                </div>
                <div>
                  <span className="text-police-muted block">Owner:</span>{" "}
                  {form.ownerName || "—"}
                </div>
                <div>
                  <span className="text-police-muted block">
                    Seizure Reason:
                  </span>{" "}
                  {form.seizureReason || "—"}
                </div>
                <div>
                  <span className="text-police-muted block">
                    Assessed Value:
                  </span>{" "}
                  ₹{form.assessedValue || "—"}
                </div>
              </div>
              <Checkbox
                label="I confirm all details are accurate and documents are uploaded"
                checked={true}
                onChange={() => {}}
              />
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit Seizure
              </Button>
            </>
          )}
        </form>
      </Card>
    </div>
  )
}
