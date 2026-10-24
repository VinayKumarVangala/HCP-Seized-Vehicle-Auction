import React, { useState } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { PageHeader, Btn, Card, Field, Select, Stepper, Badge } from '../components/ui';
import type { AuctionLot, AuctionLotVehicle } from '../api/types';

const STEPS = ['Lot Details', 'Select Vehicles', 'Pricing', 'Schedule', 'Terms', 'Review & Publish'];

const availableVehicles = [
  { reg: 'TS09EA1234', make: 'Honda Activa 6G', cat: '2-Wheeler', value: '1,25,000' },
  { reg: 'TS05MK3456', make: 'Tata Ace Gold', cat: 'Commercial', value: '3,50,000' },
  { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', cat: '4-Wheeler', value: '2,80,000' },
  { reg: 'TS12AB6655', make: 'Mahindra Bolero', cat: '4-Wheeler', value: '4,20,000' },
  { reg: 'TS04WX1122', make: 'Tata Indica eV2', cat: '4-Wheeler', value: '1,80,000' },
];

export default function AUCCreateLot() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(['TS09EA1234', 'TS05MK3456', 'TS03PQ2211']);
  const [form, setForm] = useState({
    title: 'Hyderabad District Lot — September 2025',
    description: 'Seized vehicles from Hyderabad district — mixed category',
    category: 'Mixed',
    district: 'Hyderabad',
    bidIncrement: '5,000',
    emd: '10,000',
    startDate: '',
    endDate: '',
    autoExtend: '10',
  });
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const selectedVehicles = availableVehicles.filter(v => selected.includes(v.reg));
  const totalReserve = selectedVehicles.reduce((sum, v) => sum + parseInt(v.value.replace(/,/g, '')), 0);

  const handlePublish = async () => {
    setPublishLoading(true);
    try {
      const lotData: Partial<AuctionLot> = {
        lotNumber: `LOT-${form.district.toUpperCase()}-2025-${Date.now().toString().slice(-4)}`,
        title: form.title,
        description: form.description,
        category: form.category as any,
        districtId: form.district,
        vehicles: selectedVehicles.map((v, i) => ({
          seizureId: v.reg,
          reservePrice: parseInt(v.value.replace(/,/g, '')),
          sequence: i + 1,
        })) as unknown as AuctionLotVehicle[],
        totalReservePrice: totalReserve,
        bidIncrement: parseInt(form.bidIncrement.replace(/,/g, '')),
        emdAmount: parseInt(form.emd.replace(/,/g, '')),
        startDate: form.startDate || new Date(Date.now() + 86400000).toISOString(),
        endDate: form.endDate || new Date(Date.now() + 86400000 + 7 * 3600000).toISOString(),
        autoExtendMinutes: parseInt(form.autoExtend),
        termsAndConditions: `1. All vehicles are sold on "as-is, where-is" basis.\n2. Bidders must deposit EMD of ₹${form.emd} before participating.\n3. The highest bidder (H1) must pay the full amount within 7 days.\n4. Failure to pay will result in EMD forfeiture and re-auction.\n5. Sale Certificate will be issued post full payment.\n6. Vehicles can be inspected at PS yard.\n7. Telangana Police decision on eligibility is final.`,
        createdBy: user?.id || 'system',
      };
      const created = await apiService.createLot(lotData);
      await apiService.publishLot(created.id);

      notificationService.notifyLotPublished(created.lotNumber, created.title, 'Bidder');

      navigate('auc-live-auction');
    } catch (err: any) {
      setError(err.message || 'Failed to publish lot');
      alert('Failed to publish lot: ' + (err.message || 'Unknown error'));
    } finally {
      setPublishLoading(false);
    }
  };

  const StepLotDetails = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <div className="flex items-center gap-2 p-2 bg-[#E6F2ED] rounded-lg mb-2">
          <span className="text-xs text-[#145A43]">Lot ID (Auto-generated):</span>
          <span className="font-mono text-sm font-semibold text-[#145A43]">LOT-HYD-2025-0047</span>
        </div>
      </div>
      <div className="col-span-2"><Field label="Lot Title" value={form.title} onChange={update('title')} required /></div>
      <div className="col-span-2">
        <label className="text-sm font-medium text-[#4A4A4A] block mb-1">Description</label>
        <textarea rows={3} value={form.description} onChange={e => update('description')(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-sm resize-none focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none" />
      </div>
      <Select label="Category" value={form.category} onChange={update('category')} options={[
        { value: 'Mixed', label: 'Mixed' }, { value: '2-Wheeler', label: '2-Wheeler Only' }, { value: '4-Wheeler', label: '4-Wheeler Only' }, { value: 'Commercial', label: 'Commercial Only' }
      ]} />
      <Select label="District" value={form.district} onChange={update('district')} options={[
        { value: 'Hyderabad', label: 'Hyderabad' }, { value: 'Warangal', label: 'Warangal' }, { value: 'Karimnagar', label: 'Karimnagar' }, { value: 'Rangareddy', label: 'Rangareddy' },
      ]} />
    </div>
  );

  const StepSelectVehicles = () => (
    <div>
      <p className="text-sm text-[#4A4A4A] mb-4">{selected.length} vehicles selected · Total reserve: ₹{totalReserve.toLocaleString('en-IN')}</p>
      <div className="flex flex-col gap-2">
        {availableVehicles.map(v => (
          <label key={v.reg} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selected.includes(v.reg) ? 'border-[#145A43] bg-[#E6F2ED]' : 'border-[#E0E0E0] bg-white hover:border-[#9E9E9E]'}`}>
            <input type="checkbox" checked={selected.includes(v.reg)} onChange={() => setSelected(s => s.includes(v.reg) ? s.filter(r => r !== v.reg) : [...s, v.reg])} className="w-4 h-4 accent-[#145A43]" />
            <span className="font-mono text-sm font-medium text-[#145A43]">{v.reg}</span>
            <span className="text-sm text-[#1A1A1A] flex-1">{v.make}</span>
            <Badge tone="neutral">{v.cat}</Badge>
            <span className="text-sm font-semibold text-[#1A1A1A]">₹{v.value}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const StepPricing = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#E0E0E0] mb-4">
          <p className="text-xs text-[#9E9E9E] mb-1">Total Reserve Price (sum of all vehicles)</p>
          <p className="text-2xl font-bold text-[#145A43]">₹{totalReserve.toLocaleString('en-IN')}</p>
        </div>
      </div>
      {selectedVehicles.map(v => (
        <div key={v.reg} className="col-span-2 flex items-center gap-4 p-3 rounded-lg border border-[#E0E0E0]">
          <span className="font-mono text-sm text-[#145A43]">{v.reg}</span>
          <span className="text-sm text-[#4A4A4A] flex-1">{v.make}</span>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[#9E9E9E]">Reserve Price</span>
            <input defaultValue={v.value} className="w-32 h-8 px-2 text-sm border border-[#E0E0E0] rounded-lg font-mono focus:border-[#145A43] outline-none" />
          </div>
        </div>
      ))}
      <Field label="Bid Increment (₹)" value={form.bidIncrement} onChange={update('bidIncrement')} required />
      <Field label="EMD Amount (₹)" value={form.emd} onChange={update('emd')} required />
    </div>
  );

  const StepSchedule = () => (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Auction Start Date & Time" value={form.startDate} onChange={update('startDate')} required type="datetime-local" />
      <Field label="Auction End Date & Time" value={form.endDate} onChange={update('endDate')} required type="datetime-local" />
      <Field label="Auto-Extension (minutes)" value={form.autoExtend} onChange={update('autoExtend')} />
      <div className="col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        ℹ Auto-extension: If a bid is placed in the last {form.autoExtend} minutes, the auction will automatically extend by {form.autoExtend} minutes.
      </div>
    </div>
  );

  const StepTerms = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-[#4A4A4A] block mb-1">Auction Terms & Conditions</label>
        <textarea rows={10} defaultValue={`1. All vehicles are sold on "as-is, where-is" basis.\n2. Bidders must deposit EMD of ₹${form.emd} before participating.\n3. The highest bidder (H1) must pay the full amount within 7 days.\n4. Failure to pay will result in EMD forfeiture and re-auction.\n5. Sale Certificate will be issued post full payment.\n6. Vehicles can be inspected on 18-Sep-2025 at PS yard.\n7. Telangana Police decision on eligibility is final.`} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-sm resize-none focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none" />
      </div>
      <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-6 text-center">
        <p className="text-sm text-[#9E9E9E] mb-2">Attach Terms PDF (optional)</p>
        <button className="text-xs text-[#145A43] border border-[#145A43] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E6F2ED]">Browse PDF</button>
      </div>
    </div>
  );

  const StepReview = () => (
    <div className="flex flex-col gap-4">
      {[
        { title: 'Lot Details', items: [['Lot ID', 'LOT-HYD-2025-0047', true], ['Title', form.title, false], ['District', form.district, false], ['Category', form.category, false]] },
        { title: 'Pricing', items: [['Total Reserve', `₹${totalReserve.toLocaleString('en-IN')}`, false], ['Bid Increment', `₹${form.bidIncrement}`, false], ['EMD', `₹${form.emd}`, false]] },
        { title: 'Schedule', items: [['Start', form.startDate, false], ['End', form.endDate, false], ['Auto-Extension', `${form.autoExtend} minutes`, false]] },
      ].map(section => (
        <div key={section.title} className="border border-[#E0E0E0] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F7F8FA] border-b border-[#E0E0E0]">
            <p className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide">{section.title}</p>
          </div>
          <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
            {section.items.map(([k, v, mono]) => (
              <div key={k as string}>
                <p className="text-xs text-[#9E9E9E]">{k}</p>
                <p className={`text-sm font-medium text-[#1A1A1A] ${mono ? 'font-mono' : ''}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="border border-[#E0E0E0] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-[#F7F8FA] border-b border-[#E0E0E0]">
          <p className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide">Vehicles ({selectedVehicles.length})</p>
        </div>
        <div className="divide-y divide-[#E0E0E0]">
          {selectedVehicles.map(v => (
            <div key={v.reg} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="font-mono text-[#145A43]">{v.reg}</span>
              <span className="flex-1 text-[#4A4A4A]">{v.make}</span>
              <Badge tone="neutral">{v.cat}</Badge>
              <span className="font-semibold">₹{v.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const steps = [StepLotDetails, StepSelectVehicles, StepPricing, StepSchedule, StepTerms, StepReview];
  const StepContent = steps[step];

  return (
    <div>
      <PageHeader
        title="Create Auction Lot"
        subtitle="Bundle eligible vehicles into an auction lot"
        breadcrumb="Home / Eligible Vehicles / Create Lot"
        actions={<Btn variant="ghost" onClick={() => navigate('auc-eligible')}>← Back</Btn>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Card className="p-6 mb-6 overflow-x-auto">
        <Stepper steps={STEPS} current={step} />
      </Card>

      <Card className="p-6 mb-4">
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-5 pb-3 border-b border-[#E0E0E0]">
          Step {step + 1}: {STEPS[step]}
        </h2>
        <StepContent />
      </Card>

      <div className="flex items-center justify-between">
        <Btn variant="ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('auc-eligible')}>
          ← {step > 0 ? 'Back' : 'Cancel'}
        </Btn>
        <div className="flex gap-3">
          <Btn variant="secondary">Save Draft</Btn>
          {step < STEPS.length - 1 ? (
            <Btn onClick={() => setStep(s => s + 1)}>Next →</Btn>
          ) : (
            <Btn variant="accent" onClick={handlePublish} disabled={publishLoading}>
              {publishLoading ? 'Publishing...' : '🚀 Publish Lot'}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}