/**
 * SVAMS — Notification Service
 * Cross-role real-time alerts routed via WebSocket + in-memory store.
 */

import type { Notification, RoleCode } from "./types"
import { apiService } from "./service"

export class NotificationService {
  async notifySeizureCreated(
    seizureId: string,
    regNo: string,
    recipientRole: RoleCode,
  ): Promise<void> {
    await apiService.createNotification({
      recipientRole,
      type: "seizure:created",
      title: "New Seizure Recorded",
      message: `Vehicle ${regNo} (seizure ${seizureId}) has been recorded and awaits your review.`,
      data: { seizureId, regNo },
    })
  }

  async notifySeizureApproved(
    seizureId: string,
    regNo: string,
    recipientRole: RoleCode,
  ): Promise<void> {
    await apiService.createNotification({
      recipientRole,
      type: "seizure:approved",
      title: "Seizure Approved",
      message: `Seizure ${seizureId} (vehicle ${regNo}) has been approved.`,
      data: { seizureId, regNo },
    })
  }

  async notifyBidPlaced(
    lotId: string,
    lotNumber: string,
    amount: number,
    bidderId: string,
    recipientRole: RoleCode,
  ): Promise<void> {
    await apiService.createNotification({
      recipientRole,
      type: "auction:bid_placed",
      title: "New Bid Placed",
      message: `A new bid of ₹${amount.toLocaleString()} was placed on lot ${lotNumber}.`,
      data: { lotId, lotNumber, amount, bidderId },
    })
  }

  async notifyNoticeReturned(
    seizureId: string,
    regNo: string,
    recipientRole: RoleCode,
  ): Promise<void> {
    await apiService.createNotification({
      recipientRole,
      type: "notice:returned",
      title: "Notice Returned",
      message: `A notice for vehicle ${regNo} (seizure ${seizureId}) was returned undelivered.`,
      data: { seizureId, regNo },
    })
  }

  async notifyLotPublished(
    lotNumber: string,
    title: string,
    recipientRole: RoleCode,
  ): Promise<void> {
    await apiService.createNotification({
      recipientRole,
      type: "auction:lot_published",
      title: "New Auction Lot Published",
      message: `Lot ${lotNumber} — "${title}" is now live for bidding.`,
      data: { lotNumber, title },
    })
  }

  async getNotifications(recipientRole?: RoleCode): Promise<Notification[]> {
    return apiService.getNotifications(recipientRole)
  }

  async markRead(id: string): Promise<void> {
    await apiService.markNotificationRead(id)
  }
}

export const notificationService = new NotificationService()
