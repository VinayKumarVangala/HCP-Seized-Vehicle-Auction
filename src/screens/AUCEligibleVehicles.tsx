import React, { useState, useEffect } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { PageHeader, Badge, EligibilityChip, Btn, Card, KPICard, FilterBar, Table } from '../components/ui';

const initialVehicles = [
  { reg: 'TS09EA1234', make: 'Honda Activa 6G', cat: '2-Wheeler', ps: 'Banjara Hills', district: 'Hyderabad', value: '1,25,000', clearanceDate: '12-Sep-2025', blocked: false },
  { reg: 'TS05MK3456', make: 'Tata Ace Gold', cat: 'Commercial', ps: 'Secunderabad', district: 'Hyderabad', value: '3,50,000', clearanceDate: '10-Sep-2025', blocked: false },
  { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', cat: '4-Wheeler', ps: 'Banjara Hills', district: 'Hyderabad', value: '2,80,000', clearanceDate: '08-Sep-2025', blocked: false },
  { reg: 'TS12AB6655', make: 'Mahindra Bolero', cat: '4-Wheeler', ps: 'Secunderabad', district: 'Hyderabad', value: '4,20,000', clearanceDate: '06-Sep-2025', blocked: false },
  { reg: 'TS04WX1122', make: 'Tata Indica eV2', cat: '4-Wheeler', ps: 'Charminar', district: 'Hyderabad', value: '1,80,000', clearanceDate: '05-Sep-2025', blocked: false },
  { reg: 'TS07CD9012', make: 'Bajaj Pulsar 150', cat: '2-Wheeler', ps: 'Kukatpally', district: 'Hyderabad', value: '65,000', clearanceDate: null, blocked: true, blockReason: '3 notices not completed. 2/3 sent. Interval exceeded 45 days.' },
  { reg: 'TS11XY7890', make: 'Royal Enfield Classic 350', cat: '2-Wheeler', ps: 'Charminar', district: 'Hyderabad', value: '1,05,000', clearanceDate: null, blocked: true, blockReason: 'No notices sent. Legal clearance pending.' },
];

export default function AUCEligibleVehicles() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [tooltipReg, setTooltipReg] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const res = await apiService.getSeizures({ status: 'Auction Ready' });
        setVehicles(res.data.map((s: any) => ({
          reg: s.vehicle.registrationNo,
          make: `${s.vehicle.make} ${s.vehicle.model}`,
          cat: s.vehicle.category,
          ps: s.policeStation.name,
          district: s.district.name,
          value: '1,25,000',
          clearanceDate: s.updatedAt,
          blocked: s.status !== 'Auction Ready',
          blockReason: s.status !== 'Auction Ready' ? 'Not yet cleared for auction' : undefined,
        })));
      } catch (err: any) {
        setError(err.message || 'Failed to load eligible vehicles');
        console.warn('Using mock data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, [user?.role]);

  const eligible = vehicles.filter(v => !v.blocked);
  const blocked = vehicles.filter(v => v.blocked);

  const toggleSelect = (reg: string, isBlocked: boolean) => {
    if (isBlocked) return;
    setSelected(s => s.includes(reg) ? s.filter(r => r !== reg) : [...s, reg]);
  };

  return (
    <div>
      <PageHeader
        title="Eligible Vehicles"
        subtitle="Vehicles cleared for auction lot creation"
        breadcrumb="Home / Eligible Vehicles"
        actions={
          <Btn onClick={() => navigate('auc-create-lot')} disabled={selected.length === 0}>
            + Add {selected.length > 0 ? `${selected.length} ` : ''}to Lot
          </Btn>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          {error} (Using demo data)
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Eligible Vehicles" value={eligible.length} delta="Ready for auction" tone="success" />
        <KPICard title="Active Lots" value="3" delta="2 upcoming, 1 live" tone="neutral" />
        <KPICard title="Blocked Vehicles" value={blocked.length} delta="Awaiting compliance" tone="warning" />
        <KPICard title="Revenue This Month" value="₹28.5L" delta="↑ 18% vs last month" tone="neutral" />
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-4 p-4 mb-4 bg-[#E6F2ED] border border-[#145A43]/20 rounded-xl">
          <span className="text-sm font-medium text-[#145A43]">{selected.length} vehicles selected</span>
          <div className="flex gap-3 ml-auto">
            <Btn size="sm" onClick={() => navigate('auc-create-lot')}>+ Create Lot with Selected</Btn>
            <button onClick={() => setSelected([])} className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A] cursor-pointer">Clear</button>
          </div>
        </div>
      )}

      <Card className="mb-4">
        <div className="px-5 py-4 border-b border-[#E0E0E0] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#145A43]" />
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Eligible for Auction ({eligible.length})</h3>
        </div>
        <FilterBar />
        <Table headers={['', 'Reg No', 'Make / Model', 'Category', 'PS', 'District', 'Reserve Value', 'Clearance Date', 'Action']}>
          {vehicles.map(row => (
            <tr key={row.reg} className={`transition-colors ${row.blocked ? 'bg-red-50/50 opacity-75' : 'hover:bg-[#F7F8FA]'}`}>
              <td className="px-4 py-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.reg)}
                    onChange={() => toggleSelect(row.reg, row.blocked)}
                    disabled={row.blocked}
                    className="w-4 h-4 accent-[#145A43] cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-sm font-medium text-[#145A43]">{row.reg}</td>
              <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">{row.make}</td>
              <td className="px-4 py-3"><Badge tone="neutral">{row.cat}</Badge></td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{row.ps}</td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{row.district}</td>
              <td className="px-4 py-3 text-sm font-semibold text-[#1A1A1A]">₹{row.value}</td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{row.clearanceDate || '—'}</td>
              <td className="px-4 py-3">
                {row.blocked ? (
                  <div className="relative inline-block">
                    <button
                      onMouseEnter={() => setTooltipReg(row.reg)}
                      onMouseLeave={() => setTooltipReg(null)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg cursor-help"
                    >
                      🔒 Blocked
                    </button>
                    {tooltipReg === row.reg && (
                      <div className="absolute right-0 bottom-full mb-1 w-56 bg-[#1A1A1A] text-white text-xs p-2 rounded-lg z-10 shadow-xl">
                        {row.blockReason}
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => { setSelected(s => [...new Set([...s, row.reg])]); navigate('auc-create-lot'); }} className="text-xs text-[#145A43] hover:underline cursor-pointer border border-[#145A43] px-3 py-1.5 rounded-lg">Add to Lot</button>
                )}
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-3 text-center text-[#9E9E9E]">No vehicles found</td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}