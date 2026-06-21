import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, Lock, User, Shield, Truck, UserCheck, ChevronRight, Building2, Phone } from 'lucide-react'

const ROLE_ROUTES = { admin: '/admin', customer: '/customer', partner: '/partner' }

const ROLES = [
  { id: 'admin',    label: 'Admin',             icon: Shield,    desc: 'System Administrator' },
  { id: 'customer', label: 'Customer',           icon: UserCheck, desc: 'Customer Portal' },
  { id: 'partner',  label: 'Logistics Partner',  icon: Truck,     desc: 'Partner Portal' },
]

const DEMO_CREDENTIALS = [
  { role: 'admin',    userId: 'SMG-ADM-001',  password: 'Admin@123',    label: 'Admin' },
  { role: 'customer', userId: 'SMG-CST-001',  password: 'Customer@123', label: 'Customer' },
  { role: 'partner',  userId: 'SMG-PTR-001',  password: 'Partner@123',  label: 'Partner' },
]

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ userId: '', password: '', role: 'admin' })
  const [showPw, setShowPw]     = useState(false)
  const [twoFAStep, setTwoFAStep] = useState(false)
  const [otp, setOtp]           = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (isAuthenticated) {
    return <Navigate to={ROLE_ROUTES[user?.role] || '/admin'} replace />
  }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.userId || !form.password) { setError('User ID and Password are required.'); return }

    if (!twoFAStep) {
      // Simulate 2FA trigger
      setTwoFAStep(true)
      setError('')
      return
    }

    // Verify 2FA and login
    if (otp.length < 4) { setError('Please enter the OTP to proceed.'); return }

    setLoading(true)
    const email = (form.role === 'customer' || form.userId.includes('@')) 
      ? form.userId 
      : `${form.userId}@smg.com`
      
    const result = await login({ email, password: form.password, role: form.role })
    setLoading(false)
    if (result.success) {
      navigate(ROLE_ROUTES[result.role] || '/admin')
    } else {
      setError(result.message || 'Invalid credentials. Please try again.')
    }
  }

  const fillDemo = (cred) => {
    setForm({ userId: cred.userId, password: cred.password, role: cred.role })
    setTwoFAStep(false)
    setOtp('')
    setError('')
  }

  const selectedRole = ROLES.find(r => r.id === form.role)

  return (
    <div className="min-h-screen flex bg-[#f0f4f8]">
      {/* ── LEFT PANEL: Login Form ─────────────────────────────── */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col bg-white shadow-2xl z-10">
        {/* Portal header */}
        <div className="bg-[#0d2137] px-8 py-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded bg-white">
            <span className="text-[#0d2137] font-black text-xl tracking-tighter">SMG</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight tracking-wide">SMG Employee Portal</h1>
            <p className="text-[#7fa8c9] text-xs mt-0.5 font-medium">Logistics Management System</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-[#7fa8c9] text-[10px]">PORTAL VERSION</p>
            <p className="text-white text-xs font-semibold">v4.2.1</p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-8 py-8 overflow-y-auto">
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-[#1a6ab1] rounded-full" />
              <h2 className="text-[#0d2137] font-bold text-lg">Portal Sign In</h2>
            </div>
            <p className="text-slate-500 text-sm pl-3">
              {!twoFAStep
                ? 'Enter your credentials to access the system.'
                : 'Two-Way Authentication required. Enter the OTP sent to your registered device.'}
            </p>
          </div>

          {/* Role selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-[#0d2137] mb-2 uppercase tracking-wider">Login As</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, role: id })); setError(''); setTwoFAStep(false); setOtp('') }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded border-2 transition-all text-center ${
                    form.role === id
                      ? 'border-[#1a6ab1] bg-[#e8f1fa] text-[#1a6ab1]'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-bold leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!twoFAStep ? (
              <>
                {/* User ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">User ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="userId"
                      type="text"
                      value={form.userId}
                      onChange={handleChange}
                      placeholder="e.g. SMG-ADM-001"
                      className="w-full border border-slate-300 rounded pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="password"
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full border border-slate-300 rounded pl-9 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <a href="#" className="text-xs text-[#1a6ab1] hover:underline">Forgot password?</a>
                  </div>
                </div>
              </>
            ) : (
              /* ── Two-Way Authentication ── */
              <div className="bg-[#e8f1fa] border border-[#b3d0ea] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-[#1a6ab1]" />
                  <p className="text-sm font-bold text-[#0d2137]">Two-Way Authentication</p>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  An OTP has been sent to your registered mobile/email. Valid for <strong>5 minutes</strong>.
                </p>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0,6)); setError('') }}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full border border-[#1a6ab1]/40 rounded px-3 py-2.5 text-sm text-center font-mono tracking-widest text-[#0d2137] focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 bg-white"
                />
                <button type="button" onClick={() => setTwoFAStep(false)}
                  className="mt-2 text-xs text-[#1a6ab1] hover:underline">
                  ← Back to credentials
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d2137] hover:bg-[#1a3a5c] text-white font-bold py-3 rounded text-sm transition-colors flex items-center justify-center gap-2 tracking-wide"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <ChevronRight className="w-4 h-4" />
              }
              {loading ? 'Authenticating…' : twoFAStep ? 'Verify & Sign In' : 'Proceed to Authentication'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center font-semibold mb-2">Demo Quick Login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDENTIALS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => fillDemo(cred)}
                  className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded border border-slate-200 font-semibold transition-colors capitalize"
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          {/* System info */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />Systems Operational</span>
              <span>|</span>
              <span>IT Helpdesk: 1800-SMG-HELP</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 text-center">
            © 2025 SMG Ltd. · Confidential Internal System · Unauthorised access is strictly prohibited.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL: Logistics Illustration ───────────────── */}
      <div className="hidden lg:flex flex-1 flex-col bg-[#0d2137] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff08" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#1a6ab1]/10 rounded-full" />
        <div className="absolute -bottom-60 -left-20 w-[400px] h-[400px] bg-[#1a6ab1]/8 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1a6ab1]/5 rounded-full" />

        {/* SMG badge top */}
        <div className="relative z-10 p-10 flex items-center justify-between">
          <div>
            <p className="text-[#7fa8c9] text-xs uppercase tracking-widest font-semibold">Welcome to</p>
            <h2 className="text-white font-black text-3xl mt-1 tracking-wide">SMG Ltd.</h2>
            <p className="text-[#7fa8c9] text-sm mt-1">Delivering Trust, Every Mile</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">All Systems Live</span>
          </div>
        </div>

        {/* Central logistics SVG illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-10">
          <svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
            {/* Route lines */}
            <line x1="80" y1="190" x2="440" y2="190" stroke="#1a6ab1" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.4"/>
            <line x1="260" y1="80" x2="260" y2="310" stroke="#1a6ab1" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.4"/>
            <line x1="100" y1="100" x2="420" y2="290" stroke="#1a6ab1" strokeWidth="1" strokeDasharray="6 4" opacity="0.25"/>
            <line x1="420" y1="100" x2="100" y2="290" stroke="#1a6ab1" strokeWidth="1" strokeDasharray="6 4" opacity="0.25"/>

            {/* Central Hub */}
            <circle cx="260" cy="190" r="52" fill="#1a6ab1" opacity="0.15"/>
            <circle cx="260" cy="190" r="38" fill="#1a6ab1" opacity="0.25"/>
            <circle cx="260" cy="190" r="24" fill="#1a6ab1" opacity="0.6"/>
            {/* Hub icon: warehouse */}
            <rect x="248" y="184" width="24" height="14" rx="1" fill="white" opacity="0.9"/>
            <polygon points="248,184 260,174 272,184" fill="white" opacity="0.9"/>
            <rect x="256" y="188" width="8" height="10" rx="1" fill="#0d2137"/>
            <text x="260" y="222" textAnchor="middle" fill="#7fa8c9" fontSize="9" fontWeight="700" letterSpacing="1">LOGISTICS HUB</text>

            {/* Node: Mumbai */}
            <circle cx="100" cy="190" r="22" fill="#14385c"/>
            <circle cx="100" cy="190" r="16" fill="#1a6ab1" opacity="0.8"/>
            <text x="100" y="194" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">MUM</text>
            <text x="100" y="220" textAnchor="middle" fill="#7fa8c9" fontSize="8" fontWeight="600">Mumbai</text>

            {/* Node: Delhi */}
            <circle cx="420" cy="190" r="22" fill="#14385c"/>
            <circle cx="420" cy="190" r="16" fill="#1a6ab1" opacity="0.8"/>
            <text x="420" y="194" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700">DEL</text>
            <text x="420" y="220" textAnchor="middle" fill="#7fa8c9" fontSize="8" fontWeight="600">Delhi</text>

            {/* Node: Bengaluru */}
            <circle cx="160" cy="300" r="20" fill="#14385c"/>
            <circle cx="160" cy="300" r="14" fill="#1a6ab1" opacity="0.8"/>
            <text x="160" y="304" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">BLR</text>
            <text x="160" y="326" textAnchor="middle" fill="#7fa8c9" fontSize="8" fontWeight="600">Bengaluru</text>

            {/* Node: Kolkata */}
            <circle cx="360" cy="300" r="20" fill="#14385c"/>
            <circle cx="360" cy="300" r="14" fill="#1a6ab1" opacity="0.8"/>
            <text x="360" y="304" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">CCU</text>
            <text x="360" y="326" textAnchor="middle" fill="#7fa8c9" fontSize="8" fontWeight="600">Kolkata</text>

            {/* Node: Chennai */}
            <circle cx="160" cy="90" r="20" fill="#14385c"/>
            <circle cx="160" cy="90" r="14" fill="#1a6ab1" opacity="0.8"/>
            <text x="160" y="94" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">MAA</text>
            <text x="160" y="116" textAnchor="middle" fill="#7fa8c9" fontSize="8" fontWeight="600">Chennai</text>

            {/* Node: Hyderabad */}
            <circle cx="360" cy="90" r="20" fill="#14385c"/>
            <circle cx="360" cy="90" r="14" fill="#1a6ab1" opacity="0.8"/>
            <text x="360" y="94" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">HYD</text>
            <text x="360" y="116" textAnchor="middle" fill="#7fa8c9" fontSize="8" fontWeight="600">Hyderabad</text>

            {/* Moving truck on route */}
            <g transform="translate(168,183)">
              {/* Truck body */}
              <rect x="0" y="0" width="22" height="12" rx="1" fill="#f59e0b"/>
              <rect x="-8" y="2" width="10" height="10" rx="1" fill="#f59e0b"/>
              <rect x="-6" y="4" width="6" height="5" rx="0.5" fill="#0d2137" opacity="0.6"/>
              <circle cx="2" cy="13" r="2.5" fill="#1e293b"/>
              <circle cx="18" cy="13" r="2.5" fill="#1e293b"/>
              <circle cx="2" cy="13" r="1" fill="#94a3b8"/>
              <circle cx="18" cy="13" r="1" fill="#94a3b8"/>
            </g>

            {/* Package icon near truck */}
            <g transform="translate(310,155)">
              <rect x="0" y="0" width="14" height="12" rx="1" fill="#f59e0b" opacity="0.9"/>
              <line x1="7" y1="0" x2="7" y2="12" stroke="#d97706" strokeWidth="1"/>
              <line x1="0" y1="5" x2="14" y2="5" stroke="#d97706" strokeWidth="1"/>
            </g>

            {/* Stats bar at bottom */}
            <rect x="60" y="345" width="400" height="28" rx="5" fill="#14385c" opacity="0.8"/>
            <text x="90" y="363" fill="#7fa8c9" fontSize="8.5" fontWeight="700">500+ PARTNERS</text>
            <text x="230" y="363" fill="#7fa8c9" fontSize="8.5" fontWeight="700">50K+ SHIPMENTS</text>
            <text x="380" y="363" fill="#7fa8c9" fontSize="8.5" fontWeight="700">98% ON-TIME</text>
            <line x1="200" y1="350" x2="200" y2="368" stroke="#1a6ab1" strokeWidth="1" opacity="0.6"/>
            <line x1="360" y1="350" x2="360" y2="368" stroke="#1a6ab1" strokeWidth="1" opacity="0.6"/>
          </svg>
        </div>

        {/* Bottom features */}
        <div className="relative z-10 px-10 pb-10">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '📦', title: 'Shipment Management', desc: 'End-to-end tracking' },
              { icon: '🔒', title: 'Secure & Compliant', desc: 'Enterprise-grade security' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Live dashboards' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-white text-xs font-bold">{item.title}</p>
                <p className="text-[#7fa8c9] text-[10px] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
