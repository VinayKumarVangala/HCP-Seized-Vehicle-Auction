import React, { useState } from 'react';
import { useNav } from '../nav';
import { PageHeader, Badge, Btn, Card, Tabs } from '../components/ui';

const vehicles = [
  { reg: 'TS09EA1234', make: 'Honda Activa 6G', cat: '2-Wheeler', year: '2022', color: 'Black', fuel: 'Petrol', reserve: '1,25,000', condition: 'Good' },
  { reg: 'TS05MK3456', make: 'Tata Ace Gold', cat: 'Commercial', year: '2020', color: 'White', fuel: 'Diesel', reserve: '3,50,000', condition: 'Fair' },
  { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', cat: '4-Wheeler', year: '2021', color: 'Silver', fuel: 'Petrol', reserve: '2,80,000', condition: 'Good' },
];

export default function BIDLotDetail() {
  const { navigate } = useNav();
  const [activeTab, setActiveTab] = useState('Vehicles');
  const [currentVehicle, setCurrentVehicle] = useState(0);

  return (
    <div>
      <PageHeader
        title="LOT-HYD-2025-0047"
        subtitle="Hyderabad District Lot — September 2025 · 3 Vehicles"
        breadcrumb="Browse Auctions / Lot Detail"
        actions={
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-orange-100 rounded-xl text-center">
              <p className="text-xs text-orange-600 font-medium">Auction Starts In</p>
              <p className="text-xl font-bold font-mono text-orange-700">2d 14h 32m</p>
            </div>
            <Btn variant="accent" onClick={() => navigate('bid-bidding')}>Register to Bid →</Btn>
          </div>
        }
      />

      {/* Lot summary bar */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Vehicles', value: '3' },
          { label: 'Total Reserve', value: '₹7,55,000' },
          { label: 'Bid Increment', value: '₹5,000' },
          { label: 'EMD Required', value: '₹10,000' },
          { label: 'Auction Date', value: '20-Sep-2025' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-4 border border-[#E0E0E0] text-center">
            <p className="text-xs text-[#9E9E9E] mb-1">{item.label}</p>
            <p className="text-lg font-bold text-[#1A1A1A]">{item.value}</p>
          </div>
        ))}
      </div>

      <Card className="mb-0 rounded-b-none border-b-0">
        <div className="px-4 pt-3">
          <Tabs tabs={['Vehicles', 'Inspection', 'Terms', 'Documents']} active={activeTab} onChange={setActiveTab} />
        </div>
      </Card>

      <Card className="rounded-t-none mb-6">
        {activeTab === 'Vehicles' && (
          <div className="p-5">
            {/* Vehicle carousel */}
            <div className="flex gap-3 mb-5">
              {vehicles.map((v, i) => (
                <button key={v.reg} onClick={() => setCurrentVehicle(i)} className={`flex-1 p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${currentVehicle === i ? 'border-[#145A43] bg-[#E6F2ED]' : 'border-[#E0E0E0] bg-white hover:border-[#9E9E9E]'}`}>
                  <p className="font-mono text-xs font-semibold text-[#145A43]">{v.reg}</p>
                  <p className="text-sm font-medium">{v.make}</p>
                  <Badge tone="neutral">{v.cat}</Badge>
                </button>
              ))}
            </div>

            {/* Selected vehicle detail */}
            <div className="border border-[#E0E0E0] rounded-xl p-5">
              <div className="flex gap-6">
                <div className="w-40 h-32 rounded-xl bg-gradient-to-br from-[#E6F2ED] to-[#F7F8FA] flex items-center justify-center text-6xl shrink-0">
                  {vehicles[currentVehicle].cat === '2-Wheeler' ? '🛵' : vehicles[currentVehicle].cat === 'Commercial' ? '🚛' : '🚗'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-mono text-lg font-bold">{vehicles[currentVehicle].reg}</h2>
                    <Badge tone="neutral">{vehicles[currentVehicle].cat}</Badge>
                    <Badge tone={vehicles[currentVehicle].condition === 'Good' ? 'success' : 'warning'}>{vehicles[currentVehicle].condition}</Badge>
                  </div>
                  <p className="text-base font-semibold text-[#1A1A1A] mb-3">{vehicles[currentVehicle].make}</p>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div><p className="text-xs text-[#9E9E9E]">Year</p><p className="font-medium">{vehicles[currentVehicle].year}</p></div>
                    <div><p className="text-xs text-[#9E9E9E]">Color</p><p className="font-medium">{vehicles[currentVehicle].color}</p></div>
                    <div><p className="text-xs text-[#9E9E9E]">Fuel</p><p className="font-medium">{vehicles[currentVehicle].fuel}</p></div>
                    <div><p className="text-xs text-[#9E9E9E]">Reserve Price</p><p className="font-semibold text-[#145A43] text-base">₹{vehicles[currentVehicle].reserve}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Inspection' && (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-[#E6F2ED] border border-[#145A43]/20">
                <h3 className="text-sm font-semibold text-[#145A43] mb-2">Inspection Date</h3>
                <p className="text-xl font-bold">18-Sep-2025</p>
                <p className="text-sm text-[#4A4A4A]">10:00 AM – 4:00 PM</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E0E0E0]">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">Inspection Location</h3>
                <p className="text-sm font-medium">Banjara Hills PS Yard</p>
                <p className="text-xs text-[#4A4A4A]">Road No. 12, Near Check Post, Hyderabad</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm font-semibold text-blue-700 mb-1">📋 Book Inspection Slot</p>
              <p className="text-xs text-blue-600 mb-3">Register your preferred time slot. A QR pass will be generated for entry.</p>
              <Btn variant="secondary" size="sm">Book Inspection Slot</Btn>
            </div>
          </div>
        )}

        {activeTab === 'Terms' && (
          <div className="p-5">
            <ol className="flex flex-col gap-3">
              {[
                'All vehicles are sold on "as-is, where-is" basis. No warranty or guarantee.',
                'Bidders must deposit EMD of ₹10,000 per lot before participating.',
                'The highest bidder (H1) must pay full amount within 7 working days.',
                'Failure to pay will result in EMD forfeiture and re-auction of the lot.',
                'Sale Certificate will be issued post full payment clearance.',
                'Telangana Police decision on eligibility and auction outcome is final.',
                'Any dispute shall be subject to jurisdiction of Hyderabad courts only.',
              ].map((term, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#4A4A4A]">
                  <span className="w-6 h-6 rounded-full bg-[#E6F2ED] text-[#145A43] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  {term}
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="p-5 flex flex-col gap-3">
            {['Lot Notice (PDF)', 'Auction Terms (PDF)', 'Vehicle Inspection Report', 'District Admin Approval'].map(doc => (
              <div key={doc} className="flex items-center gap-3 p-3 rounded-lg border border-[#E0E0E0]">
                <span className="text-2xl">📄</span>
                <span className="text-sm font-medium text-[#1A1A1A] flex-1">{doc}</span>
                <button className="text-xs text-[#145A43] hover:underline cursor-pointer">Download</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* EMD & Register panel */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#1A1A1A]">Ready to Bid?</h3>
            <p className="text-sm text-[#4A4A4A] mt-0.5">Pay EMD of ₹10,000 to register for this auction lot</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-[#9E9E9E]">Registration Deadline</p>
              <p className="font-semibold text-[#1A1A1A]">19-Sep-2025, 5:00 PM</p>
            </div>
            <Btn onClick={() => navigate('bid-bidding')}>Pay EMD & Register →</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
