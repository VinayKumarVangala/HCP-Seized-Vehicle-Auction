import React, { useState } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { PageHeader, Btn, Card, Field, Select, Stepper } from '../components/ui';
import type { Seizure, Vehicle } from '../api/types';

const STEPS = ['Vehicle Details', 'Seizure Details', 'Owner & RTA', 'Documents', 'Valuation', 'Review & Submit'];

const fuelOptions = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'cng', label: 'CNG' },
];

export default function PSNewSeizure() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    regNo: '',
    chassisNo: '',
    engineNo: '',
    make: '',
    model: '',
    year: '2022',
    type: '2-Wheeler',
    color: '',
    fuel: 'petrol',
    odometer: '',
    memoNo: '',
    seizureDate: '',
    place: '',
    firNo: '',
    category: 'crime',
    custody: 'PS Yard - Banjara Hills',
    condition: '',
    keys: 'Yes',
    ownerName: '',
    ownerMobile: '',
    ownerAddress: '',
    estValue: '',
    valuationOfficer: '',
    valuationDate: '',
  });
  const [vahanLoading, setVahanLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [vahanData, setVahanData] = useState<any>(null);
  const [cctnsLoading, setCctnsLoading] = useState(false);

  const update = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const fetchFromVAHAN = async () => {
    if (!form.regNo) return;
    setVahanLoading(true);
    try {
      const data = await apiService.vahanLookup(form.regNo);
      setVahanData(data);
      // Auto-fill from VAHAN
      setForm(f => ({
        ...f,
        make: data.makerModel?.split(' ')[0] || f.make,
        model: data.makerModel?.split(' ').slice(1).join(' ') || f.model,
        year: data.yearOfManufacture || f.year,
        fuel: (data.fuel as any) || f.fuel,
        color: f.color,
        ownerName: data.ownerName || f.ownerName,
        ownerAddress: data.address || f.ownerAddress,
      }));
    } catch (err: any) {
      alert('VAHAN lookup failed: ' + (err.message || 'Unknown error'));
    } finally {
      setVahanLoading(false);
    }
  };

  const checkCCTNS = async () => {
    if (!form.firNo) return;
    setCctnsLoading(true);
    try {
      const data = await apiService.cctnsCheck(form.firNo);
      console.log('CCTNS:', data);
      if (data.courtStay) {
        alert('Court stay order found for this FIR. Vehicle cannot be auctioned.');
      }
    } catch (err: any) {
      console.warn('CCTNS check failed:', err.message);
    } finally {
      setCctnsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const seizure: Partial<Seizure> = {
        vehicleId: 'temp', // will be set by backend
        memoNo: form.memoNo,
        seizureDate: form.seizureDate,
        seizureTime: new Date().toTimeString().slice(0, 5),
        place: form.place,
        firNo: form.firNo,
        category: form.category === 'crime' ? 'Crime Vehicle' : 'Victim Vehicle',
        custodyLocation: form.custody,
        conditionNotes: form.condition,
        keysAvailable: form.keys === 'Yes',
        createdBy: user?.id || 'system',
      };
      const created = await apiService.createSeizure(seizure);

      // Notify SHO in real-time
      notificationService.notifySeizureCreated(created.id, created.vehicle.registrationNo, 'SHO');

      navigate('ps-vehicle-detail');
    } catch (err: any) {
      alert('Failed to submit seizure: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const StepVehicleDetails = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <div className="flex gap-2 items-end">
          <div className="flex-1"><Field label="Registration Number" value={form.regNo} onChange={update('regNo')} required mono /></div>
          <Btn variant="secondary" size="sm" onClick={fetchFromVAHAN} disabled={vahanLoading}>
            {vahanLoading ? 'Fetching...' : 'Fetch from VAHAN'}
          </Btn>
        </div>
      </div>
      <Field label="Chassis Number" value={form.chassisNo} onChange={update('chassisNo')} required mono />
      <Field label="Engine Number" value={form.engineNo} onChange={update('engineNo')} required mono />
      <Field label="Make / Manufacturer" value={form.make} onChange={update('make')} required />
      <Field label="Model" value={form.model} onChange={update('model')} required />
      <Field label="Year of Manufacture" value={form.year} onChange={update('year')} required />
      <Select label="Vehicle Type" value={form.type} onChange={update('type')} required options={[
        { value: '2-Wheeler', label: '2-Wheeler' },
        { value: '4-Wheeler', label: '4-Wheeler' },
        { value: 'Commercial', label: 'Commercial' },
        { value: 'Other', label: 'Other' },
      ]} />
      <Field label="Color" value={form.color} onChange={update('color')} required />
      <Select label="Fuel Type" value={form.fuel} onChange={update('fuel')} required options={fuelOptions} />
      <Field label="Odometer Reading (km)" value={form.odometer} onChange={update('odometer')} />
    </div>
  );

  const StepSeizureDetails = () => (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Seizure Memo Number" value={form.memoNo} onChange={update('memoNo')} required />
      <Field label="Date & Time of Seizure" value={form.seizureDate} onChange={update('seizureDate')} required type="datetime-local" />
      <div className="col-span-2"><Field label="Place of Seizure" value={form.place} onChange={update('place')} required /></div>
      <Field label="Case / FIR Number" value={form.firNo} onChange={e => { update('firNo')(e); checkCCTNS(); }} required mono />
      <Field label="Investigating Officer" value={user?.name || 'Sub-Inspector T. Venkat Rao'} readOnly />
      <Field label="Police Station" value={user?.station || 'Banjara Hills PS'} readOnly />
      <Field label="District" value={user?.district || 'Hyderabad'} readOnly />
      <div className="col-span-2">
        <p className="text-sm font-medium text-[#4A4A4A] mb-2">Vehicle Category <span className="text-[#C62828]">*</span></p>
        <div className="flex gap-4">
          {[{ value: 'crime', label: 'Crime Vehicle', desc: 'Vehicle used in commission of offence' },
            { value: 'victim', label: 'Victim Vehicle', desc: 'Vehicle stolen or victim\'s property' }].map(opt => (
            <label key={opt.value} className="flex items-start gap-2 cursor-pointer flex-1 p-3 rounded-lg border-2 transition-colors" style={{ borderColor: form.category === opt.value ? '#145A43' : '#E0E0E0', backgroundColor: form.category === opt.value ? '#E6F2ED' : 'white' }}>
              <input type="radio" value={opt.value} checked={form.category === opt.value} onChange={() => update('category')(opt.value)} className="mt-0.5 accent-[#145A43]" />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{opt.label}</p>
                <p className="text-xs text-[#4A4A4A] mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <Select label="Custody Location" value={form.custody} onChange={update('custody')} required options={[
        { value: 'PS Yard - Banjara Hills', label: 'PS Yard — Banjara Hills' },
        { value: 'Central Impound', label: 'Central Impound — GHMC' },
      ]} />
      <Select label="Keys Available" value={form.keys} onChange={update('keys')} required options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
      <div className="col-span-2"><Field label="Condition Notes" value={form.condition} onChange={update('condition')} /></div>
    </div>
  );

  const StepOwnerRTA = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-700 mb-2">
          <span>ℹ</span> Owner details auto-fetched from VAHAN database. Verify and confirm.
        </div>
      </div>
      <Field label="Owner Name" value={form.ownerName} onChange={update('ownerName')} required />
      <Field label="Mobile Number" value={form.ownerMobile} onChange={update('ownerMobile')} required />
      <div className="col-span-2"><Field label="Registered Address" value={form.ownerAddress} onChange={update('ownerAddress')} required /></div>
      <Field label="RC Status" value="Active" readOnly />
      <Field label="Insurance Validity" value={vahanData?.insuranceValidity || '31-Dec-2025'} readOnly />
      <Field label="Fitness Certificate" value={vahanData?.fitnessValidity || 'Valid till 08-Mar-2026'} readOnly />
      <Field label="Hypothecation" value={vahanData?.hypothecation || 'None'} readOnly />
      <div className="col-span-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#145A43]" />
          <span className="text-sm font-medium text-[#1A1A1A]">Mark as verified — details match RC document</span>
        </label>
      </div>
      <Field label="Verification Source" value="VAHAN API + Physical RC" />
      <Field label="Reference Number" value={vahanData?.reference || 'VAHAN-2025-11234'} mono />
    </div>
  );

  const StepDocuments = () => (
    <div className="flex flex-col gap-4">
      {[
        { name: 'Seizure Memo', required: true, status: 'pending' },
        { name: 'RC Copy', required: false, status: 'pending' },
        { name: 'Insurance Certificate', required: false, status: 'pending' },
        { name: 'Vehicle Photos (min. 4)', required: true, status: 'pending' },
        { name: 'FIR Copy', required: true, status: 'pending' },
        { name: 'Permit / NOC', required: false, status: 'pending' },
        { name: 'Other Documents', required: false, status: 'pending' },
      ].map(doc => (
        <div key={doc.name} className="flex items-center gap-4 p-4 border border-[#E0E0E0] rounded-xl bg-white">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${doc.status === 'uploaded' ? 'bg-green-100' : 'bg-[#F7F8FA]'}`}>
            {doc.status === 'uploaded' ? '📄' : '📁'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1A1A1A]">{doc.name}{doc.required && <span className="text-[#C62828] ml-1">*</span>}</p>
            <p className="text-xs text-[#9E9E9E] mt-0.5">{doc.status === 'uploaded' ? 'Uploaded successfully' : 'No file uploaded'}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${doc.status === 'uploaded' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {doc.status === 'uploaded' ? '✓ Uploaded' : '⏳ Pending'}
          </span>
          <button className="text-xs text-[#145A43] hover:underline cursor-pointer border border-[#145A43] px-3 py-1.5 rounded-lg">Upload</button>
        </div>
      ))}
    </div>
  );

  const StepValuation = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Field label="Estimated Market Value (₹)" value={form.estValue} onChange={update('estValue')} required />
      </div>
      <Field label="Valuation Officer" value={form.valuationOfficer || (user?.name || 'Sub-Inspector T. Venkat Rao')} onChange={update('valuationOfficer')} required />
      <Field label="Valuation Date" value={form.valuationDate || new Date().toISOString().split('T')[0]} onChange={update('valuationDate')} required />
      <div className="col-span-2">
        <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-8 text-center">
          <p className="text-[#9E9E9E] text-sm mb-2">Drag & drop valuation report PDF</p>
          <button className="text-xs text-[#145A43] hover:underline cursor-pointer border border-[#145A43] px-4 py-2 rounded-lg">Choose File</button>
        </div>
      </div>
      <div className="col-span-2">
        <label className="text-sm font-medium text-[#4A4A4A] block mb-1">Remarks</label>
        <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] text-sm focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none resize-none" placeholder="Additional valuation notes..." />
      </div>
    </div>
  );

  const StepReview = () => (
    <div className="flex flex-col gap-4">
      {[
        { title: 'Vehicle Details', items: [['Registration No', form.regNo, true], ['Chassis No', form.chassisNo, true], ['Make / Model', `${form.make} ${form.model}`, false], ['Year', form.year, false], ['Fuel', form.fuel, false]] },
        { title: 'Seizure Details', items: [['Memo No', form.memoNo, true], ['Date', form.seizureDate, false], ['FIR No', form.firNo, true], ['Category', form.category === 'crime' ? 'Crime Vehicle' : 'Victim Vehicle', false], ['Station', form.custody, false]] },
        { title: 'Owner & RTA', items: [['Owner Name', form.ownerName, false], ['Mobile', form.ownerMobile, false], ['Address', form.ownerAddress, false], ['RC Status', 'Active', false]] },
        { title: 'Valuation', items: [['Estimated Value', `₹${form.estValue}`, false], ['Valuation Officer', form.valuationOfficer, false], ['Valuation Date', form.valuationDate, false]] },
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
      <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl border border-[#145A43] bg-[#E6F2ED]">
        <input type="checkbox" className="w-4 h-4 accent-[#145A43] mt-0.5" />
        <span className="text-sm text-[#145A43] font-medium">I confirm that all the above details are accurate and the documents uploaded are genuine.</span>
      </label>
    </div>
  );

  const stepComponents = [StepVehicleDetails, StepSeizureDetails, StepOwnerRTA, StepDocuments, StepValuation, StepReview];
  const CurrentStep = stepComponents[step];

  return (
    <div>
      <PageHeader
        title="New Seizure Entry"
        subtitle="Register a newly seized vehicle"
        breadcrumb="Home / My Vehicles / New Seizure"
        actions={<Btn variant="ghost" onClick={() => navigate('ps-vehicle-list')}>← Back to List</Btn>}
      />

      {/* Stepper */}
      <Card className="p-6 mb-6 overflow-x-auto">
        <Stepper steps={STEPS} current={step} />
      </Card>

      {/* Step content */}
      <Card className="p-6 mb-4">
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-5 pb-3 border-b border-[#E0E0E0]">
          Step {step + 1}: {STEPS[step]}
        </h2>
        <CurrentStep />
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Btn variant="ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('ps-vehicle-list')}>
          ← {step > 0 ? 'Back' : 'Cancel'}
        </Btn>
        <div className="flex gap-3">
          <Btn variant="secondary">Save Draft</Btn>
          {step < STEPS.length - 1 ? (
            <Btn onClick={() => setStep(s => s + 1)}>Next →</Btn>
          ) : (
            <Btn onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit for SHO Approval ✓'}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}