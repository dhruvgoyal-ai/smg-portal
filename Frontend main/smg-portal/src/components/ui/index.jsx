import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

// ── Stat Card ─────────────────────────────────────────────────────────
export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',    icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-600' },
    green:  { bg: 'bg-green-50',   icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
    amber:  { bg: 'bg-amber-50',   icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    red:    { bg: 'bg-red-50',     icon: 'bg-red-100 text-red-600',     text: 'text-red-600' },
    purple: { bg: 'bg-purple-50',  icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
    navy:   { bg: 'bg-brand/5',    icon: 'bg-brand/10 text-brand',      text: 'text-brand' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className="card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />
            }
            <span>{Math.abs(trendValue || trend)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    'pending':    'bg-amber-100 text-amber-700',
    'processing': 'bg-blue-100 text-blue-700',
    'in_transit': 'bg-purple-100 text-purple-700',
    'out_for_delivery': 'bg-indigo-100 text-indigo-700',
    'delivered':  'bg-green-100 text-green-700',
    'cancelled':  'bg-red-100 text-red-600',
    'failed':     'bg-red-100 text-red-600',
    'returned':   'bg-slate-100 text-slate-600',
    'active':     'bg-green-100 text-green-700',
    'inactive':   'bg-slate-100 text-slate-600',
  }
  const display = status?.replace(/_/g, ' ')
  return (
    <span className={`badge ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {display}
    </span>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} z-10`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 text-lg font-bold transition-colors">
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Loading Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={`${s[size]} border-2 border-brand/20 border-t-brand rounded-full animate-spin`} />
  )
}

// ── Empty State ───────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── Data Table ────────────────────────────────────────────────────────
export function DataTable({ columns, data, loading, emptyMessage = 'No records found' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-header" style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="table-cell text-center py-12">
                <div className="flex justify-center"><Spinner /></div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-cell text-center py-12 text-slate-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
