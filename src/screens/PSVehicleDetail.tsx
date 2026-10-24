import React, { useState, useEffect } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { PageHeader, Badge, NoticeTracker, EligibilityChip, Btn, Card, Tabs, ApprovalTimeline } from '../components/ui';
import type { Seizure, Notice, Valuation, Document } from '../api/types';

const initialSeizure = {
  id: 's-1',
  registrationNo: 'TS09EA1234',
  chassisNo: 'MAKEA051SK2567890',
  engineNo: 'HA10EBK3456789',
  make: 'Honda',
  model: 'Activa 6G',
  year: 2022,
  color: 'Pearl Igneous Black',
  seizureDate: '08-Sep-2025',
  custodyLocation: 'PS Yard — Banjara Hills',
  firNo: '123/2025',
  category: 'Crime Vehicle',
  eligibility: 'Eligible' as const,
};

const initialApprovalSteps = [
  { role: 'PS Officer Entry', name: 'SI T. Venkat Rao', date: '08-Sep-2025', status: 'done' as const },
  { role: 'SHO Approval', name: 'Inspector G. Srinivas', date: '10-Sep-2025', status: 'done' as const },
  { role: 'Legal Review', name: 'Legal Officer P. Rao', date: '12-Sep-2025', status: 'current' as const },
  { role: 'Auction Cell', status: 'pending' as const },
  { role: 'District Admin', status: 'pending' as const },
];

const initialEligibilityChecks = [
  { pass: true, label: '3 Notices Served', value: '3/3 completed', action: null },
  { pass: true, label: 'Minimum Interval (15 days)', value: 'N1→N2: 18 days, N2→N3: 22 days', action: null },
  { pass: true, label: 'Post-3rd Notice Wait (30 days)', value: '35 days elapsed', action: null },
  { pass: true, label: 'No Active Court Stay', value: 'No stays recorded', action: null },
  { pass: false, label: 'Legal Clearance', value: 'Awaiting legal officer sign-off', action: 'Request Legal' },
  { pass: true, label: 'Valuation Completed', value: '₹1,25,000 (10-Sep-2025)', action: null },
  { pass: true, label: 'Documents Complete', value: '6/6 mandatory docs uploaded', action: null },
];

const initialNoticeHistory = [
  { notice: 'Notice 1', date: '15-Jul-2025', mode: 'Registered Post', status: 'Delivered', ack: '22-Jul-2025' },
  { notice: 'Notice 2', date: '05-Aug-2025', mode: 'Speed Post', status: 'Delivered', ack: '09-Aug-2025' },
  { notice: 'Notice 3', date: '03-Sep-2025', mode: 'Registered Post + Newspaper', status: 'Delivered', ack: '07-Sep-2025' },
];

const initialAuditLog = [
  { time: '08-Sep-2025 10:32', user: 'SI T. Venkat Rao', action: 'Vehicle seizure entry created', ip: '192.168.1.45' },
  { time: '10-Sep-2025 14:15', user: 'Inspector G. Srinivas', action: 'SHO approved seizure entry', ip: '192.168.1.12' },
  { time: '10-Sep-2025 16:00', user: 'System', action: 'Notice 1 scheduled for dispatch', ip: 'system' },
  { time: '15-Jul-2025 09:00', user: 'SI T. Venkat Rao', action: 'Notice 1 recorded — Registered Post', ip: '192.168.1.45' },
  { time: '12-Sep-2025 11:00', user: 'Legal Officer P. Rao', action: 'Case assigned for legal review', ip: '192.168.2.01' },
];

export default function PSVehicleDetail() {
  const { navigate } = useNav();
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [seizure, setSeizure] = useState<any>(initialSeizure);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const seizureId = 's-1';

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const [sRes, nRes, vRes, dRes] = await Promise.allSettled([
          apiService.getSeizure(seizureId),
          apiService.getNotices(seizureId),
          apiService.getValuations(seizureId),
          apiService.getDocuments(seizureId),
        ]);
        if (sRes.status === 'fulfilled') setSeizure(sRes.value);
        if (nRes.status === 'fulfilled') setNotices(nRes.value);
        if (vRes.status === 'fulfilled') setValuations(vRes.value);
        if (dRes.status === 'fulfilled') setDocuments(dRes.value);
      } catch (err: any) {
        setError(err.message || 'Failed to load vehicle details');
        console.warn('Using mock data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [seizureId]);

  useEffect(() => {
    const unsub = notificationService.subscribe((notifs) => {
      const relevant = notifs.filter(n =>
        n.data?.seizureId === seizureId ||
        n.type === 'seizure_approved' || n.type === 'seizure_rejected'
      );
      if (relevant.length > 0) {
        apiService.getSeizure(seizureId).then(res => setSeizure(res)).catch(() => {});
      }
    });
    return () => unsub();
  }, [seizureId]);

  const tabs = ['Overview', 'Seizure & Case', 'Owner & RTA', 'Notices', 'Documents', 'Valuation', 'Auction History', 'Audit Log'];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#145A43] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-[#9E9E9E] mb-1">Home / My Vehicles / Vehicle Detail</p>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold font-mono text-[#1A1A1A]">{seizure.registrationNo}</h1>
            <Badge tone="neutral">{seizure.category?.split(' ')[0] || '2-Wheeler'}</Badge>
            <Badge tone="warning">{seizure.category || 'Crime Vehicle'}</Badge>
            <EligibilityChip status={seizure.eligibility || 'Eligible'} />
          </div>
          <p className="text-sm text-[#4A4A4A]">{seizure.make} {seizure.model} · {seizure.year} · {seizure.custodyLocation}</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="sm" onClick={() => navigate('ps-new-seizure')}>Edit</Btn>
          <Btn variant="secondary" size="sm" onClick={() => navigate('ps-notice-tracking')}>Record Notice</Btn>
          {hasRole('SHO') && <Btn size="sm">Request Approval</Btn>}
          <Btn variant="ghost" size="sm">🖨 Print</Btn>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          {error} (Using demo data)
        </div>
      )}

      <Card className="mb-0 rounded-b-none border-b-0">
        <div className="px-4 pt-3">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
      </Card>

      <Card className="rounded-t-none">
        {activeTab === 'Overview' && (
          <div className="p-5 grid grid-cols-3 gap-6">
            <div className="col-span-2 flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  ['Registration No', seizure.registrationNo, true],
                  ['Chassis No', seizure.chassisNo || 'MAKEA051SK2567890', true],
                  ['Engine No', seizure.engineNo || 'HA10EBK3456789', true],
                  ['Make / Model', `${seizure.make} ${seizure.model}`, false],
                  ['Year', String(seizure.year), false],
                  ['Color', seizure.color || 'Pearl Igneous Black', false],
                  ['Seizure Date', seizure.seizureDate, false],
                  ['Custody Location', seizure.custodyLocation, false],
                  ['FIR Number', seizure.firNo, true],
                ].map(([k, v, mono]) => (
                  <div key={k as string}>
                    <p className="text-xs text-[#9E9E9E] mb-0.5">{k}</p>
                    <p className={`text-sm font-medium text-[#1A1A1A] ${mono ? 'font-mono' : ''}`}>{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Notice Progress</h3>
                <div className="flex items-center gap-0">
                  {initialNoticeHistory.map((n, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 h-10 rounded-full bg-[#145A43] flex items-center justify-center text-white text-sm font-bold">✓</div>
                        <p className="text-xs font-semibold text-[#145A43] mt-1">{n.notice}</p>
                        <p className="text-[10px] text-[#4A4A4A]">{n.date}</p>
                        <p className="text-[10px] text-[#9E9E9E]">{n.mode}</p>
                        <span className="mt-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{n.status}</span>
                      </div>
                      {i < initialNoticeHistory.length - 1 && <div className="h-0.5 flex-1 bg-[#145A43] mx-2 mb-8" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Eligibility Checklist</h3>
                <div className="flex flex-col gap-1.5">
                  {initialEligibilityChecks.map((c, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${c.pass ? 'bg-green-50' : 'bg-orange-50'}`}>
                      <span className={`text-sm ${c.pass ? 'text-green-600' : 'text-orange-500'}`}>{c.pass ? '✓' : '⏳'}</span>
                      <span className="text-sm font-medium text-[#1A1A1A] flex-1">{c.label}</span>
                      <span className="text-xs text-[#4A4A4A]">{c.value}</span>
                      {c.action && <button className="text-xs text-[#145A43] hover:underline cursor-pointer">{c.action}</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Approval Timeline</h3>
                <ApprovalTimeline steps={initialApprovalSteps} />
              </div>

              <div className="p-4 rounded-xl bg-[#E6F2ED] border border-[#145A43]/20">
                <p className="text-xs font-semibold text-[#145A43] uppercase tracking-wide mb-2">Estimated Value</p>
                <p className="text-2xl font-bold text-[#145A43]">₹1,25,000</p>
                <p className="text-xs text-[#4A4A4A] mt-1">Valued on 10-Sep-2025 by SI T. Venkat Rao</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Notices' && (
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold">Notice History</h3>
              <Btn size="sm" onClick={() => navigate('ps-notice-tracking')}>+ Record Notice</Btn>
            </div>
            <div className="flex flex-col gap-3">
              {(notices.length > 0 ? notices : initialNoticeHistory as any[]).map((n: any, i) => (
                <div key={i} className="border border-[#E0E0E0] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#145A43] text-white text-xs flex items-center justify-center font-bold">{i + 1}</div>
                      <span className="font-semibold text-sm">{n.notice || `Notice ${i + 1}`}</span>
                    </div>
                    <Badge tone={n.deliveryStatus === 'Delivered' ? 'success' : 'warning'} dot>{n.deliveryStatus || n.status || 'Delivered'}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div><p className="text-xs text-[#9E9E9E]">Sent Date</p><p className="font-medium">{n.sentDate || n.date}</p></div>
                    <div><p className="text-xs text-[#9E9E9E]">Mode</p><p className="font-medium">{n.mode}</p></div>
                    <div><p className="text-xs text-[#9E9E9E]">Status</p><p className="font-medium">{n.deliveryStatus || n.status}</p></div>
                    <div><p className="text-xs text-[#9E9E9E]">Ack. Date</p><p className="font-medium">{n.acknowledgementDate || n.ack}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Audit Log' && (
          <div className="p-5">
            <div className="flex flex-col gap-2">
              {initialAuditLog.map((entry, i) => (
                <div key={i} className="flex gap-3 items-start text-sm p-3 rounded-lg hover:bg-[#F7F8FA]">
                  <span className="text-[#9E9E9E] text-xs mono shrink-0 w-40">{entry.time}</span>
                  <span className="font-medium text-[#1A1A1A] shrink-0 w-36">{entry.user}</span>
                  <span className="text-[#4A4A4A] flex-1">{entry.action}</span>
                  <span className="text-[#9E9E9E] text-xs mono">{entry.ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!['Overview', 'Notices', 'Audit Log'].includes(activeTab) && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-[#4A4A4A] font-medium mb-1">{activeTab} Tab</p>
            <p className="text-sm text-[#9E9E9E]">Content for this tab would be displayed here</p>
          </div>
        )}
      </Card>
    </div>
  );
}