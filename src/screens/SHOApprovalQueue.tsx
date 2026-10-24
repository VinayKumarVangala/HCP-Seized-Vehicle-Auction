import React, { useState, useEffect } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { PageHeader, Badge, NoticeTracker, EligibilityChip, Btn, Card, KPICard, FilterBar, Table } from '../components/ui';

const initialQueue = [
  { reg: 'TS09EA1234', ps: 'Banjara Hills', category: '2-Wheeler', compliance: '3/3', legal: 'Clear', submittedOn: '10-Sep-2025', age: '1d', priority: 'normal' },
  { reg: 'TS10UB5678', ps: 'Begumpet', category: '4-Wheeler', compliance: '3/3', legal: 'Pending', submittedOn: '09-Sep-2025', age: '2d', priority: 'normal' },
  { reg: 'TS05MK3456', ps: 'Secunderabad', category: 'Commercial', compliance: '3/3', legal: 'Clear', submittedOn: '07-Sep-2025', age: '4d', priority: 'high' },
  { reg: 'TS03PQ2211', ps: 'Banjara Hills', category: '4-Wheeler', compliance: '3/3', legal: 'Clear', submittedOn: '05-Sep-2025', age: '6d', priority: 'high' },
  { reg: 'TS12AB6655', ps: 'Secunderabad', category: '4-Wheeler', compliance: '2/3', legal: 'Pending', submittedOn: '03-Sep-2025', age: '8d', priority: 'low' },
];

export default function SHOApprovalQueue() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [queue, setQueue] = useState<any[]>(initialQueue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQueue = async () => {
      try {
        setLoading(true);
        const res = await apiService.getSeizures({ status: 'Submitted' });
        setQueue(res.data.map((s: any) => ({
          reg: s.vehicle.registrationNo,
          ps: s.policeStation.name,
          category: s.vehicle.category,
          compliance: '3/3',
          legal: s.status === 'SHO Approved' ? 'Clear' : 'Pending',
          submittedOn: s.createdAt,
          age: '1d',
          priority: 'normal',
        })));
      } catch (err: any) {
        setError(err.message || 'Failed to load approval queue');
        console.warn('Using mock data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadQueue();
  }, [user?.role]);

  useEffect(() => {
    const unsub = notificationService.subscribe((notifs) => {
      const relevant = notifs.filter(n => n.type === 'seizure_created');
      if (relevant.length > 0) {
        apiService.getSeizures({ status: 'Submitted' }).then(res => {
          setQueue(res.data.map((s: any) => ({
            reg: s.vehicle.registrationNo,
            ps: s.policeStation.name,
            category: s.vehicle.category,
            compliance: '3/3',
            legal: 'Pending',
            submittedOn: s.createdAt,
            age: '1d',
            priority: 'normal',
          })));
        }).catch(() => {});
      }
    });
    return () => unsub();
  }, []);

  const handleApprove = async (reg: string) => {
    try {
      await apiService.approveSeizure(reg);
      notificationService.notifySeizureApproved(reg, reg, 'PS');
      setQueue(q => q.filter(item => item.reg !== reg));
    } catch (err: any) {
      alert('Failed to approve: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReject = async (reg: string) => {
    try {
      await apiService.rejectSeizure(reg);
      notificationService.notifySeizureRejected(reg, reg, 'PS');
      setQueue(q => q.filter(item => item.reg !== reg));
    } catch (err: any) {
      alert('Failed to reject: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <PageHeader
        title="SHO Approval Queue"
        subtitle="Review and approve vehicle seizure entries"
        breadcrumb="Home / Approval Queue"
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          {error} (Using demo data)
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Pending My Approval" value={queue.length} delta={`${queue.filter(q => q.priority === 'high').length} high priority`} tone="warning"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6v-4m0-4h.01"/></svg>}
        />
        <KPICard title="Notice Non-Compliance" value="5" delta="Overdue notices" tone="error"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
        <KPICard title="Eligible Awaiting Approval" value={queue.filter(q => q.compliance === '3/3').length} delta="Ready for auction" tone="neutral"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <KPICard title="Approved This Month" value="34" delta="↑ 6 vs last month" tone="success"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
      </div>

      <div className="flex items-center gap-4 p-4 mb-4 bg-orange-50 border border-orange-200 rounded-xl">
        <span className="text-orange-500 text-xl shrink-0">⚠</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-orange-700">3 vehicles overdue for 3rd notice</p>
          <p className="text-xs text-orange-600">TS07CD9012, TS11XY7890, TS06GH8877 — notice intervals exceeded 45 days. Immediate action required.</p>
        </div>
        <Btn variant="secondary" size="sm" className="shrink-0">View Details</Btn>
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#E0E0E0]">
          <h3 className="text-sm font-semibold">Pending Approvals</h3>
        </div>
        <FilterBar />
        <Table headers={['Reg No', 'Police Station', 'Category', 'Notice Compliance', 'Legal Status', 'Submitted On', 'Age', 'Priority', 'Action']}>
          {queue.map(row => (
            <tr key={row.reg} className="hover:bg-[#F7F8FA] transition-colors">
              <td className="px-4 py-3 font-mono text-sm font-medium text-[#145A43]">{row.reg}</td>
              <td className="px-4 py-3 text-sm text-[#1A1A1A]">{row.ps}</td>
              <td className="px-4 py-3"><Badge tone="neutral">{row.category}</Badge></td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.compliance === '3/3' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{row.compliance}</span>
              </td>
              <td className="px-4 py-3">
                <Badge tone={row.legal === 'Clear' ? 'success' : 'warning'}>{row.legal}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{row.submittedOn}</td>
              <td className="px-4 py-3 text-sm font-medium text-[#4A4A4A]">{row.age}</td>
              <td className="px-4 py-3">
                {row.priority === 'high' && <Badge tone="error" dot>High</Badge>}
                {row.priority === 'normal' && <Badge tone="neutral" dot>Normal</Badge>}
                {row.priority === 'low' && <Badge tone="info" dot>Low</Badge>}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Btn size="sm" onClick={() => handleApprove(row.reg)}>Approve</Btn>
                  <Btn variant="secondary" size="sm" onClick={() => handleReject(row.reg)}>Reject</Btn>
                </div>
              </td>
            </tr>
          ))}
          {queue.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-3 text-center text-[#9E9E9E]">No pending approvals</td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}