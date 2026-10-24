import React, { useState, useEffect } from 'react';
import { useNav, Role, Screen, roleMenus, roleLabels } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../api/notifications';
import type { Notification } from '../api/notifications';

// Logo paths (served from public/)
const HYD_POLICE_LOGO = '/assets/logos/hyd-city-police.png';
const TS_LOGO = '/assets/logos/ts-logo.jpeg';
const FAVICON = '/assets/logos/hyd-city-police.png';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { role, screen, navigate } = useNav();
  const { user, logout, isAuthenticated, csrfToken } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menu = roleMenus[role] || [];

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsub = notificationService.subscribe((notifs) => {
      const roleNotifs = notifs.filter(n => n.role === user?.role || n.role === 'all');
      setNotifications(roleNotifs);
      setUnreadCount(roleNotifs.filter(n => !n.read).length);
    });
    return () => unsub();
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate('login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-[#0B3D2E] text-white transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Logo - Hyderabad City Police (Top left) */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0 relative">
          <img
            src={HYD_POLICE_LOGO}
            alt="Hyderabad City Police"
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight truncate">SVAMS</p>
              <p className="text-[10px] text-white/50 truncate">Telangana Police</p>
            </div>
          )}
          {/* TS Logo - Top right (small, in header area instead) */}
          {!collapsed && (
            <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-white/60 hover:text-white transition-colors cursor-pointer shrink-0">
              {collapsed ? '›' : '‹'}
            </button>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center text-[#0B3D2E] font-bold text-xs mx-auto">TP</div>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && user && (
          <div className="px-4 py-2 border-b border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{roleLabels[role]}</span>
            <p className="text-[10px] text-white/30 mt-0.5 truncate">{user?.name}</p>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {menu.map(item => (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                screen === item.screen
                  ? 'bg-white/10 text-white border-r-2 border-[#D4A017]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer with logout */}
        <div className="border-t border-white/10 p-4 mt-auto">
          {!collapsed && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-white/30 text-center">SVAMS v1.0 · 2025</p>
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg border border-white/20 text-white/70 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
          {collapsed && (
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors cursor-pointer mx-auto"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-[#0B3D2E] flex items-center px-6 gap-4 shrink-0 shadow-md z-10 relative">
          {/* TS Logo - Top right of every page */}
          <div className="absolute top-2 right-6">
            <img
              src={TS_LOGO}
              alt="Telangana State Logo"
              className="w-10 h-10 object-cover rounded-md border border-white/20 shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              placeholder="Global search..."
              className="w-full pl-8 pr-3 h-8 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/10 text-sm focus:outline-none focus:border-white/30 focus:bg-white/15"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language toggle */}
            <button className="text-white/70 hover:text-white text-sm font-medium cursor-pointer">EN / తె</button>

            {/* Notifications with real-time badge */}
            <button className="relative text-white/70 hover:text-white cursor-pointer group" onClick={() => setUnreadCount(0)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4A017] text-[9px] text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User profile with dropdown indicator */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center text-[#0B3D2E] text-xs font-bold shadow-lg">
                {user?.name?.split(' ').map(n => n[0]).join('') || role[0]}
              </div>
              <div className="hidden md:flex flex-col items-end">
                <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Officer'}</p>
                <p className="text-[10px] text-white/50 leading-tight">{user?.userId || ''}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}