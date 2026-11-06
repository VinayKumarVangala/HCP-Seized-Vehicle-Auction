/**
 * SVAMS — Data Display Components
 * Badge, Card, Table, Avatar, Alert, Tabs, Tooltip, KPICard, PageHeader, EligibilityChip, NoticeTracker
 */

import type { ReactNode } from "react"

/* ------------------------------------------------------------------ */
/* Badge                                                              */
/* ------------------------------------------------------------------ */

export interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary"
  className?: string
}

const badgeVariants: Record<string, string> = {
  default: "bg-police-muted text-white",
  success: "bg-police-success text-white",
  warning: "bg-police-warning text-white",
  danger: "bg-police-danger text-white",
  info: "bg-police-info text-white",
  primary: "bg-police-green text-white",
}

export const Badge = ({
  children,
  variant = "default",
  className,
}: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeVariants[variant]} ${className ?? ""}`}
  >
    {children}
  </span>
)

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */

export interface CardProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  padding?: "none" | "sm" | "md" | "lg"
  className?: string
}

const cardPadding: Record<string, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
}

export const Card = ({
  children,
  header,
  footer,
  padding = "md",
  className,
}: CardProps) => (
  <div className={`police-panel ${cardPadding[padding]} ${className ?? ""}`}>
    {header && <div className="mb-3">{header}</div>}
    <div>{children}</div>
    {footer && <div className="mt-3">{footer}</div>}
  </div>
)

/* ------------------------------------------------------------------ */
/* Avatar                                                             */
/* ------------------------------------------------------------------ */

export interface AvatarProps {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const avatarSizes: Record<string, string> = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
}

export const Avatar = ({ src, alt, size = "md", className }: AvatarProps) => {
  const initials = alt
    ? alt
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-police-border bg-white ${avatarSizes[size]} ${className ?? ""}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        initials
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Alert                                                              */
/* ------------------------------------------------------------------ */

export interface AlertProps {
  children: ReactNode
  type?: "success" | "warning" | "danger" | "info"
  className?: string
}

const alertStyles: Record<string, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  danger: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
}

export const Alert = ({ children, type = "info", className }: AlertProps) => (
  <div
    className={`rounded-md border p-4 ${alertStyles[type]} ${className ?? ""}`}
  >
    {children}
  </div>
)

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

export interface TabsProps {
  tabs: { id: string; label: string }[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export const Tabs = ({ tabs, activeId, onChange, className }: TabsProps) => (
  <div
    className={`flex gap-1 border-b border-police-border mb-4 ${className ?? ""}`}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`-mb-2 px-3 py-2 text-sm font-medium border-b-2 ${
          activeId === tab.id
            ? "border-police-green text-police-green"
            : "border-transparent text-police-muted hover:text-police-text hover:bg-police-light"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
)

/* ------------------------------------------------------------------ */
/* Tooltip                                                            */
/* ------------------------------------------------------------------ */

export interface TooltipProps {
  children: ReactNode
  text: string
  className?: string
}

export const Tooltip = ({ children, text, className }: TooltipProps) => (
  <div className={`relative inline-block ${className ?? ""}`} title={text}>
    {children}
  </div>
)

/* ------------------------------------------------------------------ */
/* KPICard                                                            */
/* ------------------------------------------------------------------ */

export interface KPICardProps {
  title: string
  value: number | string
  trend?: number
  trendDirection?: "up" | "down" | "neutral"
  variant?: "primary" | "success" | "warning" | "danger" | "info"
  className?: string
}

export const KPICard = ({
  title,
  value,
  trend,
  trendDirection = "neutral",
  className,
}: KPICardProps) => {
  const trendColor =
    trendDirection === "up"
      ? "text-police-success"
      : trendDirection === "down"
        ? "text-police-danger"
        : "text-police-muted"
  return (
    <div className={`police-panel p-5 ${className ?? ""}`}>
      <h3 className="text-xs font-medium text-police-muted uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-1 text-2xl font-bold text-police-text">{value}</div>
      {trend !== undefined && (
        <div
          className={`mt-1 text-xs font-medium flex items-center gap-1 ${trendColor}`}
        >
          {trendDirection === "up"
            ? "▲"
            : trendDirection === "down"
              ? "▼"
              : "—"}{" "}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* PageHeader                                                         */
/* ------------------------------------------------------------------ */

export interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  className?: string
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) => (
  <div className={`mb-6 ${className ?? ""}`}>
    {breadcrumbs && (
      <div className="mb-2 text-xs text-police-muted">{breadcrumbs}</div>
    )}
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-police-text">{title}</h1>
        {subtitle && <p className="text-police-muted">{subtitle}</p>}
      </div>
      {actions && <div className="mt-1">{actions}</div>}
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* EligibilityChip                                                    */
/* ------------------------------------------------------------------ */

export type EligibilityStatus = "eligible" | "ineligible" | "pending" | "under-review"

export interface EligibilityChipProps {
  status: EligibilityStatus
  className?: string
}

const eligibilityStyles: Record<EligibilityStatus, string> = {
  eligible: "bg-green-50 text-green-700 border-green-200",
  ineligible: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  "under-review": "bg-blue-50 text-blue-700 border-blue-200",
}

const eligibilityLabels: Record<EligibilityStatus, string> = {
  eligible: "Eligible",
  ineligible: "Ineligible",
  pending: "Pending",
  "under-review": "Under Review",
}

export const EligibilityChip = ({
  status,
  className,
}: EligibilityChipProps) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${eligibilityStyles[status]} ${className ?? ""}`}
  >
    {eligibilityLabels[status]}
  </span>
)

/* ------------------------------------------------------------------ */
/* NoticeTracker                                                      */
/* ------------------------------------------------------------------ */

export interface NoticeStage {
  type: string
  label: string
  status: "pending" | "sent" | "delivered" | "returned"
}

export interface NoticeTrackerProps {
  stages: NoticeStage[]
  className?: string
}

export const NoticeTracker = ({ stages, className }: NoticeTrackerProps) => (
  <div className={`w-full ${className ?? ""}`}>
    <div className="relative flex items-center">
      <div className="flex-1 h-0.5 bg-police-border" />
      {stages.map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-police-border"
          style={{ left: `${(i / (stages.length - 1)) * 100}%` }}
        />
      ))}
    </div>
    <div className="flex justify-between mt-2">
      {stages.map((stage, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
              stage.status === "delivered"
                ? "bg-police-green border-police-green text-white"
                : stage.status === "returned"
                  ? "bg-police-danger border-police-danger text-white"
                  : stage.status === "sent"
                    ? "bg-police-gold border-police-gold text-white"
                    : "bg-white border-police-border text-police-muted"
            }`}
          >
            {i + 1}
          </div>
          <span className="text-xs text-police-text">{stage.label}</span>
        </div>
      ))}
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Spinner                                                            */
/* ------------------------------------------------------------------ */

export interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const spinnerSizes: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => (
  <div
    className={`animate-spin rounded-full border-2 border-police-border border-t-police-green ${spinnerSizes[size]} ${className ?? ''}`}
  />
)

/* ------------------------------------------------------------------ */
/* Table (simple)                                                     */
/* ------------------------------------------------------------------ */

export interface TableColumn<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  className?: string
}

export const Table = <T extends Record<string, unknown>,>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  className,
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className="police-panel p-8 text-center text-police-muted">
        Loading...
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="police-panel p-8 text-center text-police-muted">
        {emptyMessage}
      </div>
    )
  }
  return (
    <div className={`police-panel overflow-x-auto ${className ?? ""}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-police-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-xs font-medium text-police-muted uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row.id)}
              className="border-b border-police-border hover:bg-police-light"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-police-text"
                >
                  {col.render ? col.render(row as T) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
