/**
 * SVAMS — Form Components
 * Form, Stepper, Modal, Drawer
 */

import type { ChangeEvent, ReactNode } from "react"
import { Button } from "./Button"

/* ------------------------------------------------------------------ */
/* Stepper                                                            */
/* ------------------------------------------------------------------ */

export interface StepperStep {
  id: string
  label: string
}

export interface StepperProps {
  steps: StepperStep[]
  activeStep: number
  className?: string
  vertical?: boolean
}

export const Stepper = ({
  steps,
  activeStep,
  className,
  vertical = false,
}: StepperProps) => (
  <div className={`relative ${vertical ? "pl-8" : ""} ${className ?? ""}`}>
    {steps.map((step, i) => {
      const isActive = i === activeStep
      const isCompleted = i < activeStep
      return (
        <div
          key={step.id}
          className="flex items-center gap-3 mb-6 last:mb-0 relative"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold transition-all">
            {isCompleted ? (
              <svg
                className="text-police-green"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : isActive ? (
              <span className="bg-police-green text-white">1</span>
            ) : (
              <span className="text-police-muted border-police-border">
                {i + 1}
              </span>
            )}
          </div>
          <span
            className={`text-sm font-medium ${
              isActive ? "text-police-green" : "text-police-muted"
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                isCompleted ? "bg-police-green" : "bg-police-border"
              }`}
            />
          )}
        </div>
      )
    })}
  </div>
)

/* ------------------------------------------------------------------ */
/* Modal                                                              */
/* ------------------------------------------------------------------ */

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) => {
  if (!open) return null
  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className ?? ""}`}
      >
        <div className="police-panel rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
          {title && (
            <div className="p-5 border-b border-police-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-police-text">{title}</h2>
              <button
                onClick={onClose}
                className="rounded p-1 hover:bg-police-light text-police-muted"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Drawer                                                             */
/* ------------------------------------------------------------------ */

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  placement?: "left" | "right"
  className?: string
}

export const Drawer = ({
  open,
  onClose,
  title,
  children,
  placement = "right",
  className,
}: DrawerProps) => {
  if (!open) return null
  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className={`fixed inset-0 z-50 ${className ?? ""}`}>
        <div
          className={`flex h-full ${
            placement === "left" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`police-panel w-full max-w-md h-full flex flex-col shadow-lg ${
              placement === "left" ? "" : ""
            }`}
          >
            {title && (
              <div className="p-5 border-b border-police-border flex items-center justify-between">
                <h2 className="text-lg font-bold text-police-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded p-1 hover:bg-police-light text-police-muted"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Form (dynamic renderer)                                            */
/* ------------------------------------------------------------------ */

export interface FormFieldConfig {
  name: string
  type: "input" | "select" | "textarea" | "checkbox" | "radio"
  label: string
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
}

export interface FormProps {
  fields: FormFieldConfig[]
  values: Record<string, string | boolean>
  onChange: (values: Record<string, string | boolean>) => void
  onSubmit: (values: Record<string, string | boolean>) => void
  errors?: Record<string, string>
  className?: string
}

export const Form = ({
  fields,
  values,
  onChange,
  onSubmit,
  errors,
  className,
}: FormProps) => {
  const handleChange = (name: string, value: string | boolean) => {
    onChange({ ...values, [name]: value })
  }

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className ?? ""}`}>
      {fields.map((field) => {
        const value = values[field.name] ?? ""
        const error = errors?.[field.name]
        switch (field.type) {
          case "input":
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-police-text mb-1">
                  {field.label}{" "}
                  {field.required && (
                    <span className="text-police-danger ml-1">*</span>
                  )}
                </label>
                <input
                  name={field.name}
                  value={typeof value === "string" ? value : ""}
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`police-input w-full ${
                    error ? "border-police-danger" : ""
                  }`}
                />
                {error && (
                  <p className="mt-1 text-xs text-police-danger">{error}</p>
                )}
              </div>
            )
          case "textarea":
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-police-text mb-1">
                  {field.label}{" "}
                  {field.required && (
                    <span className="text-police-danger ml-1">*</span>
                  )}
                </label>
                <textarea
                  name={field.name}
                  value={typeof value === "string" ? value : ""}
                  rows={3}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`police-input w-full min-h-[80px] ${
                    error ? "border-police-danger" : ""
                  }`}
                />
                {error && (
                  <p className="mt-1 text-xs text-police-danger">{error}</p>
                )}
              </div>
            )
          case "select":
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-police-text mb-1">
                  {field.label}{" "}
                  {field.required && (
                    <span className="text-police-danger ml-1">*</span>
                  )}
                </label>
                <select
                  name={field.name}
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`police-input w-full ${
                    error ? "border-police-danger" : ""
                  }`}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {error && (
                  <p className="mt-1 text-xs text-police-danger">{error}</p>
                )}
              </div>
            )
          case "checkbox":
            return (
              <div key={field.name} className="flex items-start gap-2">
                <input
                  name={field.name}
                  type="checkbox"
                  checked={typeof value === "boolean" ? value : false}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="mt-0.5 rounded border-police-border text-police-green focus:ring-police-green"
                />
                <label
                  className="text-sm text-police-text"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                {error && (
                  <p className="mt-1 text-xs text-police-danger">{error}</p>
                )}
              </div>
            )
          default:
            return null
        }
      })}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </form>
  )
}
