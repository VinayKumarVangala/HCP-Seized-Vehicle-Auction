/**
 * SVAMS — API Service Layer
 * Swappable mock/real implementation (R-019, R-020).
 * All component API calls go through this service; no direct fetch in components.
 */

import type {
  AuthSession,
  LoginCredentials,
  Vehicle,
  VehicleFilters,
  Seizure,
  SeizureCreateInput,
  SeizureUpdateInput,
  Notice,
  NoticeCreateInput,
  AuctionLot,
  AuctionLotCreateInput,
  Bid,
  BidCreateInput,
  NoticeRule,
  AuditLog,
  Notification,
  PaginatedResponse,
  PaginationParams,
  RoleCode,
} from "./types"
import { mockStore } from "./mockStore"

const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== "false"
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api"

type ServiceMethods = {
  login: (creds: LoginCredentials) => Promise<AuthSession>
  getUser: (id: string) => Promise<import("./types").User | undefined>
  getUsers: () => Promise<import("./types").User[]>
  getVehicles: (params?: VehicleFilters) => Promise<PaginatedResponse<Vehicle>>
  getVehicle: (id: string) => Promise<Vehicle | undefined>
  getSeizures: (
    params?: PaginationParams,
  ) => Promise<PaginatedResponse<Seizure>>
  getSeizure: (id: string) => Promise<Seizure | undefined>
  createSeizure: (data: SeizureCreateInput) => Promise<Seizure>
  updateSeizure: (id: string, data: SeizureUpdateInput) => Promise<Seizure>
  getNotices: (seizureId: string) => Promise<Notice[]>
  createNotice: (data: NoticeCreateInput) => Promise<Notice>
  updateNotice: (id: string, data: Partial<Notice>) => Promise<Notice>
  getLots: (params?: PaginationParams) => Promise<PaginatedResponse<AuctionLot>>
  getLot: (id: string) => Promise<AuctionLot | undefined>
  createLot: (data: AuctionLotCreateInput) => Promise<AuctionLot>
  updateLot: (id: string, data: Partial<AuctionLot>) => Promise<AuctionLot>
  getBids: (lotId: string) => Promise<Bid[]>
  placeBid: (data: BidCreateInput) => Promise<Bid>
  getNoticeRules: () => Promise<NoticeRule[]>
  updateNoticeRule: (
    id: string,
    data: Partial<NoticeRule>,
  ) => Promise<NoticeRule>
  getAuditLogs: (
    params?: PaginationParams,
  ) => Promise<PaginatedResponse<AuditLog>>
  addAuditLog: (data: Partial<AuditLog>) => Promise<AuditLog>
  getNotifications: (recipientRole?: RoleCode) => Promise<Notification[]>
  createNotification: (data: Partial<Notification>) => Promise<Notification>
  markNotificationRead: (id: string) => Promise<void>
}

export class ApiService implements ServiceMethods {
  private useMock: boolean

  constructor(useMock = USE_MOCK) {
    this.useMock = useMock
  }

  async login(creds: LoginCredentials): Promise<AuthSession> {
    if (this.useMock)
      return mockStore.login({ employeeId: creds.employeeId, role: creds.role })
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    })
    if (!res.ok) throw new Error("Login failed")
    return res.json()
  }

  async getUser(id: string) {
    if (this.useMock) return mockStore.getUser(id)
    const res = await fetch(`${API_BASE}/users/${id}`)
    return res.json()
  }

  async getUsers() {
    if (this.useMock) return mockStore.getUsers()
    const res = await fetch(`${API_BASE}/users`)
    return res.json()
  }

  async getVehicles(params?: VehicleFilters) {
    if (this.useMock) return mockStore.getVehicles(params)
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/vehicles?${qs}`)
    return res.json()
  }

  async getVehicle(id: string) {
    if (this.useMock) return mockStore.getVehicle(id)
    const res = await fetch(`${API_BASE}/vehicles/${id}`)
    return res.json()
  }

  async getSeizures(params?: PaginationParams) {
    if (this.useMock) return mockStore.getSeizures(params)
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/seizures?${qs}`)
    return res.json()
  }

  async getSeizure(id: string) {
    if (this.useMock) return mockStore.getSeizure(id)
    const res = await fetch(`${API_BASE}/seizures/${id}`)
    return res.json()
  }

  async createSeizure(data: SeizureCreateInput) {
    if (this.useMock) return mockStore.createSeizure(data as Partial<Seizure>)
    const res = await fetch(`${API_BASE}/seizures`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async updateSeizure(id: string, data: SeizureUpdateInput) {
    if (this.useMock) return mockStore.updateSeizure(id, data)
    const res = await fetch(`${API_BASE}/seizures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getNotices(seizureId: string) {
    if (this.useMock) return mockStore.getNotices(seizureId)
    const res = await fetch(`${API_BASE}/seizures/${seizureId}/notices`)
    return res.json()
  }

  async createNotice(data: NoticeCreateInput) {
    if (this.useMock) return mockStore.createNotice(data)
    const res = await fetch(`${API_BASE}/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async updateNotice(id: string, data: Partial<Notice>) {
    if (this.useMock) return mockStore.updateNotice(id, data)
    const res = await fetch(`${API_BASE}/notices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getLots(params?: PaginationParams) {
    if (this.useMock) return mockStore.getLots(params)
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/lots?${qs}`)
    return res.json()
  }

  async getLot(id: string) {
    if (this.useMock) return mockStore.getLot(id)
    const res = await fetch(`${API_BASE}/lots/${id}`)
    return res.json()
  }

  async createLot(data: AuctionLotCreateInput) {
    if (this.useMock) return mockStore.createLot(data)
    const res = await fetch(`${API_BASE}/lots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async updateLot(id: string, data: Partial<AuctionLot>) {
    if (this.useMock) return mockStore.updateLot(id, data)
    const res = await fetch(`${API_BASE}/lots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getBids(lotId: string) {
    if (this.useMock) return mockStore.getBids(lotId)
    const res = await fetch(`${API_BASE}/lots/${lotId}/bids`)
    return res.json()
  }

  async placeBid(data: BidCreateInput) {
    if (this.useMock) return mockStore.placeBid(data)
    const res = await fetch(`${API_BASE}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getNoticeRules() {
    if (this.useMock) return mockStore.getNoticeRules()
    const res = await fetch(`${API_BASE}/notice-rules`)
    return res.json()
  }

  async updateNoticeRule(id: string, data: Partial<NoticeRule>) {
    if (this.useMock) return mockStore.updateNoticeRule(id, data)
    const res = await fetch(`${API_BASE}/notice-rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getAuditLogs(params?: PaginationParams) {
    if (this.useMock) return mockStore.getAuditLogs(params)
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/audit-logs?${qs}`)
    return res.json()
  }

  async addAuditLog(data: Partial<AuditLog>) {
    if (this.useMock) return mockStore.addAuditLog(data)
    const res = await fetch(`${API_BASE}/audit-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getNotifications(recipientRole?: RoleCode) {
    if (this.useMock) return mockStore.getNotifications(recipientRole)
    const qs = recipientRole ? `?role=${recipientRole}` : ""
    const res = await fetch(`${API_BASE}/notifications${qs}`)
    return res.json()
  }

  async createNotification(data: Partial<Notification>) {
    if (this.useMock) return mockStore.createNotification(data)
    const res = await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async markNotificationRead(id: string) {
    if (this.useMock) return mockStore.markNotificationRead(id)
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: "POST" })
  }
}

export const apiService = new ApiService()
