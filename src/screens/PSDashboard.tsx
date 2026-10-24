import React, { useEffect, useState } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { KPICard, PageHeader, Badge, NoticeTracker, EligibilityChip, Btn, Card, Table } from '../components/ui';
import type { Vehicle, DashboardKPIs } from '../api/types';

const recentSeizuresMock = [
  { reg: 'TS09EA1234', make: 'Honda Activa', cat: '2-Wheeler', date: '08-Sep-2025', ps: 'Banjara Hills', notices: 3, eligibility: 'Eligible' as const, fir: '123/2025' },
  { reg: 'TS10UB5678', make: 'Maruti Swift', cat: '4-Wheeler', date: '05-Sep-2025', ps: 'Begumpet', notices: 2, eligibility: 'Pending' as const, fir: '456/2025' },
  { reg: 'TS07CD9012', make: 'Bajaj Pulsar', cat: '2-Wheeler', date: '01-Sep-2025', ps: 'Kukatpally', notices: 1, eligibility: 'Pending' as const, fir: '789/2025' },
  { reg: 'TS05MK3456', make: 'Tata Ace', cat: 'Commercial', date: '28-Aug-2025', ps: 'Secunderabad', notices: 3, eligibility: 'Eligible' as const, fir: '012/2025' },
  { reg: 'TS11XY7890', make: 'Royal Enfield', cat: '2-Wheeler', date: '25-Aug-2025', ps: 'Charminar', notices: 0, eligibility: 'Blocked' as const, fir: '345/2025' },
];

export default function PSDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [vehicles, setVehicles] = useState<any[]>(recentSeizuresMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const kpiRes = await apiService.getKPIs(user?.role || 'PS');
        setKpis(kpiRes);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.warn('Using mock data due to API error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.role]);

  useEffect(() => {
    const unsub = notificationService.subscribe((notifs) => {
      const relevant = notifs.filter(n =>
        n.type === 'seizure_created' || n.type === 'seizure_approved' || n.type === 'notice_recorded'
      );
      if (relevant.length > 0) {
        apiService.getKPIs(user?.role || 'PS').then(setKpis).catch(() => {});
      }
    });
    return () => unsub();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#145A43] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Police Station Dashboard"
        subtitle={user?.station ? `${user.name} — ${user.station}, Hyderabad` : 'Banjara Hills Police Station, Hyderabad'}
        breadcrumb="Home / Dashboard"
        actions={<Btn onClick={() => navigate('ps-new-seizure')}>＋ New Seizure Entry</Btn>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          {error} (Using demo data)
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis ? (
          <>
            <KPICard title="Total Seized" value={kpis.totalSeized} delta="Live data" tone="neutral"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="m16 8 6 2v4l-6 2V8z"/></svg>}
            />
            <KPICard title="Pending Notices" value={kpis.pendingNotices} delta="2 overdue" tone="warning"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
            />
            <KPICard title="Eligible for Auction" value={kpis.eligibleForAuction} delta="Live" tone="success"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
            />
            <KPICard title="Auctioned" value={kpis.auctioned} delta={`₹${(kpis.auctionedValue / 100000).toFixed(1)}L realized`} tone="neutral"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />
          </>
        ) : (
          <>
            <KPICard title="Total Seized" value="142" delta="↑ 8 this month" tone="neutral"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="m16 8 6 2v4l-6 2V8z"/></svg>}
            />
            <KPICard title="Pending Notices" value="34" delta="2 overdue" tone="warning"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
            />
            <KPICard title="Eligible for Auction" value="58" delta="↑ 12 since last week" tone="success"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
            />
            <KPICard title="Auctioned" value="29" delta="₹38,50,000 realized" tone="neutral"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Notice Compliance</h3>
          <div className="space-y-3">
            {[
              { label: '3 of 3 Notices Sent', count: kpis?.eligibleForAuction || 58, color: '#145A43', pct: 58 },
              { label: '2 of 3 Notices Sent', count: 22, color: '#D4A017', pct: 22 },
              { label: '1 of 3 Notices Sent', count: 12, color: '#ED6C02', pct: 12 },
              { label: 'No Notices Sent', count: 8, color: '#C62828', pct: 8 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4A4A4A]">{item.label}</span>
                  <span className="font-semibold text-[#1A1A1A]">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#E0E0E0] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate('ps-new-seizure')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#E6F2ED] text-left transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-lg bg-[#E6F2ED] group-hover:bg-[#145A43] flex items-center justify-center text-[#145A43] group-hover:text-white transition-colors text-sm">＋</div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">New Seizure Entry</p>
                <p className="text-xs text-[#9E9E9E]">Record a newly seized vehicle</p>
              </div>
            </button>
            <button onClick={() => navigate('ps-notice-tracking')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#E6F2ED] text-left transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-lg bg-[#E6F2ED] group-hover:bg-[#145A43] flex items-center justify-center text-[#145A43] group-hover:text-white transition-colors text-sm">📋</div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">Upload Notice Proof</p>
                <p className="text-xs text-[#9E9E9E]">Update notice delivery records</p>
              </div>
            </button>
            <button onClick={() => navigate('ps-vehicle-list')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#E6F2ED] text-left transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-lg bg-[#E6F2ED] group-hover:bg-[#145A43] flex items-center justify-center text-[#145A43] group-hover:text-white transition-colors text-sm">✔</div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">View Auction Eligible</p>
                <p className="text-xs text-[#9E9E9E]">{kpis?.eligibleForAuction || 58} vehicles ready for auction</p>
              </div>
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Alerts & Flags</h3>
          <div className="flex flex-col gap-2">
            {[
              { type: 'error' as const, msg: '2 vehicles: 3rd notice overdue by >45 days' },
              { type: 'warning' as const, msg: '5 vehicles awaiting SHO approval' },
              { type: 'info' as const, msg: '3 vehicles: court stay order active' },
              { type: 'success' as const, msg: '12 vehicles cleared for auction this week' },
            ].map((a, i) => {
              const colors = { error: 'bg-red-50 border-red-200 text-red-700', warning: 'bg-orange-50 border-orange-200 text-orange-700', info: 'bg-blue-50 border-blue-200 text-blue-700', success: 'bg-green-50 border-green-200 text-green-700' };
              return (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${colors[a.type]}`}>
                  <span>{a.type === 'error' ? '⚠' : a.type === 'warning' ? '⏰' : a.type === 'info' ? 'ℹ' : '✓'}</span>
                  {a.msg}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0E0]">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Recent Seizures</h3>
          <Btn variant="ghost" size="sm" onClick={() => navigate('ps-vehicle-list')}>View All →</Btn>
        </div>
        <Table headers={['Reg No', 'Make/Model', 'Category', 'Seizure Date', 'FIR No', 'Notices', 'Eligibility', 'Action']}>
          {vehicles.slice(0, 5).map(row => (
            <tr key={row.reg} className="hover:bg-[#F7F8FA] transition-colors">
              <td className="px-4 py-3 font-mono text-sm text-[#145A43] font-medium">{row.reg}</td>
              <td className="px-4 py-3 text-sm text-[#1A1A1A]">{row.make}</td>
              <td className="px-4 py-3"><Badge tone="neutral">{row.cat}</Badge></td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{row.date}</td>
              <td className="px-4 py-3 font-mono text-xs text-[#4A4A4A]">{row.fir}</td>
              <td className="px-4 py-3"><NoticeTracker sent={row.notices} /></td>
              <td className="px-4 py-3"><EligibilityChip status={row.eligibility} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('ps-vehicle-detail')} className="text-xs text-[#145A43] hover:underline cursor-pointer">View</button>
                  <span className="text-[#E0E0E0]">·</span>
                  <button onClick={() => navigate('ps-notice-tracking')} className="text-xs text-[#145A43] hover:underline cursor-pointer">Notice</button>
                </div>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-3 text-center text-[#9E9E9E]">No vehicles found</td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}