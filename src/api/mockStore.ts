// SVAMS Mock Data Store
// In-memory store simulating a backend database.
// All methods return data directly (not wrapped in ApiResponse).

import type {
  User, Role, Vehicle, Seizure, Officer, PoliceStation, District,
  Owner, Notice, Valuation, Document, AuctionLot, AuctionLotVehicle,
  Bid, Bidder, AuctionSession, SaleConfirmation, NoticeRules,
  DashboardKPIs, PaginatedResponse, ApiError, AuditLog,
  SeizureCategory, SeizureStatus, DeliveryStatus, NoticeMode, LotStatus,
  KYCStatus, RCStatus, VehicleCategory, FuelType, LotCategory, EligibilityStatus,
  WebSocketMessageType,
} from './types';

// ============================================
// Constants
// ============================================
const DELAY = Number(import.meta.env.VITE_MOCK_DELAY_MS) || 300;
const STATION_ID = 'ts-ps-banjara';
const DISTRICT_ID = 'ts-hyderabad';
const USER_ID = 'ts-ps-0312';

const delay = (ms: number = DELAY) => new Promise(r => setTimeout(r, ms));
const generateId = (prefix: string = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function isSessionExpired(): boolean {
  if (typeof localStorage === 'undefined') return true;
  const exp = localStorage.getItem('svams_session_expires');
  if (!exp) return true;
  return Date.now() > Number(exp);
}

export function clearSession() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('svams_session');
  localStorage.removeItem('svams_access_token');
  localStorage.removeItem('svams_csrf');
  localStorage.removeItem('svams_session_expires');
}

// ============================================
// Mock Users
// ============================================
export const MOCK_USERS: Record<string, User> = {
  'ts-ps-0312': {
    id: 'u-1', userId: 'TS-PS-0312', name: 'SI T. Venkat Rao', role: 'PS',
    station: STATION_ID, district: DISTRICT_ID, email: 'venkat.rao@telangana.gov.in',
    phone: '+91 90000 00000', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: 'seizures', actions: ['create', 'read', 'update'] }, { resource: 'notices', actions: ['create', 'read', 'update'] }],
  },
  'ts-sho-0087': {
    id: 'u-2', userId: 'TS-SHO-0087', name: 'Inspector G. Srinivas', role: 'SHO',
    station: STATION_ID, district: DISTRICT_ID, email: 'g.srinivas@telangana.gov.in',
    phone: '+91 90000 00001', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: 'seizures', actions: ['read', 'approve', 'reject'] }, { resource: 'notices', actions: ['read'] }],
  },
  'ts-leg-0024': {
    id: 'u-3', userId: 'TS-LEG-0024', name: 'Legal Officer P. Rao', role: 'Legal',
    station: 'ts-legal-hq', district: DISTRICT_ID, email: 'p.rao@telangana.gov.in',
    phone: '+91 90000 00002', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: 'seizures', actions: ['read', 'update'] }, { resource: 'legal', actions: ['read', 'update'] }],
  },
  'ts-auc-0011': {
    id: 'u-4', userId: 'TS-AUC-0011', name: 'Auction Cell K. Sharma', role: 'AuctionCell',
    station: 'ts-auc-hq', district: DISTRICT_ID, email: 'k.sharma@telangana.gov.in',
    phone: '+91 90000 00003', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: 'lots', actions: ['create', 'read', 'update', 'delete'] }, { resource: 'auctions', actions: ['read', 'update'] }],
  },
  'ts-fin-0033': {
    id: 'u-5', userId: 'TS-FIN-0033', name: 'Finance D. Reddy', role: 'Finance',
    station: 'ts-fin-hq', district: DISTRICT_ID, email: 'd.reddy@telangana.gov.in',
    phone: '+91 90000 00004', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: 'payments', actions: ['read', 'update'] }],
  },
  'ts-adm-0001': {
    id: 'u-6', userId: 'TS-ADM-0001', name: 'Admin R. Sharma', role: 'Admin',
    station: 'ts-admin-hq', district: DISTRICT_ID, email: 'r.sharma@telangana.gov.in',
    phone: '+91 90000 00005', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: '*', actions: ['create', 'read', 'update', 'delete'] }],
  },
  'ts-bid-0247': {
    id: 'u-7', userId: 'TS-BID-0247', name: 'A.K. Traders', role: 'Bidder',
    station: undefined, district: DISTRICT_ID, email: 'contact@aktraders.com',
    phone: '+91 90000 00006', avatar: undefined, lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: [{ resource: 'bids', actions: ['create', 'read'] }],
  },
};

// ============================================
// Mock Stations & Districts
// ============================================
export const STATIONS: PoliceStation[] = [
  { id: STATION_ID, name: 'Banjara Hills PS', code: 'TS-PS-01', districtId: DISTRICT_ID,
    address: 'Road No. 12, Banjara Hills, Hyderabad', phone: '040-2330-1234', email: 'banjarahills.ps@telangana.gov.in', jurisdiction: 'Banjara Hills' },
  { id: 'ts-ps-begumpet', name: 'Begumpet PS', code: 'TS-PS-02', districtId: DISTRICT_ID,
    address: 'Begumpet Road, Begumpet, Hyderabad', phone: '040-2330-2345', email: 'begumpet.ps@telangana.gov.in', jurisdiction: 'Begumpet' },
  { id: 'ts-ps-secunderabad', name: 'Secunderabad PS', code: 'TS-PS-03', districtId: DISTRICT_ID,
    address: 'MG Road, Secunderabad', phone: '040-2330-3456', email: 'secunderabad.ps@telangana.gov.in', jurisdiction: 'Secunderabad' },
  { id: 'ts-ps-charminar', name: 'Charminar PS', code: 'TS-PS-04', districtId: DISTRICT_ID,
    address: 'Charminar, Hyderabad', phone: '040-2330-4567', email: 'charminar.ps@telangana.gov.in', jurisdiction: 'Charminar' },
  { id: 'ts-ps-kukatpally', name: 'Kukatpally PS', code: 'TS-PS-05', districtId: DISTRICT_ID,
    address: 'Kukatpally, Hyderabad', phone: '040-2330-5678', email: 'kukatpally.ps@telangana.gov.in', jurisdiction: 'Kukatpally' },
];

export const DISTRICTS: District[] = [
  { id: DISTRICT_ID, name: 'Hyderabad', code: 'TS-HYD', state: 'Telangana' },
  { id: 'ts-warangal', name: 'Warangal', code: 'TS-WAR', state: 'Telangana' },
  { id: 'ts-karimnagar', name: 'Karimnagar', code: 'TS-KAR', state: 'Telangana' },
  { id: 'ts-rangareddy', name: 'Rangareddy', code: 'TS-RAN', state: 'Telangana' },
];

// ============================================
// Mock Vehicles & Seizures
// ============================================
export const VEHICLES: Vehicle[] = [
  {
    id: 'v-1', registrationNo: 'TS09EA1234', chassisNo: 'MAKEA051SK2567890',
    engineNo: 'HA10EBK3456789', make: 'Honda', model: 'Activa 6G', year: 2022,
    category: '2-Wheeler', fuelType: 'Petrol', color: 'Pearl Igneous Black',
    odometer: 12450, registrationDate: '2022-06-15', insuranceExpiry: '2025-12-31',
    fitnessExpiry: '2026-03-08', hypothecation: null, rcStatus: 'Active',
  },
  {
    id: 'v-2', registrationNo: 'TS10UB5678', chassisNo: 'MARUTI2025SK5678901',
    engineNo: 'MB10EBK5678901', make: 'Maruti Suzuki', model: 'Swift', year: 2021,
    category: '4-Wheeler', fuelType: 'Petrol', color: 'Pearl Arctic White',
    odometer: 28500, registrationDate: '2021-09-20', insuranceExpiry: '2026-01-15',
    fitnessExpiry: '2027-09-20', hypothecation: 'HDFC Bank', rcStatus: 'Active',
  },
  {
    id: 'v-3', registrationNo: 'TS07CD9012', chassisNo: 'BAJAJ07CD9012345',
    engineNo: 'BJ10EBK9012345', make: 'Bajaj', model: 'Pulsar 150', year: 2020,
    category: '2-Wheeler', fuelType: 'Petrol', color: 'Blue',
    odometer: 35200, registrationDate: '2020-03-10', insuranceExpiry: '2025-08-30',
    fitnessExpiry: '2026-03-10', hypothecation: null, rcStatus: 'Active',
  },
  {
    id: 'v-4', registrationNo: 'TS05MK3456', chassisNo: 'TATA05MK3456789',
    engineNo: 'TT10EBK3456789', make: 'Tata', model: 'Ace Gold', year: 2019,
    category: 'Commercial', fuelType: 'Diesel', color: 'White',
    odometer: 52000, registrationDate: '2019-11-05', insuranceExpiry: '2025-06-20',
    fitnessExpiry: '2026-11-05', hypothecation: null, rcStatus: 'Active',
  },
  {
    id: 'v-5', registrationNo: 'TS11XY7890', chassisNo: 'RE11XY7890123',
    engineNo: 'RE10EBK7890123', make: 'Royal Enfield', model: 'Classic 350', year: 2018,
    category: '2-Wheeler', fuelType: 'Petrol', color: 'Black',
    odometer: 48000, registrationDate: '2018-12-01', insuranceExpiry: '2025-04-15',
    fitnessExpiry: '2025-12-01', hypothecation: null, rcStatus: 'Expired',
  },
  {
    id: 'v-6', registrationNo: 'TS03PQ2211', chassisNo: 'HYUNDAI03PQ2211',
    engineNo: 'HY10EBK2211000', make: 'Hyundai', model: 'i10 Nios', year: 2020,
    category: '4-Wheeler', fuelType: 'Petrol', color: 'Titan Grey',
    odometer: 22100, registrationDate: '2020-05-18', insuranceExpiry: '2026-02-28',
    fitnessExpiry: '2027-05-18', hypothecation: 'ICICI Bank', rcStatus: 'Active',
  },
  {
    id: 'v-7', registrationNo: 'TS12AB6655', chassisNo: 'MAHINDRA12AB6655',
    engineNo: 'MH10EBK6655000', make: 'Mahindra', model: 'Bolero', year: 2019,
    category: 'Commercial', fuelType: 'Diesel', color: 'Diamond White',
    odometer: 68000, registrationDate: '2019-07-12', insuranceExpiry: '2025-09-30',
    fitnessExpiry: '2026-07-12', hypothecation: null, rcStatus: 'Active',
  },
  {
    id: 'v-8', registrationNo: 'TS04WX1122', chassisNo: 'TATA04WX112200',
    engineNo: 'TAT10EBK1122000', make: 'Tata', model: 'Indica eV2', year: 2017,
    category: 'Commercial', fuelType: 'Diesel', color: 'White',
    odometer: 75000, registrationDate: '2017-08-05', insuranceExpiry: '2024-10-15',
    fitnessExpiry: '2025-08-05', hypothecation: null, rcStatus: 'Expired',
  },
  {
    id: 'v-9', registrationNo: 'TS06GH8877', chassisNo: 'YAMAHA06GH8877',
    engineNo: 'YM10EBK8877000', make: 'Yamaha', model: 'FZ-S', year: 2021,
    category: '2-Wheeler', fuelType: 'Petrol', color: 'Dark Matte Blue',
    odometer: 18400, registrationDate: '2021-01-22', insuranceExpiry: '2026-05-10',
    fitnessExpiry: '2027-01-22', hypothecation: null, rcStatus: 'Active',
  },
  {
    id: 'v-10', registrationNo: 'TS08LR4433', chassisNo: 'TVS08LR4433000',
    engineNo: 'TVS10EBK4433000', make: 'TVS', model: 'Jupiter', year: 2019,
    category: '2-Wheeler', fuelType: 'Petrol', color: 'Volcano Red',
    odometer: 31200, registrationDate: '2019-10-10', insuranceExpiry: '2025-07-20',
    fitnessExpiry: '2026-10-10', hypothecation: null, rcStatus: 'Active',
  },
];

const OFFICERS: Officer[] = [
  { id: 'off-1', name: 'SI T. Venkat Rao', rank: 'Sub-Inspector', badgeNo: 'TS-SI-0312',
    stationId: STATION_ID, phone: '+91 90000 00000', email: 'venkat.rao@telangana.gov.in' },
  { id: 'off-2', name: 'Inspector G. Srinivas', rank: 'Inspector (SHO)', badgeNo: 'TS-SHO-0087',
    stationId: STATION_ID, phone: '+91 90000 00001', email: 'g.srinivas@telangana.gov.in' },
];

const OWNERS: Record<string, Owner> = {
  'v-1': {
    id: 'o-1', name: 'Ramesh Kumar Reddy', mobile: '+91 90000 12345',
    address: '4-5-678, Dilsukhnagar, Hyderabad — 500060', rcVerified: true,
    verificationSource: 'VAHAN API + Physical RC', verificationRef: 'VAHAN-2025-11234',
    verificationDate: '2025-09-10',
  },
  'v-2': {
    id: 'o-2', name: 'Vijayalakshmi D.', mobile: '+91 90000 23456',
    address: '12-3-456, Begumpet, Hyderabad — 500016', rcVerified: true,
    verificationSource: 'VAHAN API + Physical RC', verificationRef: 'VAHAN-2025-11235',
    verificationDate: '2025-09-08',
  },
};

export const SEIZURES: Seizure[] = [
  {
    id: 's-1', vehicleId: 'v-1', vehicle: VEHICLES[0],
    memoNo: 'BH/PS/2025/0123', seizureDate: '2025-09-08', seizureTime: '10:30',
    place: 'Banjara Hills Road No.12, Near Jubilee Hills Check Post',
    firNo: '123/2025', firDate: '2025-09-08', category: 'Crime Vehicle' as SeizureCategory,
    custodyLocation: 'PS Yard — Banjara Hills', conditionNotes: 'Good — minor scratches on rear panel',
    keysAvailable: true, investigatingOfficer: OFFICERS[0], policeStation: STATIONS[0],
    district: DISTRICTS[0], status: 'Legal Review' as SeizureStatus, createdAt: '2025-09-08T10:30:00Z',
    updatedAt: '2025-09-12T11:00:00Z', createdBy: USER_ID,
  },
  {
    id: 's-2', vehicleId: 'v-2', vehicle: VEHICLES[1],
    memoNo: 'BH/PS/2025/0124', seizureDate: '2025-09-05', seizureTime: '14:15',
    place: 'Begumpet Road, Near Metro Station', firNo: '456/2025', firDate: '2025-09-05',
    category: 'Victim Vehicle' as SeizureCategory, custodyLocation: 'PS Yard — Begumpet',
    conditionNotes: 'Fair — dent on left door', keysAvailable: true,
    investigatingOfficer: OFFICERS[0], policeStation: STATIONS[1], district: DISTRICTS[0],
    status: 'SHO Approved' as SeizureStatus, createdAt: '2025-09-05T14:15:00Z', updatedAt: '2025-09-10T09:00:00Z', createdBy: USER_ID,
  },
  {
    id: 's-3', vehicleId: 'v-3', vehicle: VEHICLES[2],
    memoNo: 'BH/PS/2025/0125', seizureDate: '2025-09-01', seizureTime: '09:45',
    place: 'Kukatpally Housing Board', firNo: '789/2025', firDate: '2025-09-01',
    category: 'Crime Vehicle' as SeizureCategory, custodyLocation: 'PS Yard — Kukatpally',
    conditionNotes: 'Needs minor repairs', keysAvailable: false,
    investigatingOfficer: OFFICERS[0], policeStation: STATIONS[4], district: DISTRICTS[0],
    status: 'Submitted' as SeizureStatus, createdAt: '2025-09-01T09:45:00Z', updatedAt: '2025-09-03T15:30:00Z', createdBy: USER_ID,
  },
  {
    id: 's-4', vehicleId: 'v-4', vehicle: VEHICLES[3],
    memoNo: 'BH/PS/2025/0126', seizureDate: '2025-08-28', seizureTime: '16:20',
    place: 'Secunderabad Clock Tower', firNo: '012/2025', firDate: '2025-08-28',
    category: 'Crime Vehicle' as SeizureCategory, custodyLocation: 'Central Impound — GHMC',
    conditionNotes: 'Running condition', keysAvailable: true,
    investigatingOfficer: OFFICERS[0], policeStation: STATIONS[2], district: DISTRICTS[0],
    status: 'Auction Ready' as SeizureStatus, createdAt: '2025-08-28T16:20:00Z', updatedAt: '2025-09-05T10:00:00Z', createdBy: USER_ID,
  },
  {
    id: 's-5', vehicleId: 'v-5', vehicle: VEHICLES[4],
    memoNo: 'BH/PS/2025/0127', seizureDate: '2025-08-25', seizureTime: '11:00',
    place: 'Charminar', firNo: '345/2025', firDate: '2025-08-25',
    category: 'Crime Vehicle' as SeizureCategory, custodyLocation: 'PS Yard — Charminar',
    conditionNotes: 'Needs engine work', keysAvailable: true,
    investigatingOfficer: OFFICERS[0], policeStation: STATIONS[3], district: DISTRICTS[0],
    status: 'Court Stay' as SeizureStatus, createdAt: '2025-08-25T11:00:00Z', updatedAt: '2025-09-01T14:00:00Z', createdBy: USER_ID,
  },
];

// ============================================
// Mock Notices
// ============================================
export const NOTICES: Notice[] = [
  {
    id: 'n-1', seizureId: 's-1', noticeNumber: 1, noticeType: 1,
    sentDate: '2025-07-15', mode: 'Registered Post',
    address: '4-5-678, Dilsukhnagar, Hyderabad — 500060', trackingNumber: 'RP123456789IN',
    deliveryStatus: 'Delivered', acknowledgementDate: '2025-07-22',
    proofDocumentId: 'doc-1', proofDocumentUrl: '/uploads/n1_rp_receipt.pdf',
    remarks: 'Delivered and acknowledged by owner', createdAt: '2025-07-15T09:00:00Z', createdBy: USER_ID,
  },
  {
    id: 'n-2', seizureId: 's-1', noticeNumber: 2, noticeType: 2,
    sentDate: '2025-08-05', mode: 'Speed Post',
    address: '4-5-678, Dilsukhnagar, Hyderabad — 500060', trackingNumber: 'SP987654321IN',
    deliveryStatus: 'Delivered', acknowledgementDate: '2025-08-09',
    proofDocumentId: 'doc-2', proofDocumentUrl: '/uploads/n2_sp_receipt.pdf',
    remarks: 'Delivered successfully', createdAt: '2025-08-05T10:00:00Z', createdBy: USER_ID,
  },
  {
    id: 'n-3', seizureId: 's-1', noticeNumber: 3, noticeType: 3,
    sentDate: '2025-09-03', mode: 'Newspaper Publication',
    address: '4-5-678, Dilsukhnagar, Hyderabad — 500060', trackingNumber: 'NP-NEWS-003',
    deliveryStatus: 'Delivered', acknowledgementDate: '2025-09-07',
    proofDocumentId: 'doc-3', proofDocumentUrl: '/uploads/n3_newspaper.pdf',
    remarks: 'Published in Eenadu newspaper', createdAt: '2025-09-03T14:00:00Z', createdBy: USER_ID,
  },
  {
    id: 'n-4', seizureId: 's-2', noticeNumber: 1, noticeType: 1,
    sentDate: '2025-07-20', mode: 'Speed Post',
    address: '12-3-456, Begumpet, Hyderabad — 500016', trackingNumber: 'SP456789123IN',
    deliveryStatus: 'Delivered', acknowledgementDate: '2025-07-25',
    proofDocumentId: 'doc-4', proofDocumentUrl: '/uploads/n4_sp_receipt.pdf',
    remarks: 'Delivered', createdAt: '2025-07-20T11:00:00Z', createdBy: USER_ID,
  },
  {
    id: 'n-5', seizureId: 's-2', noticeNumber: 2, noticeType: 2,
    sentDate: '2025-08-10', mode: 'Email',
    address: 'vijayalakshmi@example.com', trackingNumber: 'EM-2025-08-10-002',
    deliveryStatus: 'Sent', proofDocumentId: 'doc-5', proofDocumentUrl: '/uploads/n5_email.pdf',
    remarks: 'Email sent, no ack received yet', createdAt: '2025-08-10T12:00:00Z', createdBy: USER_ID,
  },
];

// ============================================
// Mock Valuations
// ============================================
export const VALUATIONS: Valuation[] = [
  {
    id: 'val-1', seizureId: 's-1', estimatedValue: 125000,
    valuationOfficer: OFFICERS[0], valuationDate: '2025-09-10',
    reportDocumentId: 'val-doc-1', reportDocumentUrl: '/uploads/val-1.pdf',
    remarks: 'Market value assessed based on condition and year', status: 'Completed',
  },
  {
    id: 'val-2', seizureId: 's-2', estimatedValue: 350000,
    valuationOfficer: OFFICERS[0], valuationDate: '2025-09-05',
    reportDocumentId: 'val-doc-2', reportDocumentUrl: '/uploads/val-2.pdf',
    remarks: 'Commercial vehicle in fair condition', status: 'Completed',
  },
];

// ============================================
// Mock Documents
// ============================================
export const DOCUMENTS: Document[] = [
  { id: 'doc-1', seizureId: 's-1', name: 'Seizure Memo', type: 'Seizure Memo', category: 'Mandatory',
    fileName: 'seizure_memo_s1.pdf', fileUrl: '/uploads/seizure_memo_s1.pdf', fileSize: 245760,
    mimeType: 'application/pdf', uploadedBy: USER_ID, uploadedAt: '2025-09-08T11:00:00Z',
    isVerified: true, verifiedBy: 'ts-sho-0087', verifiedAt: '2025-09-10T09:00:00Z' },
  { id: 'doc-2', seizureId: 's-1', name: 'RC Copy', type: 'RC Copy', category: 'Mandatory',
    fileName: 'rc_copy_v1.pdf', fileUrl: '/uploads/rc_copy_v1.pdf', fileSize: 184320,
    mimeType: 'application/pdf', uploadedBy: USER_ID, uploadedAt: '2025-09-08T11:30:00Z',
    isVerified: true, verifiedBy: 'ts-sho-0087', verifiedAt: '2025-09-10T09:00:00Z' },
  { id: 'doc-3', seizureId: 's-1', name: 'Insurance Certificate', type: 'Insurance Certificate', category: 'Mandatory',
    fileName: 'insurance_v1.pdf', fileUrl: '/uploads/insurance_v1.pdf', fileSize: 153600,
    mimeType: 'application/pdf', uploadedBy: USER_ID, uploadedAt: '2025-09-09T10:00:00Z',
    isVerified: true },
  { id: 'doc-4', seizureId: 's-1', name: 'Vehicle Photos', type: 'Vehicle Photos', category: 'Mandatory',
    fileName: 'vehicle_photos_v1.zip', fileUrl: '/uploads/vehicle_photos_v1.zip', fileSize: 5242880,
    mimeType: 'application/zip', uploadedBy: USER_ID, uploadedAt: '2025-09-09T11:00:00Z',
    isVerified: true },
  { id: 'doc-5', seizureId: 's-1', name: 'FIR Copy', type: 'FIR Copy', category: 'Mandatory',
    fileName: 'fir_copy_s1.pdf', fileUrl: '/uploads/fir_copy_s1.pdf', fileSize: 92160,
    mimeType: 'application/pdf', uploadedBy: USER_ID, uploadedAt: '2025-09-09T14:00:00Z',
    isVerified: true },
  { id: 'doc-6', seizureId: 's-1', name: 'Valuation Report', type: 'Valuation Report', category: 'Supporting',
    fileName: 'valuation_report_v1.pdf', fileUrl: '/uploads/valuation_report_v1.pdf', fileSize: 307200,
    mimeType: 'application/pdf', uploadedBy: USER_ID, uploadedAt: '2025-09-10T15:00:00Z',
    isVerified: false },
];

// ============================================
// Mock Auction Lots & Bidders
// ============================================
export const BIDDERS: Bidder[] = [
  {
    id: 'b-1', bidderId: 'BID-0247', name: 'A.K. Traders', companyName: 'A.K. Traders Pvt Ltd',
    email: 'contact@aktraders.com', phone: '+91 90000 10001', pan: 'AKTPS1234A',
    address: 'Shop No. 5, Market Road, Hyderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-15',
    emdBalance: 10000, emdDeposited: 10000, isActive: true, registeredAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'b-2', bidderId: 'BID-0133', name: 'Reddy Auto Works', companyName: 'Reddy Auto Works',
    email: 'info@reddyauto.com', phone: '+91 90000 10002', pan: 'REDPS5678B',
    address: '12, Industrial Area, Hyderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-10',
    emdBalance: 15000, emdDeposited: 15000, isActive: true, registeredAt: '2025-07-20T00:00:00Z',
  },
  {
    id: 'b-3', bidderId: 'BID-0089', name: 'Sri Balaji Motors', companyName: 'Sri Balaji Motors',
    email: 'balaji@motors.com', phone: '+91 90000 10003', pan: 'SBMPS9012C',
    address: '8-9-10, Secunderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-05',
    emdBalance: 8000, emdDeposited: 8000, isActive: true, registeredAt: '2025-07-25T00:00:00Z',
  },
  {
    id: 'b-4', bidderId: 'BID-0312', name: 'Hyderabad Scrap Ltd.', companyName: 'Hyderabad Scrap Ltd.',
    email: 'scrap@hydscrap.com', phone: '+91 90000 10004', pan: 'HSLPS3456D',
    address: 'Industrial Estate, Hyderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-12',
    emdBalance: 12000, emdDeposited: 12000, isActive: true, registeredAt: '2025-08-01T00:00:00Z',
  },
];

export const LOTS: AuctionLot[] = [
  {
    id: 'lot-1', lotNumber: 'LOT-HYD-2025-0047', title: 'Hyderabad District Lot — September 2025',
    description: 'Seized vehicles from Hyderabad district — mixed category',
    category: 'Mixed', districtId: DISTRICT_ID, district: DISTRICTS[0],
    vehicles: [
      { id: 'lotv-1', lotId: 'lot-1', seizureId: 's-1', seizure: SEIZURES[0], reservePrice: 125000, sequence: 1 },
      { id: 'lotv-2', lotId: 'lot-1', seizureId: 's-4', seizure: SEIZURES[3], reservePrice: 350000, sequence: 2 },
      { id: 'lotv-3', lotId: 'lot-1', seizureId: 's-2', seizure: SEIZURES[1], reservePrice: 280000, sequence: 3 },
    ],
    totalReservePrice: 755000, bidIncrement: 5000, emdAmount: 10000,
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 + 7 * 3600000).toISOString(),
    autoExtendMinutes: 10,
    termsAndConditions: '1. All vehicles are sold on "as-is, where-is" basis.\n2. Bidders must deposit EMD before participating.\n3. The highest bidder (H1) must pay the full amount within 7 days.\n4. Failure to pay will result in EMD forfeiture and re-auction.\n5. Sale Certificate will be issued post full payment.\n6. Vehicles can be inspected on 18-Sep-2025 at PS yard.\n7. Telangana Police decision on eligibility is final.',
    status: 'Published', createdBy: 'ts-auc-0011',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const BIDS: Bid[] = [
  {
    id: 'bid-1', lotId: 'lot-1', vehicleId: 's-1', bidderId: 'b-1', bidder: BIDDERS[0],
    amount: 185000, timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    isWinning: true, isAutoBid: false,
  },
  {
    id: 'bid-2', lotId: 'lot-1', vehicleId: 's-1', bidderId: 'b-2', bidder: BIDDERS[1],
    amount: 180000, timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    isWinning: false, isAutoBid: false,
  },
];

// ============================================
// Mock Notice Rules
// ============================================
export const RULES: NoticeRules[] = [
  {
    id: 'rules-crime', category: 'Crime Vehicle', minNoticeCount: 3, minIntervalDays: 15,
    maxIntervalDays: 45, totalDurationDays: 90, waitAfterThirdDays: 30,
    acceptedModes: ['Registered Post', 'Speed Post', 'Newspaper Publication'],
    returnedHandling: 'Additional Public Notice', updatedBy: 'ts-adm-0001',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rules-victim', category: 'Victim Vehicle', minNoticeCount: 2, minIntervalDays: 10,
    maxIntervalDays: 30, totalDurationDays: 60, waitAfterThirdDays: 15,
    acceptedModes: ['Registered Post', 'Speed Post', 'Email', 'SMS'],
    returnedHandling: 'Escalate to SHO/Legal', updatedBy: 'ts-adm-0001',
    updatedAt: new Date().toISOString(),
  },
];

// ============================================
// Mock Audit Logs
// ============================================
export const AUDIT_LOGS: AuditLog[] = [
  { id: 'audit-1', timestamp: '2025-09-08 10:32', userId: 'u-1', userName: 'SI T. Venkat Rao', userRole: 'PS',
    action: 'Vehicle seizure entry created', resourceType: 'Seizure', resourceId: 's-1',
    details: { memoNo: 'BH/PS/2025/0123', firNo: '123/2025' }, ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 Chrome', severity: 'info' },
  { id: 'audit-2', timestamp: '2025-09-10 14:15', userId: 'u-2', userName: 'Inspector G. Srinivas', userRole: 'SHO',
    action: 'SHO approved seizure entry', resourceType: 'Seizure', resourceId: 's-2',
    details: { approval: 'granted' }, ipAddress: '192.168.1.12', userAgent: 'Mozilla/5.0 Chrome',
    severity: 'info' },
];

// ============================================
// Mock Store Class - returns data directly, not ApiResponse
// ============================================
export class MockStore {
  async getUser(userId: string): Promise<User | null> {
    await delay();
    return MOCK_USERS[userId] || null;
  }
  // Demo passwords for each role
  private static readonly DEMO_PASSWORDS: Record<string, string> = {
    'TS-PS-0312': 'police123',
    'TS-SHO-0087': 'sho123',
    'TS-LEG-0024': 'legal123',
    'TS-AUC-0011': 'auction123',
    'TS-FIN-0033': 'finance123',
    'TS-ADM-0001': 'admin123',
    'TS-BID-0247': 'bidder123',
  };

  async authenticate(userId: string, password: string): Promise<User> {
    await delay();
    // Normalize userId to uppercase for case-insensitive matching
    const normalizedUserId = userId?.toUpperCase().trim();
    const user = MOCK_USERS[normalizedUserId];
    if (!user) {
      console.warn('Login failed - user not found:', normalizedUserId, 'Available:', Object.keys(MOCK_USERS));
      throw new Error('Invalid User ID');
    }
    // Verify password
    const expectedPassword = MockStore.DEMO_PASSWORDS[normalizedUserId];
    if (password !== expectedPassword) {
      console.warn('Login failed - invalid password for:', normalizedUserId);
      throw new Error('Invalid password');
    }
    return { ...user, lastLogin: new Date().toISOString() };
  }

  async getStations(): Promise<PoliceStation[]> {
    await delay(); return [...STATIONS];
  }
  async getDistricts(): Promise<District[]> {
    await delay(); return [...DISTRICTS];
  }

  async getVehicles(filters?: any): Promise<PaginatedResponse<Vehicle>> {
    await delay();
    let result = [...VEHICLES];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(v => v.registrationNo.toLowerCase().includes(q) || v.make.toLowerCase().includes(q));
    }
    return { data: result, total: result.length, page: filters?.page || 1, pageSize: filters?.pageSize || 50, totalPages: 1 };
  }
  async getVehicle(id: string): Promise<Vehicle | null> {
    await delay(); return VEHICLES.find(v => v.id === id) || null;
  }
  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    await delay();
    const v: Vehicle = {
      id: generateId('v'), registrationNo: data.registrationNo || '', chassisNo: data.chassisNo || '',
      engineNo: data.engineNo || '', make: data.make || '', model: data.model || '', year: data.year || 2025,
      category: data.category as VehicleCategory, fuelType: data.fuelType as FuelType, color: data.color || '',
      odometer: data.odometer || 0, registrationDate: data.registrationDate || new Date().toISOString(),
      insuranceExpiry: data.insuranceExpiry || '', fitnessExpiry: data.fitnessExpiry || '',
      hypothecation: data.hypothecation || null, rcStatus: data.rcStatus as RCStatus,
    };
    VEHICLES.push(v);
    return v;
  }
  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    await delay();
    const idx = VEHICLES.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('Vehicle not found');
    VEHICLES[idx] = { ...VEHICLES[idx], ...data };
    return VEHICLES[idx];
  }

  async getSeizures(filters?: any): Promise<PaginatedResponse<Seizure>> {
    await delay();
    let result = [...SEIZURES];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => s.vehicle.registrationNo.toLowerCase().includes(q) || s.firNo.toLowerCase().includes(q));
    }
    return { data: result, total: result.length, page: filters?.page || 1, pageSize: filters?.pageSize || 50, totalPages: 1 };
  }
  async getSeizure(id: string): Promise<Seizure | null> {
    await delay(); return SEIZURES.find(s => s.id === id) || null;
  }
  async createSeizure(data: Partial<Seizure>): Promise<Seizure> {
    await delay();
    const vehicle = VEHICLES.find(v => v.id === data.vehicleId) || VEHICLES[0];
    const officer = OFFICERS[0];
    const station = STATIONS.find(s => s.id === data.policeStation?.id) || STATIONS[0];
    const district = DISTRICTS[0];
    const s: Seizure = {
      id: generateId('s'), vehicleId: data.vehicleId || vehicle.id, vehicle,
      memoNo: data.memoNo || generateId('memo'), seizureDate: data.seizureDate || new Date().toISOString(),
      seizureTime: data.seizureTime || new Date().toTimeString().slice(0, 5),
      place: data.place || '', firNo: data.firNo || '', firDate: data.firDate || new Date().toISOString(),
      category: data.category as SeizureCategory, custodyLocation: data.custodyLocation || '',
      conditionNotes: data.conditionNotes || '', keysAvailable: data.keysAvailable ?? true,
      investigatingOfficer: officer, policeStation: station, district,
      status: 'Submitted' as SeizureStatus, createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), createdBy: USER_ID,
    };
    SEIZURES.push(s);
    return s;
  }
  async updateSeizure(id: string, data: Partial<Seizure>): Promise<Seizure> {
    await delay();
    const idx = SEIZURES.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Seizure not found');
    SEIZURES[idx] = { ...SEIZURES[idx], ...data, updatedAt: new Date().toISOString() };
    return SEIZURES[idx];
  }
  async approveSeizure(id: string): Promise<Seizure> {
    await delay();
    const idx = SEIZURES.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Seizure not found');
    SEIZURES[idx] = { ...SEIZURES[idx], status: 'SHO Approved', updatedAt: new Date().toISOString() };
    return SEIZURES[idx];
  }
  async rejectSeizure(id: string): Promise<Seizure> {
    await delay();
    const idx = SEIZURES.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Seizure not found');
    SEIZURES[idx] = { ...SEIZURES[idx], status: 'Draft', updatedAt: new Date().toISOString() };
    return SEIZURES[idx];
  }

  async getNotices(seizureId?: string): Promise<Notice[]> {
    await delay();
    return seizureId ? NOTICES.filter(n => n.seizureId === seizureId) : [...NOTICES];
  }
  async createNotice(data: Partial<Notice>): Promise<Notice> {
    await delay();
    const n: Notice = {
      id: generateId('n'), seizureId: data.seizureId || '', noticeNumber: data.noticeNumber || 1,
      noticeType: data.noticeType as 1 | 2 | 3, sentDate: data.sentDate || new Date().toISOString(),
      mode: data.mode as NoticeMode, address: data.address || '', trackingNumber: data.trackingNumber || '',
      deliveryStatus: data.deliveryStatus as DeliveryStatus, acknowledgementDate: data.acknowledgementDate,
      proofDocumentId: data.proofDocumentId, proofDocumentUrl: data.proofDocumentUrl,
      remarks: data.remarks || '', createdAt: new Date().toISOString(), createdBy: USER_ID,
    };
    NOTICES.push(n);
    return n;
  }
  async updateNotice(id: string, data: Partial<Notice>): Promise<Notice> {
    await delay();
    const idx = NOTICES.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Notice not found');
    NOTICES[idx] = { ...NOTICES[idx], ...data };
    return NOTICES[idx];
  }

  async getValuations(seizureId: string): Promise<Valuation[]> {
    await delay(); return VALUATIONS.filter(v => v.seizureId === seizureId);
  }
  async createValuation(data: Partial<Valuation>): Promise<Valuation> {
    await delay();
    const v: Valuation = {
      id: generateId('val'), seizureId: data.seizureId || '', estimatedValue: data.estimatedValue || 0,
      valuationOfficer: OFFICERS[0], valuationDate: data.valuationDate || new Date().toISOString(),
      reportDocumentId: data.reportDocumentId, reportDocumentUrl: data.reportDocumentUrl,
      remarks: data.remarks || '', status: 'Completed' as const,
    };
    VALUATIONS.push(v);
    return v;
  }

  async getDocuments(seizureId: string): Promise<Document[]> {
    await delay(); return DOCUMENTS.filter(d => d.seizureId === seizureId);
  }

  async getLots(filters?: any): Promise<PaginatedResponse<AuctionLot>> {
    await delay();
    let result = [...LOTS];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l => l.lotNumber.toLowerCase().includes(q) || l.title.toLowerCase().includes(q));
    }
    return { data: result, total: result.length, page: filters?.page || 1, pageSize: filters?.pageSize || 50, totalPages: 1 };
  }
  async getLot(id: string): Promise<AuctionLot | null> {
    await delay(); return LOTS.find(l => l.id === id) || null;
  }
  async createLot(data: Partial<AuctionLot>): Promise<AuctionLot> {
    await delay();
    const lot: AuctionLot = {
      id: generateId('lot'), lotNumber: data.lotNumber || generateId('lot'), title: data.title || '',
      description: data.description || '', category: data.category as LotCategory,
      districtId: data.districtId || DISTRICT_ID, district: DISTRICTS[0],
      vehicles: (data.vehicles || []).map((v, i) => ({
        id: generateId('lotv'), lotId: 'temp', seizureId: v.seizureId, seizure: SEIZURES[0],
        reservePrice: v.reservePrice, sequence: i + 1,
      })) as unknown as AuctionLotVehicle[],
      totalReservePrice: data.totalReservePrice || 0,
      bidIncrement: data.bidIncrement || 5000, emdAmount: data.emdAmount || 10000,
      startDate: data.startDate || new Date().toISOString(), endDate: data.endDate || new Date().toISOString(),
      autoExtendMinutes: data.autoExtendMinutes || 10, termsAndConditions: data.termsAndConditions || '',
      status: 'Draft' as LotStatus, createdBy: USER_ID, createdAt: new Date().toISOString(),
    };
    LOTS.push(lot);
    return lot;
  }
  async publishLot(id: string): Promise<AuctionLot> {
    await delay();
    const idx = LOTS.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Lot not found');
    LOTS[idx] = { ...LOTS[idx], status: 'Published', publishedAt: new Date().toISOString() };
    return LOTS[idx];
  }

  async getBids(lotId: string): Promise<Bid[]> {
    await delay(); return BIDS.filter(b => b.lotId === lotId).sort((a, b) => b.amount - a.amount);
  }
  async placeBid(data: { lotId: string; vehicleId: string; bidderId: string; amount: number; isAutoBid?: boolean }): Promise<Bid> {
    await delay();
    const bidder = BIDDERS.find(b => b.id === data.bidderId) || BIDDERS[0];
    const bid: Bid = {
      id: generateId('bid'), lotId: data.lotId, vehicleId: data.vehicleId, bidderId: data.bidderId,
      bidder, amount: data.amount, timestamp: new Date().toISOString(),
      isWinning: true, isAutoBid: data.isAutoBid ?? false,
    };
    BIDS.push(bid);
    return bid;
  }

  async getBidders(): Promise<Bidder[]> {
    await delay(); return [...BIDDERS];
  }
  async getBidder(id: string): Promise<Bidder | null> {
    await delay(); return BIDDERS.find(b => b.id === id) || null;
  }

  async getRules(): Promise<NoticeRules[]> {
    await delay(); return [...RULES];
  }
  async updateRule(category: SeizureCategory, data: Partial<NoticeRules>): Promise<NoticeRules> {
    await delay();
    const idx = RULES.findIndex(r => r.category === category);
    if (idx === -1) throw new Error('Rule not found');
    RULES[idx] = { ...RULES[idx], ...data, updatedAt: new Date().toISOString() };
    return RULES[idx];
  }

  async getKPIs(role: Role): Promise<DashboardKPIs> {
    await delay();
    return {
      totalSeized: SEIZURES.length,
      pendingNotices: 34,
      eligibleForAuction: 58,
      auctioned: 29,
      auctionedValue: 3850000,
      pendingApprovals: 12,
      noticeNonCompliance: 5,
      highPriorityApprovals: 3,
      approvedThisMonth: 34,
      revenueThisMonth: 2850000,
    };
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(); return [...AUDIT_LOGS];
  }

  async vahanLookup(regNo: string): Promise<any> {
    await delay(600);
    const v = VEHICLES.find(ve => ve.registrationNo === regNo);
    return {
      registrationNo: regNo, ownerName: 'Ramesh Kumar Reddy', makerModel: 'Honda Activa 6G',
      yearOfManufacture: '2022', fuel: 'Petrol', rcStatus: 'Active',
      insuranceValidity: '31-Dec-2025', fitnessValidity: '08-Mar-2026',
      hypothecation: 'None', address: '4-5-678, Dilsukhnagar, Hyderabad',
    };
  }
  async cctnsCheck(firNo: string): Promise<any> {
    await delay(600);
    return { firNo, caseStatus: 'Under Investigation', courtStay: false, stolen: false };
  }
}

export const mockStore = new MockStore();