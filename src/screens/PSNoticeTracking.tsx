import React, { useState, useEffect } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { PageHeader, Badge, NoticeTracker, EligibilityChip, Btn, Card, Table, Select, Field } from '../components/ui';
import type { Notice } from '../api/types';

const initialVehicles = [
  { reg: 'TS09EA1234', owner: 'Ramesh Kumar Reddy', n1: { date: '15-Jul-2025', mode: 'Reg. Post', status: 'Delivered' }, n2: { date: '05-Aug-2025', mode: 'Speed Post', status: 'Delivered' }, n3: { date: '03-Sep-2025', mode: 'Newspaper', status: 'Delivered' }, intervalOk: true, eligibility: 'Eligible' as const },
  { reg: 'TS10UB5678', owner: 'Vijayalakshmi D.', n1: { date: '20-Jul-2025', mode: 'Speed Post', status: 'Delivered' }, n2: { date: '10-Aug-2025', mode: 'Email', status: 'Sent' }, n3: null, intervalOk: true, eligibility: 'Pending' as const },
  { reg: 'TS07CD9012', owner: 'Mohammed Aslam Khan', n1: { date: '01-Aug-2025', mode: 'Reg. Post', status: 'Returned' }, n2: null, n3: null, intervalOk: false, eligibility: 'Blocked' as const },
  { reg: 'TS05MK3456', owner: 'Suresh Babu Gudipati', n1: { date: '10-Jun-2025', mode: 'Reg. Post', status: 'Delivered' }, n2: { date: '05-Jul-2025', mode: 'Speed Post', status: 'Delivered' }, n3: { date: '02-Aug-2025', mode: 'Reg. Post', status: 'Delivered' }, intervalOk: true, eligibility: 'Eligible' as const },
  { reg: 'TS11XY7890', owner: 'Priya Anand Nair', n1: null, n2: null, n3: null, intervalOk: false, eligibility: 'Blocked' as const },
];

const noticeColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Sent: 'bg-blue-100 text-blue-700',
  Returned: 'bg-red-100 text-red-700',
  Pending: 'bg-orange-100 text-orange-700',
};

export default function PSNoticeTracking() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState('');
  const [noticeForm, setNoticeForm] = useState({ noticeNo: '', type: '1', date: '', mode: '', address: '', trackingNo: '', deliveryStatus: 'Sent', ackDate: '', remarks: '' });
  const [notices, setNotices] = useState<Notice[]>([]);
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const update = (k: string) => (v: string) => setNoticeForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        const res = await apiService.getNotices();
        setNotices(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load notices');
        console.warn('Using mock data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, [user?.role]);

  useEffect(() => {
    const unsub = notificationService.subscribe((notifs) => {
      const relevant = notifs.filter(n => n.type === 'notice_recorded' || n.type === 'notice_returned');
      if (relevant.length > 0) {
        apiService.getNotices().then(res => setNotices(res)).catch(() => {});
      }
    });
    return () => unsub();
  }, []);

  const NoticeCell = ({ n }: { n: { date: string; mode: string; status: string } | null }) => {
    if (!n) return <span className="text-[#9E9E9E] text-xs">—</span>;
    return (
      <div>
        <p className="text-xs font-medium text-[#1A1A1A]">{n.date}</p>
        <p className="text-[10px] text-[#9E9E9E]">{n.mode}</p>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${noticeColors[n.status] || 'bg-gray-100 text-gray-600'}`}>{n.status}</span>
      </div>
    );
  };

  const handleSaveNotice = async () => {
    try {
      await apiService.createNotice({
        seizureId: selectedReg,
        noticeNumber: parseInt(noticeForm.type) as 1 | 2 | 3,
        noticeType: parseInt(noticeForm.type) as 1 | 2 | 3,
        sentDate: noticeForm.date,
        mode: noticeForm.mode as any,
        address: noticeForm.address,
        trackingNumber: noticeForm.trackingNo,
        deliveryStatus: noticeForm.deliveryStatus as any,
        acknowledgementDate: noticeForm.ackDate || undefined,
        remarks: noticeForm.remarks,
      });

      notificationService.notifyNoticeReturned(selectedReg, parseInt(noticeForm.type), 'PS');
      setDrawerOpen(false);
      setNoticeForm({ noticeNo: '', type: '1', date: '', mode: '', address: '', trackingNo: '', deliveryStatus: 'Sent', ackDate: '', remarks: '' });
    } catch (err: any) {
      alert('Failed to save notice: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="relative">
      <PageHeader
        title="Notice Tracking"
        subtitle="Track 3-notice compliance for all seized vehicles"
        breadcrumb="Home / Notice Tracking"
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          {error} (Using demo data)
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '3/3 Complete', count: 2, color: '#145A43' },
          { label: '2/3 Sent', count: 1, color: '#D4A017' },
          { label: '1/3 Sent', count: 1, color: '#ED6C02' },
          { label: '0/3 (No Notices)', count: 1, color: '#C62828' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E0E0E0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.color }}>{s.count}</div>
            <p className="text-sm font-medium text-[#4A4A4A]">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#E0E0E0] flex items-center gap-3">
          <h3 className="text-sm font-semibold flex-1">Vehicle Notice Status</h3>
          <Btn size="sm" onClick={() => { setSelectedReg(''); setDrawerOpen(true); }}>+ Record Notice</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#F7F8FA]">
                {['Reg No', 'Owner', 'Notice 1', 'Notice 2', 'Notice 3', 'Interval OK?', 'Eligibility', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {vehicles.map(v => (
                <tr key={v.reg} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-[#145A43]">{v.reg}</td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{v.owner}</td>
                  <td className="px-4 py-3"><NoticeCell n={v.n1} /></td>
                  <td className="px-4 py-3"><NoticeCell n={v.n2} /></td>
                  <td className="px-4 py-3"><NoticeCell n={v.n3} /></td>
                  <td className="px-4 py-3">
                    {v.intervalOk
                      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ OK</span>
                      : <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">✗ Fail</span>}
                  </td>
                  <td className="px-4 py-3"><EligibilityChip status={v.eligibility} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedReg(v.reg); setDrawerOpen(true); }} className="text-xs text-[#145A43] hover:underline cursor-pointer border border-[#145A43] px-2 py-1 rounded-lg">Record Notice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDrawerOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-[#F7F8FA]">
              <div>
                <h2 className="font-semibold text-[#1A1A1A]">Record Notice</h2>
                {selectedReg && <p className="text-xs text-[#9E9E9E] font-mono mt-0.5">{selectedReg}</p>}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-[#9E9E9E] hover:text-[#1A1A1A] cursor-pointer text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <Field label="Notice Number" value={noticeForm.noticeNo} onChange={update('noticeNo')} required />
              <Select label="Notice Type" value={noticeForm.type} onChange={update('type')} required options={[
                { value: '1', label: 'Notice 1 (First Notice)' },
                { value: '2', label: 'Notice 2 (Second Notice)' },
                { value: '3', label: 'Notice 3 (Final Notice)' },
              ]} />
              <Field label="Notice Sent Date" value={noticeForm.date} onChange={update('date')} required />
              <Select label="Mode of Service" value={noticeForm.mode} onChange={update('mode')} required options={[
                { value: 'rp', label: 'Registered Post' },
                { value: 'sp', label: 'Speed Post' },
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'public', label: 'Public Notice Board' },
                { value: 'news', label: 'Newspaper Publication' },
              ]} />
              <Field label="Address / Tracking No." value={noticeForm.trackingNo} onChange={update('trackingNo')} mono />
              <Select label="Delivery Status" value={noticeForm.deliveryStatus} onChange={update('deliveryStatus')} required options={[
                { value: 'Sent', label: 'Sent / Dispatched' },
                { value: 'Delivered', label: 'Delivered — Acknowledged' },
                { value: 'Returned', label: 'Returned Undelivered' },
              ]} />
              {noticeForm.deliveryStatus === 'Delivered' && (
                <Field label="Acknowledgement Date" value={noticeForm.ackDate} onChange={update('ackDate')} />
              )}
              <div>
                <label className="text-sm font-medium text-[#4A4A4A] block mb-1">Upload Proof</label>
                <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-6 text-center hover:border-[#145A43] transition-colors cursor-pointer">
                  <p className="text-sm text-[#9E9E9E] mb-1">Drag & drop receipt / ack / publication</p>
                  <p className="text-xs text-[#145A43]">Click to browse</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#4A4A4A] block mb-1">Remarks</label>
                <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-sm resize-none focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[#E0E0E0]">
              <button onClick={() => setDrawerOpen(false)} className="flex-1 h-10 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA] transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveNotice} className="flex-1 h-10 rounded-lg bg-[#145A43] hover:bg-[#1E7A5A] text-white text-sm font-medium transition-colors cursor-pointer">Save Notice</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}