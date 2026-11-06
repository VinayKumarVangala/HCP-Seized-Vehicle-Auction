/**
 * SVAMS — TypeScript Interfaces
 * Single source of truth for all API/domain types.
 * Rule R-002: No `any` type; use these interfaces.
 */

export type RoleCode = "PS" | "SHO" | "Legal" | "AuctionCell" | "Finance" | "Admin" | "Bidder"

export type UserStatus = "active" | "inactive" | "suspended"

export interface User {
  id: string
  employeeId: string
  name: string
  role: RoleCode
  policeStation?: string
  email: string
  phone: string
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  token: string
  csrfToken: string
  user: User
  expiresAt: string
}

export interface LoginCredentials {
  employeeId: string
  password: string
  role: RoleCode
}

export type VehicleType = "2W" | "4W" | "Commercial"

export type SeizureStatus = "draft" | "submitted" | "pending_approval" | "approved" | "rejected" | "legal_review" | "legally_cleared" | "court_stay" | "eligible" | "auctioned" | "sold"

export type NoticeType = "registered_post" | "speed_post" | "newspaper"

export type NoticeStatus = "pending" | "sent" | "delivered" | "returned" | "failed"

export type LotStatus = "draft" | "published" | "live" | "paused" | "closed" | "sold" | "cancelled"

export type BidStatus = "active" | "winning" | "outbid" | "rejected"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: Record<string, string[]>
}

/* ------------------------------------------------------------------ */
/* Vehicle                                                            */
/* ------------------------------------------------------------------ */

export interface Vehicle {
  id: string
  registrationNumber: string
  chassisNumber: string
  engineNumber: string
  vehicleType: VehicleType
  make: string
  model: string
  year: number
  color: string
  fuelType: string
  ownerName: string
  ownerAddress: string
  rcNumber: string
  rcExpiry: string
  insuranceNumber: string
  insuranceExpiry: string
  fitnessNumber?: string
  fitnessExpiry?: string
  hypothecation?: string
  currentValue: number
  images: string[]
  vahanVerified: boolean
  cctnsVerified: boolean
  vahanData?: Record<string, unknown>
  cctnsData?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface VehicleFilters extends PaginationParams {
  vehicleType?: VehicleType
  status?: SeizureStatus
  policeStation?: string
}

/* ------------------------------------------------------------------ */
/* Seizure                                                            */
/* ------------------------------------------------------------------ */

export interface Seizure {
  id: string
  seizureNumber: string
  vehicleId: string
  vehicle?: Vehicle
  policeStation: string
  seizedBy: string
  seizedByName: string
  seizureDate: string
  seizureLocation: string
  seizureReason: string
  firNumber: string
  firDate: string
  courtCaseNumber?: string
  courtStay: boolean
  courtStayDetails?: string
  status: SeizureStatus
  documents: Document[]
  valuation?: Valuation
  notices: Notice[]
  complianceNoticeCount: number
  approvedBy?: string
  approvedByName?: string
  approvedAt?: string
  rejectionReason?: string
  legalClearedBy?: string
  legalClearedAt?: string
  eligibleForAuction: boolean
  createdAt: string
  updatedAt: string
}

export interface SeizureCreateInput {
  vehicleId: string
  policeStation: string
  seizureDate: string
  seizureLocation: string
  seizureReason: string
  firNumber: string
  firDate: string
  courtCaseNumber?: string
  documents?: DocumentCreateInput[]
  valuation?: ValuationCreateInput
}

export interface SeizureUpdateInput {
  status?: SeizureStatus
  rejectionReason?: string
  courtStay?: boolean
  courtStayDetails?: string
}

/* ------------------------------------------------------------------ */
/* Notice                                                             */
/* ------------------------------------------------------------------ */

export interface Notice {
  id: string
  seizureId: string
  noticeType: NoticeType
  noticeNumber: string
  issueDate: string
  dueDate: string
  status: NoticeStatus
  deliveryDate?: string
  deliveryMode?: string
  acknowledgmentNumber?: string
  returnedReason?: string
  attempts: number
  createdAt: string
  updatedAt: string
}

export interface NoticeCreateInput {
  seizureId: string
  noticeType: NoticeType
  issueDate: string
  dueDate: string
  deliveryMode?: string
}

/* ------------------------------------------------------------------ */
/* Document                                                           */
/* ------------------------------------------------------------------ */

export interface Document {
  id: string
  entityType: "seizure" | "lot" | "valuation" | "clearance"
  entityId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedBy: string
  uploadedAt: string
}

export interface DocumentCreateInput {
  entityType: Document["entityType"]
  entityId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

/* ------------------------------------------------------------------ */
/* Valuation                                                          */
/* ------------------------------------------------------------------ */

export interface Valuation {
  id: string
  seizureId: string
  assessedValue: number
  marketValue: number
  valuerName: string
  valuationDate: string
  remarks: string
  documents: Document[]
  createdAt: string
}

export interface ValuationCreateInput {
  seizureId: string
  assessedValue: number
  marketValue: number
  valuerName: string
  valuationDate: string
  remarks: string
}

/* ------------------------------------------------------------------ */
/* Auction Lot                                                        */
/* ------------------------------------------------------------------ */

export interface LotVehicle {
  id: string
  lotId: string
  vehicleId: string
  vehicle?: Vehicle
  reservePrice: number
}

export interface AuctionLot {
  id: string
  lotNumber: string
  title: string
  description: string
  status: LotStatus
  reservePrice: number
  startingBid: number
  bidIncrement: number
  minBid: number
  currentBid: number
  currentBidderId?: string
  currentBidderName?: string
  vehicleIds: string[]
  vehicles: LotVehicle[]
  startDate: string
  endDate: string
  autoExtendMinutes: number
  autoExtendWindowMinutes: number
  terms: string
  location: string
  createdBy: string
  createdByName?: string
  createdAt: string
  updatedAt: string
  closedAt?: string
  winnerBidId?: string
}

export interface AuctionLotCreateInput {
  title: string
  description: string
  reservePrice: number
  startingBid: number
  bidIncrement: number
  vehicleIds: string[]
  startDate: string
  endDate: string
  autoExtendMinutes?: number
  autoExtendWindowMinutes?: number
  terms: string
  location: string
}

/* ------------------------------------------------------------------ */
/* Bid                                                                */
/* ------------------------------------------------------------------ */

export interface Bid {
  id: string
  lotId: string
  bidderId: string
  bidderName: string
  amount: number
  status: BidStatus
  isAutoBid: boolean
  maxBid?: number
  placedAt: string
}

export interface BidCreateInput {
  lotId: string
  amount: number
  isAutoBid?: boolean
  maxBid?: number
}

/* ------------------------------------------------------------------ */
/* Notice Rule                                                        */
/* ------------------------------------------------------------------ */

export interface NoticeRule {
  id: string
  vehicleType: VehicleType
  crimeType: string
  noticesRequired: number
  intervals: number[] // days between notices
  deliveryMethods: NoticeType[]
  escalationDays: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/* Audit Log                                                          */
/* ------------------------------------------------------------------ */

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: RoleCode
  action: string
  entityType: string
  entityId: string
  beforeValue?: Record<string, unknown>
  afterValue?: Record<string, unknown>
  ipAddress: string
  severity: "info" | "warning" | "error" | "critical"
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* Dashboard / KPI                                                    */
/* ------------------------------------------------------------------ */

export interface KPICard {
  label: string
  value: number | string
  trend: number
  trendDirection: "up" | "down" | "neutral"
  variant: "primary" | "success" | "warning" | "danger" | "info"
}

export interface DashboardStats {
  totalVehicles: number
  totalSeizures: number
  pendingNotices: number
  eligibleVehicles: number
  activeLots: number
  totalBids: number
  totalRevenue: number
}

/* ------------------------------------------------------------------ */
/* Notification                                                       */
/* ------------------------------------------------------------------ */

export interface Notification {
  id: string
  recipientRole: RoleCode
  recipientId?: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  read: boolean
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* WebSocket                                                          */
/* ------------------------------------------------------------------ */

export type WebSocketMessageType = "auction:bid_placed" | "auction:timer_update" | "auction:pause" | "auction:resume" | "auction:close" | "seizure:created" | "seizure:approved" | "notice:recorded" | "notice:returned" | "notification:new" | "auth:session_expired"

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType
  payload: T
  timestamp: string
}
