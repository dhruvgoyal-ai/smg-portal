import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard, Package, Users, Truck, MapPin,
  BarChart2, Settings, LogOut, ChevronRight,
  Shield, UserCheck, FileText, Bell
} from 'lucide-react'

const NAV_CONFIG = {
  admin: [
    { label: 'Dashboard',     icon: LayoutDashboard, to: '/admin' },
    { label: 'Shipments',     icon: Package,         to: '/admin/shipments' },
    { label: 'Customers',     icon: Users,           to: '/admin/customers' },
    { label: 'Partners',      icon: Truck,           to: '/admin/partners' },
    { label: 'Track Shipment',icon: MapPin,          to: '/track' },
    { label: 'Reports',       icon: BarChart2,       to: '/admin/analytics' },
    { label: 'Settings',      icon: Settings,        to: '/admin/settings' },
  ],
  customer: [
    { label: 'Dashboard',     icon: LayoutDashboard, to: '/customer' },
    { label: 'My Shipments',  icon: Package,         to: '/customer/shipments' },
    { label: 'Track Shipment',icon: MapPin,          to: '/track' },
    { label: 'Documents',     icon: FileText,        to: '/customer/docs' },
    { label: 'Settings',      icon: Settings,        to: '/customer/settings' },
  ],
  partner: [
    { label: 'Dashboard',     icon: LayoutDashboard, to: '/partner' },
    { label: 'Deliveries',    icon: Package,         to: '/partner/shipments' },
    { label: 'Track Shipment',icon: MapPin,          to: '/track' },
    { label: 'Notifications', icon: Bell,            to: '/partner/notifications' },
    { label: 'Settings',      icon: Settings,        to: '/partner/settings' },
  ],
}

const ROLE_LABELS = { admin: 'Administrator', customer: 'Customer', partner: 'Logistics Partner' }
const ROLE_BADGE  = { admin: 'bg-red-500/20 text-red-300', customer: 'bg-green-500/20 text-green-300', partner: 'bg-amber-500/20 text-amber-300' }

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const role = user?.role || 'customer'
  const navItems = NAV_CONFIG[role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onToggle} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        bg-[#0d2137]
        transition-all duration-300 ease-in-out
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-[60px]' : 'translate-x-0 w-[220px]'}
      `}>
        {/* Logo strip */}
        <div className="flex items-center gap-3 px-4 py-4 bg-[#081828] border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
            <span className="text-[#0d2137] font-black text-sm tracking-tighter">SMG</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">SMG Portal</p>
              <p className="text-[#5a8ab0] text-[10px] truncate">Logistics System</p>
            </div>
          )}
        </div>

        {/* User badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 bg-white/5 border border-white/10 rounded p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#1a6ab1] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">{user?.name || 'User'}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${ROLE_BADGE[role]}`}>
                  {ROLE_LABELS[role]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav divider label */}
        {!collapsed && (
          <p className="text-[9px] font-bold text-[#3a6080] uppercase tracking-[0.15em] px-4 pt-3 pb-1">
            Navigation
          </p>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={['/admin', '/customer', '/partner'].includes(to)}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  collapsed ? 'justify-center' : ''
                } ${isActive
                  ? 'bg-[#1a6ab1] text-white'
                  : 'text-[#7fa8c9] hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="w-3 h-3 opacity-30" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-3 border-t border-white/10 pt-2">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold text-[#f87171] hover:bg-red-500/15 w-full transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
