import { createContext, useContext } from 'react';

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

export interface NavState {
  screen: Screen;
  role: Role;
  navigate: (screen: Screen) => void;
  setRole: (role: Role) => void;
}

export const NavContext = createContext<NavState | null>(null);
export const useNav = () => useContext(NavContext)!;

export const roleMenus: Record<Role, { icon: string; label: string; screen: Screen }[]> = {
  PS: [
    { icon: '⊞', label: 'Dashboard', screen: 'ps-dashboard' },
    { icon: '🚗', label: 'My Vehicles', screen: 'ps-vehicle-list' },
    { icon: '＋', label: 'New Seizure', screen: 'ps-new-seizure' },
    { icon: '📋', label: 'Notice Tracking', screen: 'ps-notice-tracking' },
  ],
  SHO: [
    { icon: '⊞', label: 'Dashboard', screen: 'sho-dashboard' },
    { icon: '✅', label: 'Approval Queue', screen: 'sho-approval-queue' },
  ],
  Legal: [
    { icon: '⊞', label: 'Dashboard', screen: 'legal-dashboard' },
  ],
  AuctionCell: [
    { icon: '⊞', label: 'Dashboard', screen: 'auc-dashboard' },
    { icon: '✔', label: 'Eligible Vehicles', screen: 'auc-eligible' },
    { icon: '📦', label: 'Create Lot', screen: 'auc-create-lot' },
    { icon: '🔴', label: 'Live Auction', screen: 'auc-live-auction' },
  ],
  Finance: [
    { icon: '⊞', label: 'Dashboard', screen: 'fin-dashboard' },
  ],
  Admin: [
    { icon: '⊞', label: 'Dashboard', screen: 'adm-dashboard' },
    { icon: '👥', label: 'Users', screen: 'adm-users' },
    { icon: '📏', label: 'Notice Rules', screen: 'adm-notice-rules' },
  ],
  Bidder: [
    { icon: '⊞', label: 'Dashboard', screen: 'bid-dashboard' },
    { icon: '🔍', label: 'Browse Auctions', screen: 'bid-browse' },
    { icon: '🏆', label: 'My Bids', screen: 'bid-lot-detail' },
  ],
};

export const roleLabels: Record<Role, string> = {
  PS: 'Police Station',
  SHO: 'SHO',
  Legal: 'Legal Officer',
  AuctionCell: 'Auction Cell',
  Finance: 'Finance',
  Admin: 'Administrator',
  Bidder: 'Registered Bidder',
};

export const roleDashboards: Record<Role, Screen> = {
  PS: 'ps-dashboard',
  SHO: 'sho-approval-queue',
  Legal: 'legal-dashboard',
  AuctionCell: 'auc-eligible',
  Finance: 'fin-dashboard',
  Admin: 'adm-notice-rules',
  Bidder: 'bid-browse',
};

export const roleOptions: { value: Role; label: string }[] = [
  { value: 'PS', label: 'Police Station Officer' },
  { value: 'SHO', label: 'Station House Officer (SHO)' },
  { value: 'Legal', label: 'Legal Officer' },
  { value: 'AuctionCell', label: 'Auction Cell' },
  { value: 'Finance', label: 'Finance Officer' },
  { value: 'Admin', label: 'System Administrator' },
  { value: 'Bidder', label: 'Registered Bidder' },
];