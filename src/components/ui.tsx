import React from 'react';

// Badge / Chip component
type BadgeTone = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'notice1' | 'notice2' | 'notice3' | 'accent';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-orange-100 text-orange-700',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  notice1: 'bg-blue-50 text-blue-700',
  notice2: 'bg-orange-50 text-orange-700',
  notice3: 'bg-green-50 text-green-700',
  accent: 'bg-yellow-100 text-yellow-800',
};

export function Badge({ tone = 'neutral', children, dot }: { tone?: BadgeTone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${toneClasses[tone]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

// KPI Card
export function KPICard({ title, value, delta, tone = 'neutral', icon }: {
  title: string; value: string | number; delta?: string; tone?: 'neutral' | 'success' | 'warning' | 'error'; icon?: React.ReactNode;
}) {
  const borderColors = { neutral: 'border-l-[#145A43]', success: 'border-l-green-600', warning: 'border-l-orange-500', error: 'border-l-red-600' };
  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-[#E0E0E0] border-l-4 ${borderColors[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#9E9E9E] uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-700 text-[#1A1A1A] leading-tight">{value}</p>
          {delta && <p className="text-xs text-[#4A4A4A] mt-1">{delta}</p>}
        </div>
        {icon && <div className="w-10 h-10 rounded-lg bg-[#E6F2ED] flex items-center justify-center text-[#145A43]">{icon}</div>}
      </div>
    </div>
  );
}

// Button
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
const btnClasses: Record<BtnVariant, string> = {
  primary: 'bg-[#145A43] hover:bg-[#1E7A5A] text-white border border-[#145A43]',
  secondary: 'bg-white hover:bg-[#E6F2ED] text-[#145A43] border border-[#145A43]',
  ghost: 'bg-transparent hover:bg-[#E6F2ED] text-[#145A43] border border-transparent',
  danger: 'bg-[#C62828] hover:bg-red-700 text-white border border-[#C62828]',
  accent: 'bg-[#B8860B] hover:bg-[#D4A017] text-white border border-[#B8860B]',
};

export function Btn({ variant = 'primary', children, onClick, disabled, size = 'md', type = 'button', className = '' }: {
  variant?: BtnVariant; children: React.ReactNode; onClick?: () => void; disabled?: boolean; size?: 'sm' | 'md' | 'lg'; type?: 'button' | 'submit'; className?: string;
}) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-2.5 text-sm' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${btnClasses[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// Input Field
export function Field({ label, placeholder, type = 'text', value, onChange, required, readOnly, mono }: {
  label: string; placeholder?: string; type?: string; value?: string; onChange?: (v: string) => void; required?: boolean; readOnly?: boolean; mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#4A4A4A]">{label}{required && <span className="text-[#C62828] ml-0.5">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`h-10 px-3 rounded-lg border border-[#E0E0E0] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none text-sm bg-white transition-colors ${readOnly ? 'bg-[#F7F8FA] text-[#9E9E9E]' : ''} ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

// Select Field
export function Select({ label, value, onChange, options, required }: {
  label: string; value?: string; onChange?: (v: string) => void; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#4A4A4A]">{label}{required && <span className="text-[#C62828] ml-0.5">*</span>}</label>
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="h-10 px-3 rounded-lg border border-[#E0E0E0] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none text-sm bg-white transition-colors appearance-none cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// Section Card
export function Card({ children, className = '', onClick, style }: { children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white rounded-xl border border-[#E0E0E0] shadow-sm ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
}

// Page Header
export function PageHeader({ title, subtitle, actions, breadcrumb }: {
  title: string; subtitle?: string; actions?: React.ReactNode; breadcrumb?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && <p className="text-xs text-[#9E9E9E] mb-1">{breadcrumb}</p>}
        <h1 className="text-xl font-semibold text-[#1A1A1A]">{title}</h1>
        {subtitle && <p className="text-sm text-[#4A4A4A] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Notice Progress Tracker (3-dot)
export function NoticeTracker({ sent }: { sent: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
          i < sent ? 'bg-[#145A43] border-[#145A43] text-white' :
          i === sent ? 'bg-[#D4A017] border-[#D4A017] text-white' :
          'bg-white border-[#E0E0E0] text-[#9E9E9E]'
        }`}>{i}</div>
      ))}
    </div>
  );
}

// Eligibility Chip
export function EligibilityChip({ status }: { status: 'Eligible' | 'Blocked' | 'Pending' | 'Under Review' }) {
  const map: Record<string, BadgeTone> = {
    Eligible: 'success', Blocked: 'error', Pending: 'warning', 'Under Review': 'info'
  };
  return <Badge tone={map[status] || 'neutral'} dot>{status}</Badge>;
}

// Table wrapper
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E0E0E0] bg-[#F7F8FA]">
            {headers.map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E0E0E0]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// Stepper
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
              i < current ? 'bg-[#145A43] border-[#145A43] text-white' :
              i === current ? 'bg-white border-[#145A43] text-[#145A43]' :
              'bg-white border-[#E0E0E0] text-[#9E9E9E]'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 whitespace-nowrap font-medium ${i === current ? 'text-[#145A43]' : i < current ? 'text-[#1A1A1A]' : 'text-[#9E9E9E]'}`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < current ? 'bg-[#145A43]' : 'bg-[#E0E0E0]'}`} style={{ minWidth: 32 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Tabs
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex border-b border-[#E0E0E0] gap-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            active === tab ? 'border-[#145A43] text-[#145A43]' : 'border-transparent text-[#4A4A4A] hover:text-[#1A1A1A]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// Approval Timeline
export function ApprovalTimeline({ steps }: { steps: { role: string; name?: string; date?: string; status: 'done' | 'current' | 'pending' | 'rejected' }[] }) {
  const statusColor = { done: '#145A43', current: '#D4A017', pending: '#9E9E9E', rejected: '#C62828' };
  return (
    <div className="flex flex-col gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold" style={{ borderColor: statusColor[s.status], color: statusColor[s.status], backgroundColor: s.status === 'done' ? '#E6F2ED' : 'white' }}>
              {s.status === 'done' ? '✓' : s.status === 'rejected' ? '✕' : i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-8 bg-[#E0E0E0] my-0.5" />}
          </div>
          <div className="pb-6">
            <p className="text-sm font-medium text-[#1A1A1A]">{s.role}</p>
            {s.name && <p className="text-xs text-[#4A4A4A]">{s.name}</p>}
            {s.date && <p className="text-xs text-[#9E9E9E]">{s.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// FilterBar
export function FilterBar({ onSearch }: { onSearch?: (q: string) => void }) {
  return (
    <div className="flex items-center gap-4 mb-4 flex-wrap">
      <div className="relative flex-1 min-w-56">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </span>
        <input
          onChange={e => onSearch?.(e.target.value)}
          placeholder="Search by Reg No / Chassis / FIR..."
          className="w-full pl-9 pr-3 h-10 rounded-lg border border-[#E0E0E0] text-sm focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none"
        />
      </div>
      <select className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm bg-white cursor-pointer min-w-[160px]">
        <option>All Categories</option>
        <option>2-Wheeler</option>
        <option>4-Wheeler</option>
        <option>Commercial</option>
      </select>
      <select className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm bg-white cursor-pointer min-w-[160px]">
        <option>All Stations</option>
        <option>Banjara Hills</option>
        <option>Begumpet</option>
        <option>Secunderabad</option>
        <option>Charminar</option>
        <option>Kukatpally</option>
      </select>
      <select className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm bg-white cursor-pointer min-w-[140px]">
        <option>All Status</option>
        <option>Eligible</option>
        <option>Blocked</option>
        <option>Pending</option>
      </select>
      <Btn variant="secondary" size="sm">Reset</Btn>
    </div>
  );
}
