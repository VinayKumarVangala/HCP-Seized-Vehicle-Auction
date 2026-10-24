import React, { useState } from 'react';
import { PageHeader, Btn, Card, Field, Select } from '../components/ui';

export default function ADMNoticeRules() {
  const [saved, setSaved] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'crime' | 'victim'>('crime');
  const [rules, setRules] = useState({
    minCount: '3',
    minInterval: '15',
    maxInterval: '45',
    totalDuration: '90',
    waitAfterThird: '30',
    modes: ['Registered Post', 'Speed Post', 'Newspaper'],
    returnedHandling: 'additional',
  });

  const update = (k: string) => (v: string) => setRules(r => ({ ...r, [k]: v }));
  const toggleMode = (mode: string) => setRules(r => ({
    ...r,
    modes: r.modes.includes(mode) ? r.modes.filter(m => m !== mode) : [...r.modes, mode]
  }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const impactData = [
    { label: 'Would become eligible immediately', count: 58, color: '#145A43' },
    { label: 'Currently compliant, unaffected', count: 42, color: '#9E9E9E' },
    { label: 'Would be blocked (interval too short)', count: 12, color: '#C62828' },
    { label: 'Need additional notices', count: 30, color: '#ED6C02' },
  ];

  const noticeModes = ['Registered Post', 'Speed Post', 'Email', 'SMS', 'Public Notice Board', 'Newspaper Publication'];

  return (
    <div>
      <PageHeader
        title="Notice Rules Configuration"
        subtitle="Define notice compliance rules for seized vehicle auction eligibility"
        breadcrumb="Home / Admin / Notice Rules"
      />

      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-[#145A43] text-white rounded-xl shadow-2xl">
          <span>✓</span>
          <span className="text-sm font-medium">Notice rules saved successfully!</span>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {(['crime', 'victim'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors cursor-pointer ${activeCategory === cat ? 'border-[#145A43] bg-[#145A43] text-white' : 'border-[#E0E0E0] bg-white text-[#4A4A4A] hover:border-[#145A43]'}`}
          >
            {cat === 'crime' ? '⚖ Crime Vehicle' : '🚗 Victim Vehicle'}
          </button>
        ))}
        <span className="ml-2 self-center text-xs text-[#9E9E9E]">Configure rules per vehicle category</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Config form */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#E0E0E0]">Notice Count & Intervals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Field label="Minimum Notice Count" value={rules.minCount} onChange={update('minCount')} required />
                <p className="text-xs text-[#9E9E9E] mt-1">Default: 3. Cannot be less than 1.</p>
              </div>
              <div>
                <Field label="Min Interval Between Notices (days)" value={rules.minInterval} onChange={update('minInterval')} required />
                <p className="text-xs text-[#9E9E9E] mt-1">e.g., 15 days minimum between each notice</p>
              </div>
              <div>
                <Field label="Max Interval Between Notices (days)" value={rules.maxInterval} onChange={update('maxInterval')} required />
                <p className="text-xs text-[#9E9E9E] mt-1">Exceeding triggers compliance flag</p>
              </div>
              <div>
                <Field label="Total Notice Duration (days)" value={rules.totalDuration} onChange={update('totalDuration')} required />
                <p className="text-xs text-[#9E9E9E] mt-1">Total period from seizure to last notice</p>
              </div>
              <div className="col-span-2">
                <Field label="Wait Period After 3rd Notice (days)" value={rules.waitAfterThird} onChange={update('waitAfterThird')} required />
                <p className="text-xs text-[#9E9E9E] mt-1">Minimum wait before vehicle is eligible for auction</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#E0E0E0]">Accepted Notice Modes</h3>
            <p className="text-xs text-[#4A4A4A] mb-3">Select all legally accepted modes of notice service:</p>
            <div className="grid grid-cols-2 gap-2">
              {noticeModes.map(mode => (
                <label key={mode} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${rules.modes.includes(mode) ? 'border-[#145A43] bg-[#E6F2ED]' : 'border-[#E0E0E0] bg-white hover:border-[#9E9E9E]'}`}>
                  <input type="checkbox" checked={rules.modes.includes(mode)} onChange={() => toggleMode(mode)} className="w-4 h-4 accent-[#145A43]" />
                  <span className="text-sm font-medium">{mode}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-[#E0E0E0]">Returned / Undelivered Notice Handling</h3>
            <p className="text-xs text-[#4A4A4A] mb-3">When a notice is returned undelivered, the system should:</p>
            <div className="flex flex-col gap-2">
              {[
                { value: 'additional', label: 'Require Additional Public Notice', desc: 'Mandate a newspaper/public notice board publication as substitute' },
                { value: 'escalate', label: 'Escalate to SHO / Legal', desc: 'Flag for manual review and decision by senior officer' },
                { value: 'block', label: 'Block Eligibility Until Resolved', desc: 'Prevent auction eligibility until notice delivery is confirmed' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${rules.returnedHandling === opt.value ? 'border-[#145A43] bg-[#E6F2ED]' : 'border-[#E0E0E0] bg-white'}`}>
                  <input type="radio" value={opt.value} checked={rules.returnedHandling === opt.value} onChange={() => update('returnedHandling')(opt.value)} className="mt-0.5 accent-[#145A43]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{opt.label}</p>
                    <p className="text-xs text-[#4A4A4A] mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Save */}
          <div className="flex items-center gap-3 justify-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-[#4A4A4A] block mb-1">Audit Note (required when saving)</label>
              <input className="w-full h-9 px-3 rounded-lg border border-[#E0E0E0] text-sm focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none" placeholder="e.g., Updated intervals per DGP circular dated 10-Sep-2025" />
            </div>
            <div className="flex gap-2 shrink-0 mt-6">
              <Btn variant="secondary">Reset to Default</Btn>
              <Btn onClick={handleSave}>Save Rules</Btn>
            </div>
          </div>
        </div>

        {/* Impact preview */}
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Rule Impact Preview</h3>
            <p className="text-xs text-[#9E9E9E] mb-4">Based on current vehicle database (142 vehicles)</p>
            <div className="flex flex-col gap-3">
              {impactData.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#4A4A4A]">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E0E0E0]">
                    <div className="h-full rounded-full" style={{ width: `${(item.count / 142) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs font-semibold text-orange-700 mb-1">⚠ Impact Warning</p>
              <p className="text-xs text-orange-600">Reducing minimum interval below 15 days may conflict with High Court directive HC-AP-2024-1122. Review legal team before saving.</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Current Rule Summary</h3>
            <div className="flex flex-col gap-2 text-sm">
              {[
                ['Notices Required', `${rules.minCount} notices`],
                ['Min Interval', `${rules.minInterval} days`],
                ['Max Interval', `${rules.maxInterval} days`],
                ['Total Duration', `${rules.totalDuration} days`],
                ['Post-Notice Wait', `${rules.waitAfterThird} days`],
                ['Accepted Modes', `${rules.modes.length} modes`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-[#E0E0E0] last:border-0">
                  <span className="text-[#4A4A4A]">{k}</span>
                  <span className="font-semibold text-[#1A1A1A]">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Recent Changes</h3>
            <div className="flex flex-col gap-2 text-xs">
              {[
                { date: '01-Sep-2025', user: 'Admin R. Sharma', change: 'Min interval 10→15 days' },
                { date: '15-Aug-2025', user: 'Admin K. Prasad', change: 'Added Newspaper as accepted mode' },
                { date: '01-Jul-2025', user: 'System', change: 'Initial configuration set' },
              ].map((c, i) => (
                <div key={i} className="p-2 rounded-lg bg-[#F7F8FA]">
                  <p className="font-medium text-[#1A1A1A]">{c.change}</p>
                  <p className="text-[#9E9E9E] mt-0.5">{c.user} · {c.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
