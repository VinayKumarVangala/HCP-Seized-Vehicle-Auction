import React, { useState, useEffect } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { notificationService } from '../api/notifications';
import { PageHeader, Badge, NoticeTracker, EligibilityChip, Btn, Card, Table, FilterBar } from '../components/ui';
import type { Vehicle } from '../api/types';

const initialVehicles = [
  { reg: 'TS09EA1234', make: 'Honda Activa 6G', cat: '2-Wheeler', date: '08-Sep-2025', ps: 'Banjara Hills', notices: 3, eligibility: 'Eligible' as const },
  { reg: 'TS10UB5678', make: 'Maruti Suzuki Swift', cat: '4-Wheeler', date: '05-Sep-2025', ps: 'Begumpet', notices: 2, eligibility: 'Pending' as const },
  { reg: 'TS07CD9012', make: 'Bajaj Pulsar 150', cat: '2-Wheeler', date: '01-Sep-2025', ps: 'Kukatpally', notices: 1, eligibility: 'Pending' as const },
  { reg: 'TS05MK3456', make: 'Tata Ace Gold', cat: 'Commercial', date: '28-Aug-2025', ps: 'Secunderabad', notices: 3, eligibility: 'Eligible' as const },
  { reg: 'TS11XY7890', make: 'Royal Enfield Classic 350', cat: '2-Wheeler', date: '25-Aug-2025', ps: 'Charminar', notices: 0, eligibility: 'Blocked' as const },
  { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', cat: '4-Wheeler', date: '20-Aug-2025', ps: 'Banjara Hills', notices: 3, eligibility: 'Eligible' as const },
  { reg: 'TS08LR4433', make: 'TVS Jupiter', cat: '2-Wheeler', date: '18-Aug-2025', ps: 'Begumpet', notices: 2, eligibility: 'Under Review' as const },
  { reg: 'TS12AB6655', make: 'Mahindra Bolero', cat: '4-Wheeler', date: '12-Aug-2025', ps: 'Secunderabad', notices: 3, eligibility: 'Eligible' as const },
  { reg: 'TS06GH8877', make: 'Yamaha FZ-S', cat: '2-Wheeler', date: '10-Aug-2025', ps: 'Kukatpally', notices: 1, eligibility: 'Pending' as const },
  { reg: 'TS04WX1122', make: 'Tata Indica eV2', cat: '4-Wheeler', date: '05-Aug-2025', ps: 'Charminar', notices: 3, eligibility: 'Eligible' as const },
];

export default function PSVehicleList() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [total, setTotal] = useState(142);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        const res = await apiService.getVehicles({ page: 1, pageSize: 50, search: query });
        setVehicles(res.data);
        setTotal(res.total);
      } catch (err: any) {
        setError(err.message || 'Failed to load vehicles');
        console.warn('Using mock data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, [query, user?.role]);

  const filtered = vehicles.filter(v =>
    (v.registrationNo || v.reg || '').toLowerCase().includes(query.toLowerCase()) ||
    (v.make || '').toLowerCase().includes(query.toLowerCase())
  );

  const toggleSelect = (reg: string) => {
    setSelected(s => s.includes(reg) ? s.filter(r => r !== reg) : [...s, reg]);
  };

  return (
    <div>
      <PageHeader
        title="Vehicle Seizure Registry"
        subtitle={user?.station ? `All seized vehicles — ${user.station}` : 'Banjara Hills PS — All seized vehicles'}
        breadcrumb="Home / My Vehicles"
        actions={<Btn onClick={() => navigate('ps-new-seizure')}>＋ New Seizure</Btn>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          {error} (Using demo data)
        </div>
      )}

      <FilterBar onSearch={setQuery} />

      {selected.length > 0 && (
        <div className="flex items-center gap-4 p-4 mb-4 bg-[#E6F2ED] border border-[#145A43]/20 rounded-xl">
          <span className="text-sm font-medium text-[#145A43]">{selected.length} selected</span>
          <div className="flex gap-3 ml-auto">
            <Btn variant="secondary" size="sm">Assign Officer</Btn>
            <Btn variant="secondary" size="sm">Export CSV</Btn>
            <Btn size="sm">Request Approval</Btn>
            <button onClick={() => setSelected([])} className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A] cursor-pointer">Clear</button>
          </div>
        </div>
      )}

      <Card>
        <Table headers={['', 'Reg No', 'Make / Model', 'Category', 'Seizure Date', 'Station', 'Notices', 'Eligibility', 'Actions']}>
          {filtered.map(v => (
            <tr key={v.registrationNo || v.reg} className="hover:bg-[#F7F8FA] transition-colors">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.includes(v.registrationNo || v.reg)}
                  onChange={() => toggleSelect(v.registrationNo || v.reg)}
                  className="w-4 h-4 accent-[#145A43] cursor-pointer"
                />
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-sm font-medium text-[#145A43]">{v.registrationNo || v.reg}</span>
              </td>
              <td className="px-4 py-3 text-sm text-[#1A1A1A] font-medium">{v.make || `${v.make} ${v.model}`}</td>
              <td className="px-4 py-3"><Badge tone="neutral">{v.category || v.cat}</Badge></td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{v.registrationDate || v.date}</td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{v.ps}</td>
              <td className="px-4 py-3"><NoticeTracker sent={2} /></td>
              <td className="px-4 py-3"><EligibilityChip status="Eligible" /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <button onClick={() => navigate('ps-vehicle-detail')} className="text-xs text-[#145A43] hover:underline cursor-pointer">View</button>
                  <span className="text-[#E0E0E0]">·</span>
                  <button className="text-xs text-[#145A43] hover:underline cursor-pointer">Edit</button>
                  <span className="text-[#E0E0E0]">·</span>
                  <button onClick={() => navigate('ps-notice-tracking')} className="text-xs text-[#145A43] hover:underline cursor-pointer">Notice</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E0E0E0]">
          <span className="text-sm text-[#9E9E9E]">Showing {filtered.length} of {total} vehicles</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg text-[#4A4A4A] hover:bg-[#F7F8FA] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">← Prev</button>
            {[1, 2, 3, '...', Math.ceil(total / 10)].map((p, i) => (
              <button key={i} className={`px-3 py-1.5 text-xs border rounded-lg cursor-pointer ${p === 1 ? 'bg-[#145A43] text-white border-[#145A43]' : 'border-[#E0E0E0] text-[#4A4A4A] hover:bg-[#F7F8FA]'}`}>{p}</button>
            ))}
            <button className="px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg text-[#4A4A4A] hover:bg-[#F7F8FA] cursor-pointer">Next →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}