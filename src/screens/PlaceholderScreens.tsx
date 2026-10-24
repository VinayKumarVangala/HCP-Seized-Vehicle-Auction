import React, { useEffect, useState } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { PageHeader, KPICard, Card, Btn, Badge, Table } from '../components/ui';

export function SHODashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [kpis, setKpis] = useState<any>({ pendingApprovals: 12, noticeNonCompliance: 5, eligibleForAuction: 8, approvedThisMonth: 34 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getKPIs(user?.role || 'SHO').then(res => setKpis(res)).catch(() => {}).finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) return (
    <div className="flex h-full items-center justify-center"><div className="w-8 h-8 border-2 border-[#145A43] border-t-transparent rounded-full animate-spin" /></div>
  );

  return (
    <div>
      <PageHeader title="SHO Dashboard" subtitle={`${user?.name || 'Inspector G. Srinivas'} — Banjara Hills PS`} breadcrumb="Home / Dashboard"
        actions={<Btn onClick={() => navigate('sho-approval-queue')}>View Approval Queue →</Btn>} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Pending Approvals" value={kpis.pendingApprovals} delta="3 high priority" tone="warning" />
        <KPICard title="Notice Non-Compliance" value={kpis.noticeNonCompliance} delta="Overdue" tone="error" />
        <KPICard title="Eligible for Auction" value={kpis.eligibleForAuction} tone="success" />
        <KPICard title="Approved This Month" value={kpis.approvedThisMonth} tone="neutral" />
      </div>
      <Card className="p-8 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-lg font-semibold text-[#1A1A1A]">Approval Queue Awaits</p>
        <p className="text-sm text-[#4A4A4A] mb-4">{kpis.pendingApprovals} vehicles pending your review and approval</p>
        <Btn onClick={() => navigate('sho-approval-queue')}>Go to Approval Queue →</Btn>
      </Card>
    </div>
  );
}

export function LegalDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Legal Dashboard" subtitle={user?.name || 'Legal Officer P. Rao'} breadcrumb="Home / Dashboard" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Pending Legal Clearance" value="7" delta="3 urgent" tone="warning" />
        <KPICard title="Court Stays Active" value="3" tone="error" />
        <KPICard title="Claims Received" value="12" tone="neutral" />
        <KPICard title="Cleared This Month" value="18" tone="success" />
      </div>
      <Card className="p-8 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">⚖</div>
        <p className="text-lg font-semibold text-[#1A1A1A]">Legal Review Portal</p>
        <p className="text-sm text-[#4A4A4A]">Case details, court orders, stays, and claims management</p>
      </Card>
    </div>
  );
}

export function AUCDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Auction Cell Dashboard" subtitle="District Auction Cell — Hyderabad" breadcrumb="Home / Dashboard"
        actions={<Btn onClick={() => navigate('auc-eligible')}>View Eligible Vehicles →</Btn>} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Eligible Vehicles" value="58" tone="success" />
        <KPICard title="Active Lots" value="3" tone="neutral" />
        <KPICard title="Upcoming Auctions" value="2" tone="neutral" />
        <KPICard title="Revenue This Month" value="₹28.5L" tone="neutral" />
      </div>
      <Card className="p-8 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">🔨</div>
        <p className="text-lg font-semibold text-[#1A1A1A]">Auction Management</p>
        <p className="text-sm text-[#4A4A4A] mb-4">Create lots, schedule auctions, manage live bidding</p>
        <div className="flex gap-3">
          <Btn variant="secondary" onClick={() => navigate('auc-eligible')}>Eligible Vehicles</Btn>
          <Btn onClick={() => navigate('auc-live-auction')}>Go Live →</Btn>
        </div>
      </Card>
    </div>
  );
}

export function AUCSaleConfirmation() {
  const { navigate } = useNav();
  return (
    <div>
      <PageHeader title="Sale Confirmation" subtitle="LOT-HYD-2025-0047 · Auction Closed" breadcrumb="Home / Live Auction / Sale Confirmation"
        actions={<Btn variant="ghost" onClick={() => navigate('auc-live-auction')}>← Back to Auction</Btn>} />
      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-[#E6F2ED] border border-[#145A43]/20 rounded-2xl mb-6 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-xs uppercase tracking-widest text-[#9E9E9E] mb-1">Highest Bidder (H1)</p>
          <p className="text-2xl font-bold text-[#145A43]">₹1,90,000</p>
          <p className="text-base font-semibold mt-1">BID-0247 — A.K. Traders</p>
          <p className="text-sm text-[#4A4A4A] mt-0.5">KYC Verified · EMD: ₹10,000 (deducted)</p>
        </div>
        <Card className="p-5 mb-4">
          <h3 className="font-semibold mb-3">Payment Due</h3>
          <div className="flex justify-between text-sm mb-1"><span className="text-[#4A4A4A]">Lot Sale Amount</span><span className="font-semibold">₹1,90,000</span></div>
          <div className="flex justify-between text-sm mb-1"><span className="text-[#4A4A4A]">Less: EMD Deposited</span><span className="font-semibold text-[#C62828]">− ₹10,000</span></div>
          <div className="h-px bg-[#E0E0E0] my-2" />
          <div className="flex justify-between text-base font-bold"><span>Balance Due</span><span className="text-[#145A43]">₹1,80,000</span></div>
          <p className="text-xs text-[#9E9E9E] mt-2">Due within 7 working days — by 27-Sep-2025</p>
        </Card>
        <div className="flex gap-3">
          <Btn className="flex-1">Generate Sale Certificate</Btn>
          <Btn variant="secondary" className="flex-1">Issue Delivery Order</Btn>
          <Btn variant="ghost">Mark Unsold</Btn>
        </div>
      </div>
    </div>
  );
}

export function FINDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Finance Dashboard" subtitle="Finance Officer — Hyderabad Division" breadcrumb="Home / Dashboard" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="EMD Collected" value="₹4.2L" tone="neutral" />
        <KPICard title="Sale Proceeds" value="₹28.5L" tone="success" />
        <KPICard title="Refunds Pending" value="₹85,000" tone="warning" />
        <KPICard title="Reconciled Today" value="₹1.2L" tone="neutral" />
      </div>
      <Card className="p-8 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">💰</div>
        <p className="text-lg font-semibold text-[#1A1A1A]">Finance Management</p>
        <p className="text-sm text-[#4A4A4A]">Payments, EMD, refunds, and revenue reconciliation</p>
      </Card>
    </div>
  );
}

export function ADMDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="System Administrator" subtitle="Admin — Telangana Police SVAMS" breadcrumb="Home / Dashboard" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Active Users" value="247" tone="neutral" />
        <KPICard title="Vehicles in System" value="1,842" tone="neutral" />
        <KPICard title="Auctions Run" value="34" tone="success" />
        <KPICard title="System Health" value="99.8%" tone="success" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'User Management', desc: 'Create, edit, and manage officer accounts', screen: 'adm-users', icon: '👥' },
          { title: 'Notice Rules', desc: 'Configure compliance rules and intervals', screen: 'adm-notice-rules', icon: '📏' },
          { title: 'Master Data', desc: 'Districts, stations, courts, vehicle types', screen: 'adm-dashboard', icon: '🗂' },
          { title: 'Integrations', desc: 'VAHAN, CCTNS, Payment, e-Sign status', screen: 'adm-dashboard', icon: '🔌' },
          { title: 'Audit Log', desc: 'Complete system activity trail', screen: 'adm-dashboard', icon: '📋' },
          { title: 'System Config', desc: 'Application settings and parameters', screen: 'adm-dashboard', icon: '⚙' },
        ].map(item => (
          <button key={item.title} onClick={() => navigate(item.screen as any)} className="p-5 bg-white rounded-xl border border-[#E0E0E0] hover:border-[#145A43] hover:shadow-md transition-all text-left cursor-pointer group">
            <div className="text-3xl mb-3">{item.icon}</div>
            <p className="font-semibold text-[#1A1A1A] group-hover:text-[#145A43]">{item.title}</p>
            <p className="text-sm text-[#4A4A4A] mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ADMUsers() {
  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage officer accounts and roles" breadcrumb="Home / Admin / Users"
        actions={<Btn>+ Create User</Btn>} />
      <Card>
        <Table headers={['Name', 'User ID', 'Role', 'Station', 'Status', 'Last Login', 'Action']}>
          {[
            { name: 'SI T. Venkat Rao', id: 'TS-PS-0312', role: 'PS', station: 'Banjara Hills', status: 'Active', login: '11-Sep-2025' },
            { name: 'Inspector G. Srinivas', id: 'TS-SHO-0087', role: 'SHO', station: 'Banjara Hills', status: 'Active', login: '11-Sep-2025' },
            { name: 'Legal Officer P. Rao', id: 'TS-LEG-0024', role: 'Legal', station: 'District HQ', status: 'Active', login: '10-Sep-2025' },
            { name: 'Auc. Cell K. Sharma', id: 'TS-AUC-0011', role: 'AuctionCell', station: 'Hyderabad', status: 'Active', login: '11-Sep-2025' },
            { name: 'Finance D. Reddy', id: 'TS-FIN-0033', role: 'Finance', station: 'Division HQ', status: 'Active', login: '09-Sep-2025' },
          ].map(u => (
            <tr key={u.id} className="hover:bg-[#F7F8FA]">
              <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-[#145A43]">{u.id}</td>
              <td className="px-4 py-3"><Badge tone="neutral">{u.role}</Badge></td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{u.station}</td>
              <td className="px-4 py-3"><Badge tone="success" dot>{u.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-[#4A4A4A]">{u.login}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button className="text-xs text-[#145A43] hover:underline cursor-pointer">Edit</button>
                  <span className="text-[#E0E0E0]">·</span>
                  <button className="text-xs text-[#C62828] hover:underline cursor-pointer">Deactivate</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function BIDDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Bidder Dashboard" subtitle={`${user?.name || 'A.K. Traders'} — Registered Bidder`} breadcrumb="Home / Dashboard"
        actions={<Btn onClick={() => navigate('bid-browse')}>Browse Auctions →</Btn>} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Active Bids" value="2" tone="neutral" />
        <KPICard title="Lots Won" value="1" tone="success" />
        <KPICard title="EMD Balance" value="₹10,000" tone="neutral" />
        <KPICard title="Payment Due" value="₹1,80,000" tone="warning" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Live Auctions</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 'LOT-HYD-2025-0047', title: 'Hyderabad District Lot', vehicles: 3, endsIn: '30m', status: 'live' },
              { id: 'LOT-WAR-2025-0031', title: 'Warangal Mixed Lot', vehicles: 5, endsIn: '2h 15m', status: 'live' },
            ].map(lot => (
              <div key={lot.id} className="p-3 border border-[#E0E0E0] rounded-xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-xs text-[#145A43] font-semibold">{lot.id}</p>
                  <p className="text-sm font-medium">{lot.title}</p>
                  <p className="text-xs text-[#9E9E9E]">{lot.vehicles} vehicles · Ends in {lot.endsIn}</p>
                </div>
                <Btn size="sm" onClick={() => navigate('bid-bidding')}>Bid Now</Btn>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Upcoming Auctions</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 'LOT-KAR-2025-0019', title: 'Karimnagar Lot', vehicles: 4, date: '22-Sep-2025' },
              { id: 'LOT-NIZ-2025-0008', title: 'Nizamabad Lot', vehicles: 2, date: '25-Sep-2025' },
            ].map(lot => (
              <div key={lot.id} className="p-3 border border-[#E0E0E0] rounded-xl flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-mono text-xs text-[#145A43] font-semibold">{lot.id}</p>
                  <p className="text-sm font-medium">{lot.title}</p>
                  <p className="text-xs text-[#9E9E9E]">{lot.vehicles} vehicles · {lot.date}</p>
                </div>
                <Btn size="sm" variant="secondary" onClick={() => navigate('bid-lot-detail')}>View Details</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function BIDBrowse() {
  const { navigate } = useNav();
  const lots = [
    { id: 'LOT-HYD-2025-0047', title: 'Hyderabad District — Mixed Lot', district: 'Hyderabad', vehicles: 3, reserve: '7,55,000', date: '20-Sep-2025', status: 'live' },
    { id: 'LOT-WAR-2025-0031', title: 'Warangal Lot — 4-Wheelers', district: 'Warangal', vehicles: 5, reserve: '18,20,000', date: '20-Sep-2025', status: 'live' },
    { id: 'LOT-KAR-2025-0019', title: 'Karimnagar Mixed Lot', district: 'Karimnagar', vehicles: 4, reserve: '9,80,000', date: '22-Sep-2025', status: 'upcoming' },
    { id: 'LOT-NIZ-2025-0008', title: 'Nizamabad 2-Wheeler Lot', district: 'Nizamabad', vehicles: 2, reserve: '2,10,000', date: '25-Sep-2025', status: 'upcoming' },
    { id: 'LOT-RAN-2025-0014', title: 'Rangareddy Lot', district: 'Rangareddy', vehicles: 6, reserve: '22,50,000', date: '28-Sep-2025', status: 'upcoming' },
  ];
  return (
    <div>
      <PageHeader title="Browse Auctions" subtitle="Find and register for police vehicle auctions" breadcrumb="Home / Browse" />
      <div className="flex gap-4 mb-6 flex-wrap">
        <select className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm bg-white cursor-pointer min-w-[180px]">
          <option>All Districts</option>
          <option>Hyderabad</option><option>Warangal</option><option>Karimnagar</option>
        </select>
        <select className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm bg-white cursor-pointer min-w-[160px]">
          <option>All Categories</option><option>2-Wheeler</option><option>4-Wheeler</option><option>Commercial</option>
        </select>
        <select className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm bg-white cursor-pointer min-w-[140px]">
          <option>All Status</option><option>Live</option><option>Upcoming</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {lots.map(lot => (
          <Card key={lot.id} className="p-5 hover:border-[#145A43] transition-colors cursor-pointer" onClick={() => navigate('bid-lot-detail')}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-[#9E9E9E]">{lot.id}</p>
                <h3 className="font-semibold text-[#1A1A1A]">{lot.title}</h3>
              </div>
              <Badge tone={lot.status === 'live' ? 'error' : 'info'} dot>{lot.status === 'live' ? 'LIVE' : 'Upcoming'}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm mb-4">
              <div><p className="text-xs text-[#9E9E9E]">District</p><p className="font-medium">{lot.district}</p></div>
              <div><p className="text-xs text-[#9E9E9E]">Vehicles</p><p className="font-medium">{lot.vehicles}</p></div>
              <div><p className="text-xs text-[#9E9E9E]">Reserve</p><p className="font-medium text-[#145A43]">₹{lot.reserve}</p></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#4A4A4A]">{lot.status === 'live' ? '🔴 Live Now' : `📅 ${lot.date}`}</span>
              <Btn size="sm" onClick={() => navigate('bid-lot-detail')}>{lot.status === 'live' ? 'Bid Now →' : 'View Lot →'}</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BIDLotDetail() {
  const { navigate } = useNav();
  return (
    <div>
      <PageHeader title="Lot Details" subtitle="LOT-HYD-2025-0047 · Hyderabad District" breadcrumb="Browse Auctions / Lot Details"
        actions={<Btn onClick={() => navigate('bid-bidding')}>Place Bid →</Btn>} />
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Lot Overview</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#9E9E9E]">Lot Number</p>
              <p className="font-mono font-semibold text-[#145A43]">LOT-HYD-2025-0047</p>
            </div>
            <div>
              <p className="text-xs text-[#9E9E9E]">Status</p>
              <Badge tone="error" dot>LIVE</Badge>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-[#9E9E9E]">Description</p>
              <p className="text-[#4A4A4A]">Seized vehicles from Hyderabad district — mixed category including 2-wheelers, 4-wheelers, and commercial vehicles.</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Vehicles in Lot</h3>
          <Table headers={['Reg No', 'Make / Model', 'Category', 'Reserve Price', 'Condition']}>
            {[
              { reg: 'TS09EA1234', make: 'Honda Activa 6G', cat: '2-Wheeler', reserve: '₹1,25,000', condition: 'Good' },
              { reg: 'TS05MK3456', make: 'Tata Ace Gold', cat: 'Commercial', reserve: '₹3,50,000', condition: 'Fair' },
              { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', cat: '4-Wheeler', reserve: '₹2,80,000', condition: 'Good' },
            ].map(v => (
              <tr key={v.reg} className="hover:bg-[#F7F8FA]">
                <td className="px-4 py-3 font-mono text-sm text-[#145A43]">{v.reg}</td>
                <td className="px-4 py-3 text-sm">{v.make}</td>
                <td className="px-4 py-3"><Badge tone="neutral">{v.cat}</Badge></td>
                <td className="px-4 py-3 text-sm font-semibold">{v.reserve}</td>
                <td className="px-4 py-3 text-sm">{v.condition}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}