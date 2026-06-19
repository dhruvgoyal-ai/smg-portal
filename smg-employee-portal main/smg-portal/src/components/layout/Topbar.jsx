import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Bell, Search, Menu, ChevronDown, Settings, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ROLE_LABELS = { admin: 'Administrator', customer: 'Customer', partner: 'Logistics Partner' }
const ROLE_COLORS = { admin: 'bg-red-100 text-red-700', customer: 'bg-green-100 text-green-700', partner: 'bg-amber-100 text-amber-700' }

export default function Topbar({ onMenuToggle, pageTitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen]       = useState(false)

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  const MOCK_NOTIFS = [
    { id: 1, text: 'Shipment #SMG-0041 delivered successfully', time: '2m ago', unread: true },
    { id: 2, text: 'New customer registration: Priya Sharma', time: '18m ago', unread: true },
    { id: 3, text: 'Partner delay reported on Route MUM-DEL', time: '1h ago', unread: false },
  ]

  const role = user?.role || 'customer'

  return (
    <header className="h-[52px] bg-white border-b border-slate-200 flex items-center px-4 gap-3 z-10 sticky top-0">
      {/* Hamburger */}
      <button onClick={onMenuToggle} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
        <span className="font-semibold text-[#0d2137]">SMG Portal</span>
        <span>/</span>
        <span className="text-slate-600 font-medium">{pageTitle}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs mx-3 hidden md:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search shipments, customers…"
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/20 focus:border-[#1a6ab1] transition"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Time/date */}
        <div className="hidden lg:block text-right mr-2 border-r border-slate-200 pr-3">
          <p className="text-xs font-bold text-slate-700">{timeStr}</p>
          <p className="text-[10px] text-slate-400">{dateStr}</p>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(p => !p); setDropdownOpen(false) }}
            className="relative p-2 rounded text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-76 w-[300px] bg-white rounded shadow-xl border border-slate-200 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-[#0d2137] uppercase tracking-wider">Notifications</p>
                <span className="text-[10px] text-[#1a6ab1] font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              {MOCK_NOTIFS.map(n => (
                <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${n.unread ? 'bg-blue-50/40' : ''}`}>
                  {n.unread && <span className="inline-block w-1.5 h-1.5 bg-[#1a6ab1] rounded-full mr-2 align-middle" />}
                  <span className="text-xs text-slate-700">{n.text}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5 ml-3.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(p => !p); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-7 h-7 rounded bg-[#0d2137] flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name?.split(' ')[0] || 'User'}</p>
              <span className={`text-[9px] font-bold px-1.5 rounded ${ROLE_COLORS[role]}`}>{ROLE_LABELS[role]}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white rounded shadow-xl border border-slate-200 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">ID: {user?.email?.split('@')[0]}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                <User className="w-3.5 h-3.5 text-slate-400" /> My Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
              </button>
              <div className="border-t border-slate-100">
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
