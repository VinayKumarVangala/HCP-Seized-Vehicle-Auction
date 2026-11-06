/**
 * SVAMS — Placeholder Screens
 * Temporary placeholders for screens pending full implementation.
 */

import { useParams } from "react-router-dom"
import { Card, PageHeader, Badge, Alert, Button } from "../shared/ui"
import { useAuth } from "../contexts/AuthContext"

type PlaceholderProps = { title: string; subtitle?: string; role?: string }

const PlaceholderScreen = ({ title, subtitle, role }: PlaceholderProps) => {
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card padding="md">
        <Alert type="info">
          This screen is a placeholder. Full implementation pending.
        </Alert>
        {id && (
          <p>
            Route parameter <code>{id}</code> received.
          </p>
        )}
        {role && user && (
          <p>
            Current user role: <Badge variant="primary">{user.role}</Badge>{" "}
            (screen requires: {role})
          </p>
        )}
        <Button variant="ghost">Back</Button>
      </Card>
    </div>
  )
}

export const PSDashboard = () => (
  <PlaceholderScreen
    title="PS Dashboard"
    subtitle="KPIs, recent seizures, quick actions"
    role="PS"
  />
)
export const PSVehicleList = () => (
  <PlaceholderScreen
    title="Vehicle List"
    subtitle="Filterable registry with bulk actions"
    role="PS"
  />
)
export const PSNewSeizure = () => (
  <PlaceholderScreen
    title="New Seizure"
    subtitle="6-step wizard with VAHAN/CCTNS"
    role="PS"
  />
)
export const PSVehicleDetail = () => (
  <PlaceholderScreen
    title="Vehicle Detail"
    subtitle="8 tabs: Overview, Notices, Docs, etc."
    role="PS"
  />
)
export const PSNoticeTracking = () => (
  <PlaceholderScreen
    title="Notice Tracking"
    subtitle="3-notice compliance table + drawer"
    role="PS"
  />
)
export const SHOApprovalQueue = () => (
  <PlaceholderScreen
    title="SHO Approval Queue"
    subtitle="Pending seizures with approve/reject"
    role="SHO"
  />
)
export const SHOReviewVehicle = () => (
  <PlaceholderScreen
    title="Review Vehicle"
    subtitle="Vehicle review before decision"
    role="SHO"
  />
)
export const LegalDashboard = () => (
  <PlaceholderScreen
    title="Legal Dashboard"
    subtitle="Cases under review, court stays, claims"
    role="Legal"
  />
)
export const AuctionDashboard = () => (
  <PlaceholderScreen
    title="Auction Dashboard"
    subtitle="Auction overview and metrics"
    role="AuctionCell"
  />
)
export const AUCEligibleVehicles = () => (
  <PlaceholderScreen
    title="Eligible Vehicles"
    subtitle="Vehicles cleared for auction"
    role="AuctionCell"
  />
)
export const AUCCreateLot = () => (
  <PlaceholderScreen
    title="Create Lot"
    subtitle="6-step lot creation wizard"
    role="AuctionCell"
  />
)
export const AUCLiveAuction = () => (
  <PlaceholderScreen
    title="Live Auction"
    subtitle="Real-time operator view"
    role="AuctionCell"
  />
)
export const AUCSaleConfirmation = () => (
  <PlaceholderScreen
    title="Sale Confirmation"
    subtitle="Post-auction payment flow"
    role="AuctionCell"
  />
)
export const FinDashboard = () => (
  <PlaceholderScreen
    title="Finance Dashboard"
    subtitle="Payments, EMD, Refunds, Reconciliation"
    role="Finance"
  />
)
export const AdmDashboard = () => (
  <PlaceholderScreen
    title="Admin Dashboard"
    subtitle="System overview and metrics"
    role="Admin"
  />
)
export const ADMNoticeRules = () => (
  <PlaceholderScreen
    title="Notice Rules"
    subtitle="Configurable compliance rules"
    role="Admin"
  />
)
export const AdminUsers = () => (
  <PlaceholderScreen
    title="User Management"
    subtitle="Officer accounts + roles"
    role="Admin"
  />
)
export const BIDDashboard = () => (
  <PlaceholderScreen
    title="Bidder Dashboard"
    subtitle="Bidder overview and active lots"
    role="Bidder"
  />
)
export const BIDBrowse = () => (
  <PlaceholderScreen
    title="Browse Auctions"
    subtitle="Public auction listing"
    role="Bidder"
  />
)
export const BIDLotDetail = () => (
  <PlaceholderScreen
    title="Lot Detail"
    subtitle="Vehicle specs, inspection, terms"
    role="Bidder"
  />
)
export const BIDBiddingScreen = () => (
  <PlaceholderScreen
    title="Bidding"
    subtitle="Real-time bidder interface"
    role="Bidder"
  />
)
