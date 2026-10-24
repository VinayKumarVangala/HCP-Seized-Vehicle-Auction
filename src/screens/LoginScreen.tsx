import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNav, Role, roleDashboards, roleOptions } from '../nav';

// Logo paths (served from public/)
const HYD_POLICE_LOGO = '/assets/logos/hyd-city-police.png';
const TS_LOGO = '/assets/logos/ts-logo.jpeg';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { navigate, setRole } = useNav();
  const [role, setLocalRole] = useState<Role>('PS');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({
        role,
        userId,
        password,
        rememberMe: true,
        captchaToken: captcha ? 'mock-captcha-verified' : undefined,
      });
      setRole(response.user.role);
      navigate(roleDashboards[response.user.role] as any);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleOtpLogin = () => {
    setRole(role);
    navigate(roleDashboards[role] as any);
  };

  return (
    <div className="flex h-screen">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col w-[55%] bg-[#0B3D2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px'
        }} />
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-4 mb-auto">
            <img
              src={HYD_POLICE_LOGO}
              alt="Hyderabad City Police"
              className="w-16 h-16 rounded-full object-cover border border-white/20 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement?.insertAdjacentHTML('afterend', '<div class="w-16 h-16 rounded-full bg-[#D4A017] flex items-center justify-center text-[#0B3D2E] font-black text-xl shadow-lg">TP</div>');
              }}
            />
            <div>
              <p className="font-bold text-lg leading-tight">Telangana Police</p>
              <p className="text-white/60 text-sm">Department of Home Affairs · Government of Telangana</p>
            </div>
            <img
              src={TS_LOGO}
              alt="Telangana State Logo"
              className="w-12 h-12 object-cover rounded-md border border-white/20 shadow-lg ml-auto"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="my-auto">
            <div className="inline-block bg-white/10 text-white/80 text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wider uppercase">Secure Government Portal</div>
            <h1 className="text-4xl font-bold mb-3 leading-tight">
              Seized Vehicle<br />
              <span className="text-[#D4A017]">Auction Management</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-md">
              SVAMS — A unified digital platform for managing seized vehicle auctions from seizure to sale.
            </p>

            <div className="flex flex-col gap-3">
              {['End-to-end notice compliance tracking', 'Multi-role workflow with approvals', 'Real-time auction & bidder management', 'Integrated with VAHAN & CCTNS'].map(f => (
                <div key={f} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#D4A017]/20 text-[#D4A017] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-white/40 text-xs">For official use only. All activities are logged and monitored.</p>
            <p className="text-white/30 text-xs mt-1">Telangana Police · IT Helpdesk: 040-2329-0000</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-[#F7F8FA]">
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <img
            src={HYD_POLICE_LOGO}
            alt="Hyderabad City Police"
            className="w-10 h-10 rounded-full object-cover bg-[#0B3D2E] border border-white/20"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement?.insertAdjacentHTML('afterend', '<div class="w-10 h-10 rounded-full bg-[#0B3D2E] flex items-center justify-center text-[#D4A017] font-black text-sm">TP</div>');
            }}
          />
          <div>
            <p className="font-bold text-sm">SVAMS · Telangana Police</p>
            <p className="text-[#9E9E9E] text-xs">Seized Vehicle Auction Management</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Welcome back</h2>
        <p className="text-[#4A4A4A] text-sm mb-7">Sign in to your account to continue</p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#4A4A4A]">Login As</label>
            <select
              value={role}
              onChange={e => setLocalRole(e.target.value as Role)}
              className="h-11 px-3 rounded-xl border border-[#E0E0E0] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none text-sm bg-white transition-colors cursor-pointer"
            >
              {roleOptions.map((o: { value: Role; label: string }) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#4A4A4A]">User ID / Mobile</label>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="e.g. TS-PS-0312 or 9XXXXXXXXX"
              className="h-11 px-3 rounded-xl border border-[#E0E0E0] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none text-sm bg-white transition-colors"
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[#4A4A4A]">Password</label>
              <button type="button" className="text-xs text-[#145A43] hover:underline cursor-pointer">Forgot password?</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 px-3 rounded-xl border border-[#E0E0E0] focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none text-sm bg-white transition-colors"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E0E0E0] bg-white">
            <input
              type="checkbox"
              checked={captcha}
              onChange={e => setCaptcha(e.target.checked)}
              className="w-4 h-4 accent-[#145A43]"
            />
            <span className="text-sm text-[#4A4A4A]">I am not a robot</span>
            <span className="ml-auto text-[#9E9E9E] text-xs">reCAPTCHA</span>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 accent-[#145A43]" />
            <span className="text-sm text-[#4A4A4A]">Remember this device</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-xl bg-[#145A43] hover:bg-[#1E7A5A] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
            ) : (
              <><span>🔐</span> Secure Login</>
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#E0E0E0]" />
            <span className="text-xs text-[#9E9E9E]">or</span>
            <div className="flex-1 h-px bg-[#E0E0E0]" />
          </div>

          <button
            type="button"
            onClick={handleOtpLogin}
            className="h-11 rounded-xl border border-[#E0E0E0] bg-white hover:bg-[#E6F2ED] text-[#145A43] font-medium text-sm transition-colors cursor-pointer"
          >
            Login with OTP
          </button>
        </form>

        <p className="text-center text-xs text-[#9E9E9E] mt-8">
          For official use only · Telangana Police<br />
          <span className="text-[#145A43]">IT Helpline: 040-2329-0000</span>
        </p>
      </div>
    </div>
  );
}