// SVAMS API Service Layer
// Wraps MockStore with error handling. In production, replace with real fetch calls.

import { mockStore, isSessionExpired, clearSession, MOCK_USERS } from './mockStore';
import type {
  ApiResponse, User, LoginCredentials, LoginResponse, Vehicle, Seizure, Notice,
  Valuation, Document, AuctionLot, Bid, Bidder, NoticeRules, DashboardKPIs,
  AuditLog, PaginatedResponse, VehicleFilters, AuctionFilters, BidFilters,
  Role,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';
const MOCK_DELAY = Number(import.meta.env.VITE_MOCK_DELAY_MS) || 300;
const SESSION_TIMEOUT = Number(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000;

const SESSION_KEY = 'svams_session';
const ACCESS_TOKEN_KEY = 'svams_access_token';
const CSRF_KEY = 'svams_csrf';

export interface ServiceConfig {
  baseUrl: string;
  useMock: boolean;
  mockDelay: number;
  sessionTimeout: number;
}

export const serviceConfig: ServiceConfig = {
  baseUrl: API_BASE,
  useMock: USE_MOCK,
  mockDelay: MOCK_DELAY,
  sessionTimeout: SESSION_TIMEOUT,
};

function sessionToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
}
function csrfToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(CSRF_KEY);
}
export function setSession(token: string, csrf: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(CSRF_KEY, csrf);
  localStorage.setItem('svams_session_expires', String(Date.now() + SESSION_TIMEOUT));
}

// Re-export for AuthContext
export { isSessionExpired, clearSession };

// ============================================
// API Service class
// ============================================
export class ApiService {
  private store = mockStore;

  // ---------- Auth ----------
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (isSessionExpired()) clearSession();

    const user = await this.store.authenticate(credentials.userId, credentials.password);
    
    // Verify the selected role matches the user's actual role
    if (user.role !== credentials.role) {
      throw new Error(`Role mismatch: Selected "${credentials.role}" but user is "${user.role}"`);
    }
    
    const sessionToken = `svams_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const csrf = `csrf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    setSession(sessionToken, csrf);
    // Store userId for session restoration
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('svams_user_id', credentials.userId);
    }

    return {
      user,
      sessionId: sessionToken,
      csrfToken: csrf,
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
    };
  }

  async logout(): Promise<void> {
    clearSession();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('svams_user_id');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!sessionToken()) return null;
    if (isSessionExpired()) {
      clearSession();
      return null;
    }
    // Get stored userId from localStorage
    const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('svams_user_id') : null;
    if (!userId) return null;
    return this.store.getUser(userId);
  }

  async refreshSession(): Promise<boolean> {
    if (!sessionToken()) return false;
    if (isSessionExpired()) {
      clearSession();
      return false;
    }
    localStorage.setItem('svams_session_expires', String(Date.now() + SESSION_TIMEOUT));
    return true;
  }

  getSessionToken(): string | null { return sessionToken(); }
  getCsrfToken(): string | null { return csrfToken(); }
  isAuthenticated(): boolean { return !!sessionToken() && !isSessionExpired(); }

  // ---------- Vehicles ----------
  async getVehicles(filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
    return this.store.getVehicles(filters);
  }
  async getVehicle(id: string): Promise<Vehicle> {
    const v = await this.store.getVehicle(id);
    if (!v) throw new Error('Vehicle not found');
    return v;
  }
  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    return this.store.createVehicle(data);
  }
  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    return this.store.updateVehicle(id, data);
  }

  // ---------- Seizures ----------
  async getSeizures(filters?: any): Promise<PaginatedResponse<Seizure>> {
    return this.store.getSeizures(filters);
  }
  async getSeizure(id: string): Promise<Seizure> {
    const s = await this.store.getSeizure(id);
    if (!s) throw new Error('Seizure not found');
    return s;
  }
  async createSeizure(data: Partial<Seizure>): Promise<Seizure> {
    return this.store.createSeizure(data);
  }
  async updateSeizure(id: string, data: Partial<Seizure>): Promise<Seizure> {
    return this.store.updateSeizure(id, data);
  }
  async approveSeizure(id: string): Promise<Seizure> {
    return this.store.approveSeizure(id);
  }
  async rejectSeizure(id: string): Promise<Seizure> {
    return this.store.rejectSeizure(id);
  }

  // ---------- Notices ----------
  async getNotices(seizureId?: string): Promise<Notice[]> {
    return this.store.getNotices(seizureId);
  }
  async createNotice(data: Partial<Notice>): Promise<Notice> {
    return this.store.createNotice(data);
  }
  async updateNotice(id: string, data: Partial<Notice>): Promise<Notice> {
    return this.store.updateNotice(id, data);
  }

  // ---------- Valuations ----------
  async getValuations(seizureId: string): Promise<Valuation[]> {
    return this.store.getValuations(seizureId);
  }
  async createValuation(data: Partial<Valuation>): Promise<Valuation> {
    return this.store.createValuation(data);
  }

  // ---------- Documents ----------
  async getDocuments(seizureId: string): Promise<Document[]> {
    return this.store.getDocuments(seizureId);
  }

  // ---------- Auction Lots ----------
  async getLots(filters?: AuctionFilters): Promise<PaginatedResponse<AuctionLot>> {
    return this.store.getLots(filters);
  }
  async getLot(id: string): Promise<AuctionLot> {
    const lot = await this.store.getLot(id);
    if (!lot) throw new Error('Lot not found');
    return lot;
  }
  async createLot(data: Partial<AuctionLot>): Promise<AuctionLot> {
    return this.store.createLot(data);
  }
  async publishLot(id: string): Promise<AuctionLot> {
    return this.store.publishLot(id);
  }

  // ---------- Bids ----------
  async getBids(lotId: string): Promise<Bid[]> {
    return this.store.getBids(lotId);
  }
  async placeBid(data: { lotId: string; vehicleId: string; bidderId: string; amount: number; isAutoBid?: boolean }): Promise<Bid> {
    return this.store.placeBid(data);
  }

  // ---------- Bidders ----------
  async getBidders(): Promise<Bidder[]> {
    return this.store.getBidders();
  }
  async getBidder(id: string): Promise<Bidder> {
    const b = await this.store.getBidder(id);
    if (!b) throw new Error('Bidder not found');
    return b;
  }

  // ---------- Notice Rules ----------
  async getRules(): Promise<NoticeRules[]> {
    return this.store.getRules();
  }
  async updateRule(category: string, data: Partial<NoticeRules>): Promise<NoticeRules> {
    return this.store.updateRule(category as any, data);
  }

  // ---------- Dashboard ----------
  async getKPIs(role: Role): Promise<DashboardKPIs> {
    return this.store.getKPIs(role);
  }

  // ---------- Audit ----------
  async getAuditLogs(): Promise<AuditLog[]> {
    return this.store.getAuditLogs();
  }

  // ---------- External Integrations ----------
  async vahanLookup(regNo: string): Promise<any> {
    return this.store.vahanLookup(regNo);
  }
  async cctnsCheck(firNo: string): Promise<any> {
    return this.store.cctnsCheck(firNo);
  }
}

export const apiService = new ApiService();
export { mockStore };