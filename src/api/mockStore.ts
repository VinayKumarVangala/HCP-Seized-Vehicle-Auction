/**
 * SVAMS — In-Memory Mock Store
 * Full CRUD simulation. Replace with real backend later (R-019 Mock-First).
 */

import type {
  User,
  AuthSession,
  Vehicle,
  Seizure,
  Notice,
  AuctionLot,
  Bid,
  NoticeRule,
  AuditLog,
  Notification,
  PaginatedResponse,
  PaginationParams,
  VehicleFilters,
  RoleCode,
} from "./types"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_DELAY = Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 300)

// -----------------------------------------------------------------------
// Seed Data
// -----------------------------------------------------------------------

const users: User[] = [
  {
    id: "u1",
    employeeId: "TS-PS-0312",
    name: "Ravi Kumar",
    role: "PS",
    policeStation: "Hyderabad Central",
    email: "ravi.kumar@telangana.gov.in",
    phone: "+91 90000 00312",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u2",
    employeeId: "TS-SHO-0087",
    name: "Suresh Reddy",
    role: "SHO",
    policeStation: "Hyderabad Central",
    email: "suresh.reddy@telangana.gov.in",
    phone: "+91 90000 00087",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u3",
    employeeId: "TS-LEG-0024",
    name: "Anita Rao",
    role: "Legal",
    policeStation: "Hyderabad Central",
    email: "anita.rao@telangana.gov.in",
    phone: "+91 90000 00024",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u4",
    employeeId: "TS-AUC-0011",
    name: "Karthik Naidu",
    role: "AuctionCell",
    policeStation: "Hyderabad Central",
    email: "karthik.naidu@telangana.gov.in",
    phone: "+91 90000 00011",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u5",
    employeeId: "TS-FIN-0033",
    name: "Lakshmi Devi",
    role: "Finance",
    policeStation: "Hyderabad Central",
    email: "lakshmi.devi@telangana.gov.in",
    phone: "+91 90000 00033",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u6",
    employeeId: "TS-ADM-0001",
    name: "Srinivas IPS",
    role: "Admin",
    policeStation: "Hyderabad Central",
    email: "srinivas@telangana.gov.in",
    phone: "+91 90000 00001",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "u7",
    employeeId: "TS-BID-0247",
    name: "Mohammed Ismail",
    role: "Bidder",
    email: "ismail@example.com",
    phone: "+91 90000 00247",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
]

const vehicles: Vehicle[] = [
  {
    id: "v1",
    registrationNumber: "TS09AB1234",
    chassisNumber: "MH123456789012",
    engineNumber: "EN123456789",
    vehicleType: "4W",
    make: "Maruti Suzuki",
    model: "Swift Dzire",
    year: 2019,
    color: "White",
    fuelType: "Petrol",
    ownerName: "Ramesh Gupta",
    ownerAddress: "Banjarahills, Hyderabad",
    rcNumber: "RC091234",
    rcExpiry: "2028-05-15",
    insuranceNumber: "INS098765",
    insuranceExpiry: "2027-03-10",
    currentValue: 450000,
    images: [],
    vahanVerified: true,
    cctnsVerified: true,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "v2",
    registrationNumber: "TS09CD5678",
    chassisNumber: "MH234567890123",
    engineNumber: "EN234567890",
    vehicleType: "2W",
    make: "Hero",
    model: "Splendor Plus",
    year: 2020,
    color: "Black",
    fuelType: "Petrol",
    ownerName: "Suresh Yadav",
    ownerAddress: "Secunderabad",
    rcNumber: "RC095678",
    rcExpiry: "2029-08-20",
    insuranceNumber: "INS087654",
    insuranceExpiry: "2027-11-05",
    currentValue: 45000,
    images: [],
    vahanVerified: true,
    cctnsVerified: true,
    createdAt: "2026-01-16T00:00:00Z",
    updatedAt: "2026-01-16T00:00:00Z",
  },
  {
    id: "v3",
    registrationNumber: "TS09EF9012",
    chassisNumber: "MH345678901234",
    engineNumber: "EN345678901",
    vehicleType: "Commercial",
    make: "Tata",
    model: "Ace",
    year: 2018,
    color: "Blue",
    fuelType: "Diesel",
    ownerName: "Logistics Pvt Ltd",
    ownerAddress: "Gachibowli, Hyderabad",
    rcNumber: "RC099012",
    rcExpiry: "2027-12-10",
    insuranceNumber: "INS076543",
    insuranceExpiry: "2026-09-15",
    currentValue: 320000,
    images: [],
    vahanVerified: true,
    cctnsVerified: true,
    createdAt: "2026-01-17T00:00:00Z",
    updatedAt: "2026-01-17T00:00:00Z",
  },
  {
    id: "v4",
    registrationNumber: "TS09GH3456",
    chassisNumber: "MH456789012345",
    engineNumber: "EN456789012",
    vehicleType: "4W",
    make: "Hyundai",
    model: "i20",
    year: 2021,
    color: "Red",
    fuelType: "Petrol",
    ownerName: "Priya Sharma",
    ownerAddress: "Madhapur, Hyderabad",
    rcNumber: "RC093456",
    rcExpiry: "2030-01-25",
    insuranceNumber: "INS065432",
    insuranceExpiry: "2028-06-30",
    currentValue: 680000,
    images: [],
    vahanVerified: true,
    cctnsVerified: true,
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "v5",
    registrationNumber: "TS09IJ7890",
    chassisNumber: "MH567890123456",
    engineNumber: "EN567890123",
    vehicleType: "2W",
    make: "Honda",
    model: "Activa 6G",
    year: 2019,
    color: "Grey",
    fuelType: "Petrol",
    ownerName: "Vikram Singh",
    ownerAddress: "Kukatpally, Hyderabad",
    rcNumber: "RC097890",
    rcExpiry: "2028-04-12",
    insuranceNumber: "INS054321",
    insuranceExpiry: "2027-02-20",
    currentValue: 52000,
    images: [],
    vahanVerified: true,
    cctnsVerified: true,
    createdAt: "2026-01-19T00:00:00Z",
    updatedAt: "2026-01-19T00:00:00Z",
  },
]

const seizures: Seizure[] = [
  {
    id: "s1",
    seizureNumber: "SEZ-2026-0001",
    vehicleId: "v1",
    policeStation: "Hyderabad Central",
    seizedBy: "TS-PS-0312",
    seizedByName: "Ravi Kumar",
    seizureDate: "2026-02-01T00:00:00Z",
    seizureLocation: "Banjarahills, Hyderabad",
    seizureReason: "Involved in theft case",
    firNumber: "FIR-2026-0101",
    firDate: "2026-01-31T00:00:00Z",
    courtCaseNumber: "CC-2026-001",
    courtStay: false,
    status: "legally_cleared",
    documents: [],
    notices: [],
    complianceNoticeCount: 3,
    eligibleForAuction: true,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "s2",
    seizureNumber: "SEZ-2026-0002",
    vehicleId: "v2",
    policeStation: "Hyderabad Central",
    seizedBy: "TS-PS-0312",
    seizedByName: "Ravi Kumar",
    seizureDate: "2026-02-03T00:00:00Z",
    seizureLocation: "Secunderabad",
    seizureReason: "Stolen vehicle recovery",
    firNumber: "FIR-2026-0102",
    firDate: "2026-02-02T00:00:00Z",
    courtStay: false,
    status: "pending_approval",
    documents: [],
    notices: [],
    complianceNoticeCount: 1,
    eligibleForAuction: false,
    createdAt: "2026-02-03T00:00:00Z",
    updatedAt: "2026-02-03T00:00:00Z",
  },
]

const notices: Notice[] = [
  {
    id: "n1",
    seizureId: "s1",
    noticeType: "registered_post",
    noticeNumber: "NP-2026-0001",
    issueDate: "2026-02-05T00:00:00Z",
    dueDate: "2026-02-12T00:00:00Z",
    status: "delivered",
    deliveryDate: "2026-02-08T00:00:00Z",
    attempts: 1,
    createdAt: "2026-02-05T00:00:00Z",
    updatedAt: "2026-02-08T00:00:00Z",
  },
  {
    id: "n2",
    seizureId: "s1",
    noticeType: "speed_post",
    noticeNumber: "SP-2026-0001",
    issueDate: "2026-02-13T00:00:00Z",
    dueDate: "2026-02-20T00:00:00Z",
    status: "delivered",
    deliveryDate: "2026-02-16T00:00:00Z",
    attempts: 1,
    createdAt: "2026-02-13T00:00:00Z",
    updatedAt: "2026-02-16T00:00:00Z",
  },
  {
    id: "n3",
    seizureId: "s1",
    noticeType: "newspaper",
    noticeNumber: "NW-2026-0001",
    issueDate: "2026-02-21T00:00:00Z",
    dueDate: "2026-02-28T00:00:00Z",
    status: "delivered",
    deliveryDate: "2026-02-25T00:00:00Z",
    attempts: 1,
    createdAt: "2026-02-21T00:00:00Z",
    updatedAt: "2026-02-25T00:00:00Z",
  },
]

const lots: AuctionLot[] = [
  {
    id: "lot1",
    lotNumber: "LOT-2026-001",
    title: "Seized Vehicles Auction Lot 1",
    description: "Mixed lot of seized vehicles including 4W and 2W.",
    status: "live",
    reservePrice: 400000,
    startingBid: 350000,
    bidIncrement: 5000,
    minBid: 355000,
    currentBid: 380000,
    currentBidderId: "u7",
    currentBidderName: "Mohammed Ismail",
    vehicleIds: ["v1", "v3"],
    vehicles: [],
    startDate: "2026-03-01T10:00:00Z",
    endDate: "2026-03-01T12:00:00Z",
    autoExtendMinutes: 10,
    autoExtendWindowMinutes: 10,
    terms: "As-is where-is basis. EMD required.",
    location: "Hyderabad Auction Yard",
    createdBy: "TS-AUC-0011",
    createdAt: "2026-02-20T00:00:00Z",
    updatedAt: "2026-03-01T10:30:00Z",
  },
]

const bids: Bid[] = [
  {
    id: "b1",
    lotId: "lot1",
    bidderId: "u7",
    bidderName: "Mohammed Ismail",
    amount: 380000,
    status: "winning",
    isAutoBid: false,
    placedAt: "2026-03-01T10:30:00Z",
  },
]

const noticeRules: NoticeRule[] = [
  {
    id: "nr1",
    vehicleType: "4W",
    crimeType: "Theft",
    noticesRequired: 3,
    intervals: [7, 7],
    deliveryMethods: ["registered_post", "speed_post", "newspaper"],
    escalationDays: 14,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
]

const auditLogs: AuditLog[] = []
const notifications: Notification[] = []

// -----------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------

export class MockStore {
  async login(creds: {
    employeeId: string
    role: RoleCode
  }): Promise<AuthSession> {
    await delay(MOCK_DELAY)
    const user = users.find(
      (u) => u.employeeId === creds.employeeId && u.role === creds.role,
    )
    if (!user) throw new Error("Invalid credentials")
    const session: AuthSession = {
      token: `svams_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      csrfToken: Math.random().toString(36).slice(2),
      user,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    }
    return session
  }

  async getUser(id: string): Promise<User | undefined> {
    await delay(MOCK_DELAY)
    return users.find((u) => u.id === id)
  }

  async getUsers(): Promise<User[]> {
    await delay(MOCK_DELAY)
    return [...users]
  }

  // Vehicles
  async getVehicles(
    params?: VehicleFilters,
  ): Promise<PaginatedResponse<Vehicle>> {
    await delay(MOCK_DELAY)
    let result = [...vehicles]
    if (params?.search) {
      const q = params.search.toLowerCase()
      result = result.filter(
        (v) =>
          v.registrationNumber.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.ownerName.toLowerCase().includes(q),
      )
    }
    if (params?.vehicleType) {
      result = result.filter((v) => v.vehicleType === params.vehicleType)
    }
    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const start = (page - 1) * limit
    const paginated = result.slice(start, start + limit)
    return {
      data: paginated,
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
    }
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    await delay(MOCK_DELAY)
    return vehicles.find((v) => v.id === id)
  }

  // Seizures
  async getSeizures(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Seizure>> {
    await delay(MOCK_DELAY)
    let result = [...seizures]
    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const start = (page - 1) * limit
    const paginated = result.slice(start, start + limit)
    return {
      data: paginated,
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
    }
  }

  async getSeizure(id: string): Promise<Seizure | undefined> {
    await delay(MOCK_DELAY)
    return seizures.find((s) => s.id === id)
  }

  async createSeizure(data: Partial<Seizure>): Promise<Seizure> {
    await delay(MOCK_DELAY)
    const seizure: Seizure = {
      id: `s${seizures.length + 1}`,
      seizureNumber: `SEZ-2026-${String(seizures.length + 1).padStart(4, "0")}`,
      status: "draft",
      documents: [],
      notices: [],
      complianceNoticeCount: 0,
      eligibleForAuction: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    } as Seizure
    seizures.push(seizure)
    return seizure
  }

  async updateSeizure(id: string, data: Partial<Seizure>): Promise<Seizure> {
    await delay(MOCK_DELAY)
    const idx = seizures.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error("Seizure not found")
    seizures[idx] = {
      ...seizures[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return seizures[idx]
  }

  // Notices
  async getNotices(seizureId: string): Promise<Notice[]> {
    await delay(MOCK_DELAY)
    return notices.filter((n) => n.seizureId === seizureId)
  }

  async createNotice(data: Partial<Notice>): Promise<Notice> {
    await delay(MOCK_DELAY)
    const notice: Notice = {
      id: `n${notices.length + 1}`,
      noticeType: "registered_post",
      status: "pending",
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    } as Notice
    notices.push(notice)
    return notice
  }

  async updateNotice(id: string, data: Partial<Notice>): Promise<Notice> {
    await delay(MOCK_DELAY)
    const idx = notices.findIndex((n) => n.id === id)
    if (idx === -1) throw new Error("Notice not found")
    notices[idx] = {
      ...notices[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return notices[idx]
  }

  // Lots
  async getLots(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<AuctionLot>> {
    await delay(MOCK_DELAY)
    let result = [...lots]
    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const start = (page - 1) * limit
    const paginated = result.slice(start, start + limit)
    return {
      data: paginated,
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit),
    }
  }

  async getLot(id: string): Promise<AuctionLot | undefined> {
    await delay(MOCK_DELAY)
    return lots.find((l) => l.id === id)
  }

  async createLot(data: Partial<AuctionLot>): Promise<AuctionLot> {
    await delay(MOCK_DELAY)
    const lot: AuctionLot = {
      id: `lot${lots.length + 1}`,
      lotNumber: `LOT-2026-${String(lots.length + 1).padStart(3, "0")}`,
      status: "draft",
      currentBid: 0,
      minBid: 0,
      vehicleIds: [],
      vehicles: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    } as AuctionLot
    lots.push(lot)
    return lot
  }

  async updateLot(id: string, data: Partial<AuctionLot>): Promise<AuctionLot> {
    await delay(MOCK_DELAY)
    const idx = lots.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error("Lot not found")
    lots[idx] = { ...lots[idx], ...data, updatedAt: new Date().toISOString() }
    return lots[idx]
  }

  // Bids
  async getBids(lotId: string): Promise<Bid[]> {
    await delay(MOCK_DELAY)
    return bids.filter((b) => b.lotId === lotId)
  }

  async placeBid(data: Partial<Bid>): Promise<Bid> {
    await delay(MOCK_DELAY)
    const bid: Bid = {
      id: `b${bids.length + 1}`,
      status: "active",
      isAutoBid: false,
      placedAt: new Date().toISOString(),
      ...data,
    } as Bid
    bids.push(bid)
    const lot = lots.find((l) => l.id === bid.lotId)
    if (lot) {
      lot.currentBid = bid.amount
      lot.currentBidderId = bid.bidderId
      lot.currentBidderName = bid.bidderName
      lot.updatedAt = new Date().toISOString()
    }
    return bid
  }

  // Notice Rules
  async getNoticeRules(): Promise<NoticeRule[]> {
    await delay(MOCK_DELAY)
    return [...noticeRules]
  }

  async updateNoticeRule(
    id: string,
    data: Partial<NoticeRule>,
  ): Promise<NoticeRule> {
    await delay(MOCK_DELAY)
    const idx = noticeRules.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Notice rule not found")
    noticeRules[idx] = {
      ...noticeRules[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return noticeRules[idx]
  }

  // Audit Logs
  async getAuditLogs(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<AuditLog>> {
    await delay(MOCK_DELAY)
    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const start = (page - 1) * limit
    const paginated = auditLogs.slice(start, start + limit)
    return {
      data: paginated,
      total: auditLogs.length,
      page,
      limit,
      totalPages: Math.ceil(auditLogs.length / limit),
    }
  }

  async addAuditLog(data: Partial<AuditLog>): Promise<AuditLog> {
    await delay(MOCK_DELAY)
    const log: AuditLog = {
      id: `al${auditLogs.length + 1}`,
      createdAt: new Date().toISOString(),
      severity: "info",
      ...data,
    } as AuditLog
    auditLogs.push(log)
    return log
  }

  // Notifications
  async getNotifications(recipientRole?: RoleCode): Promise<Notification[]> {
    await delay(MOCK_DELAY)
    if (recipientRole)
      return notifications.filter((n) => n.recipientRole === recipientRole)
    return [...notifications]
  }

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    await delay(MOCK_DELAY)
    const notif: Notification = {
      id: `nt${notifications.length + 1}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...data,
    } as Notification
    notifications.push(notif)
    return notif
  }

  async markNotificationRead(id: string): Promise<void> {
    await delay(MOCK_DELAY)
    const n = notifications.find((x) => x.id === id)
    if (n) n.read = true
  }
}

export const mockStore = new MockStore()
