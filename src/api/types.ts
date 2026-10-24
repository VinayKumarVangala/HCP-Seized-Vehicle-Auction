// SVAMS API Types
// Centralized type definitions for the entire application

export type Role = 'PS' | 'SHO' | 'Legal' | 'AuctionCell' | 'Finance' | 'Admin' | 'Bidder';

export type Screen =
  | 'login'
  | 'ps-dashboard' | 'ps-vehicle-list' | 'ps-new-seizure' | 'ps-vehicle-detail' | 'ps-notice-tracking'
  | 'sho-dashboard' | 'sho-approval-queue' | 'sho-review-vehicle'
  | 'legal-dashboard'
  | 'auc-dashboard' | 'auc-eligible' | 'auc-create-lot' | 'auc-live-auction' | 'auc-sale-confirmation'
  | 'fin-dashboard'
  | 'adm-dashboard' | 'adm-notice-rules' | 'adm-users'
  | 'bid-dashboard' | 'bid-browse' | 'bid-lot-detail' | 'bid-bidding';

export interface User {
  id: string;
  userId: string;
  name: string;
  role: Role;
  station?: string;
  district?: string;
  email: string;
  phone: string;
  avatar?: string;
  lastLogin: string;
  isActive: boolean;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'reject')[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  csrfToken: string | null;
}

export interface LoginCredentials {
  role: Role;
  userId: string;
  password: string;
  rememberMe?: boolean;
  captchaToken?: string;
}

export interface LoginResponse {
  user: User;
  sessionId: string;
  csrfToken: string;
  expiresAt: string;
}

export interface Vehicle {
  id: string;
  registrationNo: string;
  chassisNo: string;
  engineNo: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  fuelType: FuelType;
  color: string;
  odometer: number;
  registrationDate: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  hypothecation: string | null;
  rcStatus: RCStatus;
}

export type VehicleCategory = '2-Wheeler' | '4-Wheeler' | 'Commercial' | 'Other';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
export type RCStatus = 'Active' | 'Expired' | 'Cancelled' | 'Suspended';

export interface Seizure {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  memoNo: string;
  seizureDate: string;
  seizureTime: string;
  place: string;
  firNo: string;
  firDate: string;
  category: SeizureCategory;
  custodyLocation: string;
  conditionNotes: string;
  keysAvailable: boolean;
  investigatingOfficer: Officer;
  policeStation: PoliceStation;
  district: District;
  status: SeizureStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type SeizureCategory = 'Crime Vehicle' | 'Victim Vehicle';
export type SeizureStatus = 'Draft' | 'Submitted' | 'SHO Approved' | 'Legal Review' | 'Auction Ready' | 'Auctioned' | 'Returned' | 'Court Stay';

export interface Officer {
  id: string;
  name: string;
  rank: string;
  badgeNo: string;
  stationId: string;
  phone: string;
  email: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  code: string;
  districtId: string;
  address: string;
  phone: string;
  email: string;
  jurisdiction: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  state: string;
}

export interface Owner {
  id: string;
  name: string;
  mobile: string;
  address: string;
  aadhaar?: string;
  pan?: string;
  licenseNo?: string;
  rcVerified: boolean;
  verificationSource: string;
  verificationRef: string;
  verificationDate: string;
}

export interface Notice {
  id: string;
  seizureId: string;
  noticeNumber: number;
  noticeType: NoticeType;
  sentDate: string;
  mode: NoticeMode;
  address: string;
  trackingNumber: string;
  deliveryStatus: DeliveryStatus;
  acknowledgementDate?: string;
  returnedDate?: string;
  returnReason?: string;
  proofDocumentId?: string;
  proofDocumentUrl?: string;
  remarks: string;
  createdAt: string;
  createdBy: string;
}

export type NoticeType = 1 | 2 | 3;
export type NoticeMode = 'Registered Post' | 'Speed Post' | 'Email' | 'SMS' | 'Public Notice Board' | 'Newspaper Publication';
export type DeliveryStatus = 'Pending' | 'Sent' | 'Delivered' | 'Returned' | 'Failed';

export interface Valuation {
  id: string;
  seizureId: string;
  estimatedValue: number;
  valuationOfficer: Officer;
  valuationDate: string;
  reportDocumentId?: string;
  reportDocumentUrl?: string;
  remarks: string;
  status: ValuationStatus;
}

export type ValuationStatus = 'Pending' | 'Completed' | 'Disputed' | 'Revised';

export interface Document {
  id: string;
  seizureId: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type DocumentType = 'Seizure Memo' | 'RC Copy' | 'Insurance Certificate' | 'Vehicle Photos' | 'FIR Copy' | 'Permit/NOC' | 'Valuation Report' | 'Notice Proof' | 'Other';
export type DocumentCategory = 'Mandatory' | 'Optional' | 'Supporting';

export interface AuctionLot {
  id: string;
  lotNumber: string;
  title: string;
  description: string;
  category: LotCategory;
  districtId: string;
  district: District;
  vehicles: AuctionLotVehicle[];
  totalReservePrice: number;
  bidIncrement: number;
  emdAmount: number;
  startDate: string;
  endDate: string;
  autoExtendMinutes: number;
  termsAndConditions: string;
  termsDocumentId?: string;
  termsDocumentUrl?: string;
  status: LotStatus;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
}

export type LotCategory = 'Mixed' | '2-Wheeler' | '4-Wheeler' | 'Commercial';
export type LotStatus = 'Draft' | 'Published' | 'Live' | 'Closed' | 'Cancelled' | 'Completed';

export interface AuctionLotVehicle {
  id: string;
  lotId: string;
  seizureId: string;
  seizure: Seizure;
  reservePrice: number;
  sequence: number;
}

export interface Bid {
  id: string;
  lotId: string;
  vehicleId: string;
  bidderId: string;
  bidder: Bidder;
  amount: number;
  timestamp: string;
  isWinning: boolean;
  isAutoBid: boolean;
  autoBidLimit?: number;
}

export interface Bidder {
  id: string;
  bidderId: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  pan: string;
  gstin?: string;
  address: string;
  kycStatus: KYCStatus;
  kycVerifiedAt?: string;
  emdBalance: number;
  emdDeposited: number;
  isActive: boolean;
  registeredAt: string;
}

export type KYCStatus = 'Pending' | 'Verified' | 'Rejected' | 'Expired';

export interface AuctionSession {
  lotId: string;
  lot: AuctionLot;
  currentVehicleIndex: number;
  currentVehicle: AuctionLotVehicle | null;
  timeRemaining: number;
  isPaused: boolean;
  isExtended: boolean;
  highestBid: Bid | null;
  bidHistory: Bid[];
  activeBidders: Bidder[];
  startedAt: string;
  endsAt: string;
}

export interface SaleConfirmation {
  id: string;
  lotId: string;
  lot: AuctionLot;
  winningBid: Bid;
  winningBidder: Bidder;
  saleAmount: number;
  emdDeducted: number;
  balanceDue: number;
  paymentDueDate: string;
  status: SaleStatus;
  saleCertificateId?: string;
  saleCertificateUrl?: string;
  deliveryOrderId?: string;
  deliveryOrderUrl?: string;
  confirmedAt?: string;
  confirmedBy?: string;
}

export type SaleStatus = 'Pending Payment' | 'Payment Received' | 'Certificate Issued' | 'Delivered' | 'Defaulted' | 'Re-auctioned';

export interface NoticeRules {
  id: string;
  category: SeizureCategory;
  minNoticeCount: number;
  minIntervalDays: number;
  maxIntervalDays: number;
  totalDurationDays: number;
  waitAfterThirdDays: number;
  acceptedModes: NoticeMode[];
  returnedHandling: ReturnedHandling;
  updatedBy: string;
  updatedAt: string;
}

export type ReturnedHandling = 'Additional Public Notice' | 'Escalate to SHO/Legal' | 'Block Eligibility';

export interface DashboardKPIs {
  totalSeized: number;
  pendingNotices: number;
  eligibleForAuction: number;
  auctioned: number;
  auctionedValue: number;
  pendingApprovals: number;
  noticeNonCompliance: number;
  highPriorityApprovals: number;
  approvedThisMonth: number;
  revenueThisMonth: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
}

export interface ResponseMeta {
  requestId: string;
  timestamp: string;
  version: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
  requestId?: string;
}

export type WebSocketMessageType =
  | 'auction:bid_placed'
  | 'auction:bid_update'
  | 'auction:timer_update'
  | 'auction:vehicle_change'
  | 'auction:pause'
  | 'auction:resume'
  | 'auction:extend'
  | 'auction:close'
  | 'auction:bidder_join'
  | 'auction:bidder_leave'
  | 'notification:new'
  | 'notification:read'
  | 'seizure:created'
  | 'seizure:updated'
  | 'seizure:approved'
  | 'seizure:rejected'
  | 'notice:recorded'
  | 'notice:delivered'
  | 'notice:returned'
  | 'valuation:completed'
  | 'lot:created'
  | 'lot:published'
  | 'kpi:update'
  | 'system:maintenance'
  | 'auth:session_expired'
  | 'auth:force_logout'
  | 'subscribe'
  | 'unsubscribe';

export interface RealtimeSubscription {
  channel: string;
  filters?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface FilterParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

export interface VehicleFilters extends FilterParams {
  category?: VehicleCategory;
  status?: SeizureStatus;
  stationId?: string;
  districtId?: string;
  dateFrom?: string;
  dateTo?: string;
  eligibility?: EligibilityStatus;
}

export type EligibilityStatus = 'Eligible' | 'Pending' | 'Blocked' | 'Under Review';

export interface AuctionFilters extends FilterParams {
  status?: LotStatus;
  districtId?: string;
  category?: LotCategory;
  dateFrom?: string;
  dateTo?: string;
}

export interface BidFilters extends FilterParams {
  lotId?: string;
  bidderId?: string;
  vehicleId?: string;
  isWinning?: boolean;
  dateFrom?: string;
  dateTo?: string;
}