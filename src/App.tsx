import React, { useState, useEffect } from 'react';
import { NavContext, Screen, Role } from './nav';
import AppShell from './components/AppShell';
import LoginScreen from './screens/LoginScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { apiService } from './api/service';
import { notificationService } from './api/notifications';

// Screens
import PSDashboard from './screens/PSDashboard';
import PSVehicleList from './screens/PSVehicleList';
import PSNewSeizure from './screens/PSNewSeizure';
import PSVehicleDetail from './screens/PSVehicleDetail';
import PSNoticeTracking from './screens/PSNoticeTracking';
import SHOApprovalQueue from './screens/SHOApprovalQueue';
import SHOReviewVehicle from './screens/SHOReviewVehicle';
import AUCEligibleVehicles from './screens/AUCEligibleVehicles';
import AUCCreateLot from './screens/AUCCreateLot';
import AUCLiveAuction from './screens/AUCLiveAuction';
import ADMNoticeRules from './screens/ADMNoticeRules';
import BIDBiddingScreen from './screens/BIDBiddingScreen';
import {
  SHODashboard, LegalDashboard, AUCDashboard, AUCSaleConfirmation,
  FINDashboard, ADMDashboard, ADMUsers, BIDDashboard, BIDBrowse, BIDLotDetail
} from './screens/PlaceholderScreens';

const screenMap: Record<Screen, React.ComponentType> = {
  login: LoginScreen,
  'ps-dashboard': PSDashboard,
  'ps-vehicle-list': PSVehicleList,
  'ps-new-seizure': PSNewSeizure,
  'ps-vehicle-detail': PSVehicleDetail,
  'ps-notice-tracking': PSNoticeTracking,
  'sho-dashboard': SHODashboard,
  'sho-approval-queue': SHOApprovalQueue,
  'sho-review-vehicle': SHOReviewVehicle,
  'legal-dashboard': LegalDashboard,
  'auc-dashboard': AUCDashboard,
  'auc-eligible': AUCEligibleVehicles,
  'auc-create-lot': AUCCreateLot,
  'auc-live-auction': AUCLiveAuction,
  'auc-sale-confirmation': AUCSaleConfirmation,
  'fin-dashboard': FINDashboard,
  'adm-dashboard': ADMDashboard,
  'adm-notice-rules': ADMNoticeRules,
  'adm-users': ADMUsers,
  'bid-dashboard': BIDDashboard,
  'bid-browse': BIDBrowse,
  'bid-lot-detail': BIDLotDetail,
  'bid-bidding': BIDBiddingScreen,
};

const screensWithoutShell: Screen[] = ['login'];

function AuthApp() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');
  const [role, setRole] = useState<Role>('PS');

  // Initialize: if authenticated, go to role dashboard
  useEffect(() => {
    if (isAuthenticated && user && screen === 'login') {
      setScreen(user.role === 'Bidder' ? 'bid-browse' : (roleDashboards[user.role] as Screen));
      setRole(user.role);
    }
  }, [isAuthenticated, user, screen]);

  const navigate = (s: Screen) => setScreen(s);
  const handleSetRole = (r: Role) => setRole(r);

  const ScreenComponent = screenMap[screen] || LoginScreen;
  const isShellless = screensWithoutShell.includes(screen);

  // Require auth for non-login screens
  if (!isShellless && !isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <NavContext.Provider value={{ screen, role, navigate, setRole: handleSetRole }}>
      {isShellless ? (
        <ScreenComponent />
      ) : (
        <AppShell>
          <ScreenComponent />
        </AppShell>
      )}
    </NavContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  );
}

const roleDashboards: Record<Role, Screen> = {
  PS: 'ps-dashboard',
  SHO: 'sho-approval-queue',
  Legal: 'legal-dashboard',
  AuctionCell: 'auc-eligible',
  Finance: 'fin-dashboard',
  Admin: 'adm-notice-rules',
  Bidder: 'bid-browse',
};