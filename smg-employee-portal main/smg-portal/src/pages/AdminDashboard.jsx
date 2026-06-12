import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { StatCard, Badge, DataTable } from '../components/ui'
import { dashboardAPI, shipmentAPI } from '../services/api'
import {
  Package, Users, Truck, IndianRupee, TrendingUp,
  Clock, CheckCircle, XCircle, MapPin, RefreshCw, AlertTriangle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const MOCK_STATS = {
  totalShipments: 12840,
  activeShipments: 342,
  deliveredToday: 87,
  pendingPickup: 56,
  totalCustomers: 4302,
  activePartners: 128,
  revenue: '₹84,25,000',
  failedDeliveries: 12,
}

const MOCK_CHART = [
  { month: 'Jan', shipments: 1320, delivered: 1298 },
  { month: 'Feb', shipments: 1410, delivered: 1390 },
  { month: 'Mar', shipments: 1380, delivered: 1365 },
  { month: 'Apr', shipments: 1520, delivered: 1495 },
  { month: 'May', shipments: 1490, delivered: 1472 },
  { month: 'Jun', shipments: 1610, delivered: 1580 },
]

const MOCK_STATUS_PIE = [
  { name: 'Delivered',   value: 580, color: '#22c55e' },
  { name: 'In Transit',  value: 210, color: '#1a6ab1' },
  { name: 'Pending',     value: 56,  color: '#f59e0b' },
  { name: 'Processing',  value: 76,  color: '#7dd3fc' },
  { name: 'Failed',      value: 12,  color: '#f87171' },
]

const MOCK_RECENT = [
  { _id: '1', trackingNo: 'SMG-20240001', customer: 'Rahul Verma',   destination: 'Mumbai → Delhi',       status: 'in_transit',      date: '10 Jun 2025', weight: '2.3 kg' },
  { _id: '2', trackingNo: 'SMG-20240002', customer: 'Priya Sharma',  destination: 'Bangalore → Chennai',  status: 'delivered',       date: '10 Jun 2025', weight: '0.8 kg' },
  { _id: '3', trackingNo: 'SMG-20240003', customer: 'Amit Kumar',    destination: 'Delhi → Kolkata',      status: 'pending',         date: '9 Jun 2025',  weight: '5.1 kg' },
  { _id: '4', trackingNo: 'SMG-20240004', customer: 'Sunita Rao',    destination: 'Hyderabad → Pune',     status: 'processing',      date: '9 Jun 2025',  weight: '1.2 kg' },
  { _id: '5', trackingNo: 'SMG-20240005', customer: 'Deepak Singh',  destination: 'Chennai → Mumbai',     status: 'out_for_delivery',date: '8 Jun 2025',  weight: '3.7 kg' },
  { _id: '6', trackingNo: 'SMG-20240006', customer: 'Neha Gupta',    destination: 'Jaipur → Ahmedabad',   status: 'cancelled',       date: '8 Jun 2025',  weight: '0.5 kg' },
]

const RECENT_COLUMNS = [
  { key: 'trackingNo',  label: 'Tracking No.',  width: '140px',
    render: (v) => <span className="font-mono font-bold text-[#1a6ab1] text-xs">{v}</span> },
  { key: 'customer',    label: 'Customer' },
  { key: 'destination', label: 'Route', render: (v) => (
    <span className="flex items-center gap-1 text-slate-600 text-xs">
      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />{v}
    </span>
  )},
  { key: 'weight',  label: 'Weight', width: '80px' },
  { key: 'date',    label: 'Date',   width: '110px' },
  { key: 'status',  label: 'Status', width: '140px', render: (v) => <Badge status={v} /> },
]

export default function AdminDashboard() {
  const [stats, setStats]   = useState(MOCK_STATS)
  const [chart, setChart]   = useState(MOCK_CHART)
  const [recent, setRecent] = useState(MOCK_RECENT)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          dashboardAPI.getAdminStats(),
          shipmentAPI.getAll({ limit: 6, sort: '-createdAt' }),
        ])
        if (statsRes.data) setStats(statsRes.data)
        if (recentRes.data?.shipments) setRecent(recentRes.data.shipments)
      } catch { /* keep mock */ }
    }
    load()
  }, [])

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      {/* Alert bar */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded px-4 py-2 mb-4 text-xs text-amber-700">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
        <span><strong>12 delayed shipments</strong> require attention — Route MUM-DEL experiencing congestion.</span>
        <a href="#" className="ml-auto text-[#1a6ab1] font-semibold hover:underline flex-shrink-0">View →</a>
      </div>

      {/* Welcome strip */}
      <div className="bg-[#0d2137] rounded border border-[#1a3a5c] p-5 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-base">Good morning, Administrator</h2>
          <p className="text-[#7fa8c9] text-xs mt-1">Here's your logistics network overview for today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-[#7fa8c9] text-[10px] uppercase tracking-wider">System Status</p>
            <p className="text-green-400 text-xs font-bold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />All Operational
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard title="Total Shipments" value={stats.totalShipments?.toLocaleString('en-IN')} subtitle="All time" icon={Package}      color="navy"  trend={12} />
        <StatCard title="Active Shipments" value={stats.activeShipments}                         subtitle="In progress" icon={Truck}   color="blue"  trend={5} />
        <StatCard title="Delivered Today"  value={stats.deliveredToday}                          subtitle="Successful" icon={CheckCircle} color="green" trend={8} />
        <StatCard title="Pending Pickup"   value={stats.pendingPickup}                           subtitle="Awaiting dispatch" icon={Clock} color="amber" trend={-3} />
      </div>

      {/* Secondary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="Total Customers" value={stats.totalCustomers?.toLocaleString('en-IN')} icon={Users}       color="purple" />
        <StatCard title="Active Partners" value={stats.activePartners}                          icon={Truck}       color="blue" />
        <StatCard title="Revenue (MTD)"   value={stats.revenue}                                 icon={IndianRupee} color="green" />
        <StatCard title="Failed Deliveries" value={stats.failedDeliveries}                      icon={XCircle}     color="red" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {/* Area chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#0d2137] text-sm">Shipment Trends</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Monthly volume comparison</p>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded font-semibold uppercase tracking-wider">Jan – Jun 2025</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0d2137" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0d2137" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11 }} />
              <Area type="monotone" dataKey="shipments" name="Total"     stroke="#0d2137"  strokeWidth={2} fill="url(#gradTotal)" />
              <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#22c55e"  strokeWidth={2} fill="url(#gradDelivered)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="mb-3">
            <h3 className="font-bold text-[#0d2137] text-sm">Status Breakdown</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Current shipment status</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={MOCK_STATUS_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                {MOCK_STATUS_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 6, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {MOCK_STATUS_PIE.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
                  <span className="text-slate-600 text-[11px]">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-700 text-[11px]">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent shipments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#0d2137] text-sm">Recent Shipments</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Latest activity across the network</p>
          </div>
          <a href="/admin/shipments" className="text-xs text-[#1a6ab1] font-semibold hover:underline">View All →</a>
        </div>
        <DataTable columns={RECENT_COLUMNS} data={recent} loading={loading} />
      </div>
    </DashboardLayout>
  )
}
