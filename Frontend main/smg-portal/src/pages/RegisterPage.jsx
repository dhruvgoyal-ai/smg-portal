import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Eye, EyeOff, Lock, User, Mail, Phone, Shield, Truck, UserCheck, ChevronRight } from 'lucide-react'
 
const ROLE_OPTIONS = [
  { value: 'admin',            label: 'Admin',             icon: Shield },
  { value: 'customer',         label: 'Customer',          icon: UserCheck },
  { value: 'logisticsPartner', label: 'Logistics Partner', icon: Truck },
]
 
export default function RegisterPage() {
  const navigate = useNavigate()
 
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
 
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
 
    if (!form.name || !form.email || !form.password || !form.phone || !form.role) {
      setError('All fields are required.')
      return
    }
 
    setLoading(true)
    try {
      await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      })
 
      setSuccess('Registration successful! Redirecting to login…')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="min-h-screen flex bg-[#f0f4f8]">
      {/* ── LEFT PANEL: Register Form ─────────────────────────── */}
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
        </div>
 
        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-8 py-8 overflow-y-auto">
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-[#1a6ab1] rounded-full" />
              <h2 className="text-[#0d2137] font-bold text-lg">Create Account</h2>
            </div>
            <p className="text-slate-500 text-sm pl-3">
              Register to access the SMG portal.
            </p>
          </div>
 
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-slate-300 rounded pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
                  autoComplete="name"
                />
              </div>
            </div>
 
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
                  autoComplete="email"
                />
              </div>
            </div>
 
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-slate-300 rounded pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
                  autoComplete="tel"
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
                  placeholder="Create a password"
                  className="w-full border border-slate-300 rounded pl-9 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
 
            {/* Role dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Register As</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/30 focus:border-[#1a6ab1] transition bg-white"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
 
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}
 
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded px-3 py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                {success}
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
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
 
          {/* Back to login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1a6ab1] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
 
        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 text-center">
            © 2025 SMG Ltd. · Confidential Internal System · Unauthorised access is strictly prohibited.
          </p>
        </div>
      </div>
 
      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col bg-[#0d2137] relative overflow-hidden">
        <div className="absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff08" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#1a6ab1]/10 rounded-full" />
        <div className="absolute -bottom-60 -left-20 w-[400px] h-[400px] bg-[#1a6ab1]/8 rounded-full" />
 
        <div className="relative z-10 p-10">
          <p className="text-[#7fa8c9] text-xs uppercase tracking-widest font-semibold">Join</p>
          <h2 className="text-white font-black text-3xl mt-1 tracking-wide">SMG Ltd.</h2>
          <p className="text-[#7fa8c9] text-sm mt-1">Delivering Trust, Every Mile</p>
        </div>
 
        <div className="relative z-10 flex-1 flex items-center justify-center px-10">
          <div className="grid grid-cols-1 gap-4 max-w-sm">
            {[
              { icon: '📦', title: 'Shipment Management', desc: 'End-to-end tracking for every package' },
              { icon: '🔒', title: 'Secure & Compliant', desc: 'Enterprise-grade security on every account' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Live dashboards for every role' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xl mb-1">{item.icon}</p>
                <p className="text-white text-sm font-bold">{item.title}</p>
                <p className="text-[#7fa8c9] text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
 