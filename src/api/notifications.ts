// SVAMS Notification Service
// Real-time notification system for cross-role alerts (new seizures, approval requests, bid alerts, etc.)

import type { User, Role } from './types';

export interface Notification {
  id: string;
  type: 'seizure_created' | 'seizure_approved' | 'seizure_rejected' | 'notice_recorded' | 'notice_returned' | 'valuation_completed' | 'lot_published' | 'auction_live' | 'bid_placed' | 'auction_closed' | 'payment_received' | 'system_alert';
  title: string;
  message: string;
  role: Role | 'all';
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  link?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface NotificationServiceProps {
  onNotification?: (notification: Notification) => void;
}

export class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private onNotification?: (notification: Notification) => void;

  constructor({ onNotification }: NotificationServiceProps = {}) {
    this.onNotification = onNotification;
  }

  // ---------- Subscribe ----------
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.notifications);
    return () => this.listeners.delete(callback);
  }

  // ---------- Get ----------
  getAll(role?: Role): Notification[] {
    return this.notifications.filter(n => n.role === role || n.role === 'all');
  }
  getUnread(role?: Role): Notification[] {
    return this.getAll(role).filter(n => !n.read);
  }
  getUnreadCount(role?: Role): number {
    return this.getUnread(role).length;
  }

  // ---------- Add ----------
  add(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
    const n: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(n);
    // Keep only last 500
    if (this.notifications.length > 500) this.notifications = this.notifications.slice(0, 500);
    this.notifyListeners();
    this.onNotification?.(n);
    return n;
  }

  // ---------- Mark read ----------
  markRead(id: string): void {
    const n = this.notifications.find(x => x.id === id);
    if (n) n.read = true;
    this.notifyListeners();
  }
  markAllRead(role?: Role): void {
    this.notifications.forEach(n => {
      if ((!role || n.role === role || n.role === 'all') && !n.read) n.read = true;
    });
    this.notifyListeners();
  }

  // ---------- Remove ----------
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }
  clear(role?: Role): void {
    this.notifications = this.notifications.filter(n => n.role !== role && n.role !== 'all');
    this.notifyListeners();
  }

  // ---------- Convenience creators ----------
  notifySeizureCreated(seizureId: string, regNo: string, targetRole: Role = 'SHO') {
    return this.add({
      type: 'seizure_created',
      title: 'New Seizure Entry',
      message: `Vehicle ${regNo} has been submitted for your approval`,
      role: targetRole,
      data: { seizureId, regNo },
      link: `/sho-approval-queue`,
      priority: 'normal',
    });
  }
  notifySeizureApproved(seizureId: string, regNo: string, targetRole: Role = 'PS') {
    return this.add({
      type: 'seizure_approved',
      title: 'Seizure Approved',
      message: `Vehicle ${regNo} has been approved and is ready for legal review`,
      role: targetRole,
      data: { seizureId, regNo },
      link: `/ps-vehicle-detail?id=${seizureId}`,
      priority: 'normal',
    });
  }
  notifySeizureRejected(seizureId: string, regNo: string, targetRole: Role = 'PS') {
    return this.add({
      type: 'seizure_rejected',
      title: 'Seizure Returned',
      message: `Vehicle ${regNo} has been returned for corrections`,
      role: targetRole,
      data: { seizureId, regNo },
      link: `/ps-vehicle-detail?id=${seizureId}`,
      priority: 'high',
    });
  }
  notifyLotPublished(lotNumber: string, title: string, targetRole: Role = 'Bidder') {
    return this.add({
      type: 'lot_published',
      title: 'New Auction Lot Published',
      message: `${lotNumber}: ${title} is now available for bidding`,
      role: targetRole,
      data: { lotNumber, title },
      link: '/bid-browse',
      priority: 'normal',
    });
  }
  notifyBidPlaced(lotId: string, lotNumber: string, amount: number, bidderId: string, targetRole: Role = 'Bidder') {
    return this.add({
      type: 'bid_placed',
      title: 'New Bid Placed',
      message: `A new bid of ₹${amount.toLocaleString('en-IN')} placed on ${lotNumber}`,
      role: targetRole,
      data: { lotId, lotNumber, amount, bidderId },
      link: `/bid-bidding?lot=${lotId}`,
      priority: 'high',
    });
  }
  notifyAuctionLive(lotNumber: string, targetRole: Role = 'Bidder') {
    return this.add({
      type: 'auction_live',
      title: 'Auction Live',
      message: `${lotNumber} is now live for bidding`,
      role: targetRole,
      data: { lotNumber },
      link: `/bid-bidding?lot=${lotNumber}`,
      priority: 'urgent',
    });
  }
  notifyNoticeReturned(regNo: string, noticeNumber: number, targetRole: Role = 'PS') {
    return this.add({
      type: 'notice_returned',
      title: 'Notice Returned Undelivered',
      message: `Notice ${noticeNumber} for vehicle ${regNo} was returned undelivered`,
      role: targetRole,
      data: { regNo, noticeNumber },
      link: `/ps-notice-tracking`,
      priority: 'high',
    });
  }
  notifySystemAlert(message: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') {
    return this.add({
      type: 'system_alert',
      title: 'System Alert',
      message,
      role: 'all',
      priority,
    });
  }

  private notifyListeners(): void {
    const snapshot = [...this.notifications];
    this.listeners.forEach(cb => {
      try { cb(snapshot); } catch (err) { console.error('Notification listener error:', err); }
    });
  }
}

// Singleton
export const notificationService = new NotificationService();