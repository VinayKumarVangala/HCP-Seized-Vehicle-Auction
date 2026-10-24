import React, { useState } from 'react';
import { useNav } from '../nav';
import { PageHeader, Badge, EligibilityChip, Btn, Card, ApprovalTimeline } from '../components/ui';

const approvalSteps = [
  { role: 'PS Officer Entry', name: 'SI T. Venkat Rao', date: '08-Sep-2025', status: 'done' as const },
  { role: 'SHO Approval', name: '(You — Inspector G. Srinivas)', status: 'current' as const },
  { role: 'Legal Review', status: 'pending' as const },
  { role: 'Auction Cell', status: 'pending' as const },
  { role: 'District Admin', status: 'pending' as const },
];

const eligibilityChecks = [
  { pass: true, label: '3 Notices Served', value: '3/3 — all delivered' },
  { pass: true, label: 'Minimum Interval (15 days)', value: 'N1→N2: 18d · N2→N3: 22d' },
  { pass: true, label: 'Post-3rd Notice Wait (30 days)', value: '35 days elapsed' },
  { pass: true, label: 'No Active Court Stay', value: 'No stays recorded' },
  { pass: true, label: 'Valuation Completed', value: '₹1,25,000 on 10-Sep-2025' },
  { pass: true, label: 'Documents Uploaded', value: '6/6 mandatory docs' },
];

export default function SHOReviewVehicle() {
  const { navigate } = useNav();
  const [decision, setDecision] = useState<'approve' | 'reject' | 'sendback'>('approve');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('sho-approval-queue'), 1200);
  };

  return (
    <div>
      <PageHeader
        title="Review Vehicle — TS09EA1234"
        subtitle="Honda Activa 6G · Banjara Hills PS"
        breadcrumb="Home / Approval Queue / Review"
        actions={<Btn variant="ghost" onClick={() => navigate('sho-approval-queue')}>← Back to Queue</Btn>}
      />

      {submitted && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-[#145A43] text-white rounded-xl shadow-2xl animate-pulse">
          <span>✓</span>
          <span className="text-sm font-medium">Decision submitted successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Vehicle summary + checks */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Vehicle summary */}
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#E6F2ED] flex items-center justify-center text-3xl">🛵</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-mono text-lg font-bold text-[#1A1A1A]">TS09EA1234</h2>
                  <Badge tone="neutral">2-Wheeler</Badge>
                  <Badge tone="warning">Crime Vehicle</Badge>
                </div>
                <p className="text-sm text-[#4A4A4A] mb-3">Honda Activa 6G · 2022 · Pearl Black · Petrol · 12,450 km</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><p className="text-xs text-[#9E9E9E]">Seizure Date</p><p className="font-medium">08-Sep-2025</p></div>
                  <div><p className="text-xs text-[#9E9E9E]">FIR No</p><p className="font-mono text-sm font-medium">123/2025</p></div>
                  <div><p className="text-xs text-[#9E9E9E]">Est. Value</p><p className="font-medium text-[#145A43]">₹1,25,000</p></div>
                  <div><p className="text-xs text-[#9E9E9E]">Owner</p><p className="font-medium">Ramesh Kumar Reddy</p></div>
                  <div><p className="text-xs text-[#9E9E9E]">IO</p><p className="font-medium">SI T. Venkat Rao</p></div>
                  <div><p className="text-xs text-[#9E9E9E]">Submitted</p><p className="font-medium">10-Sep-2025</p></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Notice Progress */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Notice Compliance</h3>
            <div className="flex items-center gap-0 mb-4">
              {[
                { label: 'Notice 1', date: '15-Jul-2025', mode: 'Reg. Post' },
                { label: 'Notice 2', date: '05-Aug-2025', mode: 'Speed Post' },
                { label: 'Notice 3', date: '03-Sep-2025', mode: 'Newspaper' },
              ].map((n, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#145A43] flex items-center justify-center text-white font-bold">✓</div>
                    <p className="text-xs font-semibold mt-1">{n.label}</p>
                    <p className="text-[10px] text-[#4A4A4A]">{n.date}</p>
                    <p className="text-[10px] text-[#9E9E9E]">{n.mode}</p>
                  </div>
                  {i < 2 && <div className="h-0.5 flex-1 bg-[#145A43] mx-2 mb-8" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4A4A4A] bg-green-50 p-2 rounded-lg">
              <span className="text-green-600">✓</span>
              <span>Intervals: N1→N2: <strong>18 days</strong> · N2→N3: <strong>22 days</strong> · Both ≥ 15 day minimum</span>
            </div>
          </Card>

          {/* Eligibility Checklist */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Eligibility Checklist</h3>
            <div className="flex flex-col gap-1.5">
              {eligibilityChecks.map((c, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm font-medium text-[#1A1A1A] flex-1">{c.label}</span>
                  <span className="text-xs text-[#4A4A4A]">{c.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Decision panel + Timeline */}
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Your Decision</h3>

            <div className="flex flex-col gap-2 mb-4">
              {[
                { value: 'approve', label: 'Approve', desc: 'Forward to Legal Review', color: '#145A43' },
                { value: 'sendback', label: 'Send Back', desc: 'Return to PS for correction', color: '#ED6C02' },
                { value: 'reject', label: 'Reject', desc: 'Reject this seizure entry', color: '#C62828' },
              ].map(opt => (
                <label key={opt.value} className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors" style={{
                  borderColor: decision === opt.value ? opt.color : '#E0E0E0',
                  backgroundColor: decision === opt.value ? opt.color + '10' : 'white'
                }}>
                  <input type="radio" value={opt.value} checked={decision === opt.value} onChange={() => setDecision(opt.value as any)} className="mt-0.5" style={{ accentColor: opt.color }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: decision === opt.value ? opt.color : '#1A1A1A' }}>{opt.label}</p>
                    <p className="text-xs text-[#9E9E9E]">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Remarks */}
            <div className="mb-4">
              <label className="text-sm font-medium text-[#4A4A4A] block mb-1">
                Remarks {(decision === 'reject' || decision === 'sendback') && <span className="text-[#C62828]">*</span>}
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder={decision === 'approve' ? 'Optional remarks...' : 'Required — provide reason for your decision'}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-sm resize-none focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none"
              />
              {(decision === 'reject' || decision === 'sendback') && !remarks && (
                <p className="text-xs text-[#C62828] mt-1">Remarks required for this decision</p>
              )}
            </div>

            {/* Digital signature */}
            <div className="p-3 border border-dashed border-[#E0E0E0] rounded-lg mb-4">
              <p className="text-xs text-[#9E9E9E] text-center mb-1">Digital Signature</p>
              <p className="text-sm text-center text-[#4A4A4A] font-medium">Inspector G. Srinivas</p>
              <p className="text-xs text-[#9E9E9E] text-center">DSC linked · Valid till Dec 2026</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('sho-approval-queue')} className="flex-1 h-10 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA] cursor-pointer">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={(decision !== 'approve') && !remarks}
                className={`flex-1 h-10 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${decision === 'approve' ? 'bg-[#145A43] hover:bg-[#1E7A5A]' : decision === 'reject' ? 'bg-[#C62828] hover:bg-red-700' : 'bg-[#ED6C02] hover:bg-orange-600'}`}
              >
                Submit Decision
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Approval Timeline</h3>
            <ApprovalTimeline steps={approvalSteps} />
          </Card>
        </div>
      </div>
    </div>
  );
}
