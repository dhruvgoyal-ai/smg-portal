import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { StatCard, Badge, DataTable } from '../components/ui'
import { partnerAPI } from '../services/api'
import { Package, CheckCircle, Clock, MapPin, Navigation, AlertCircle, TrendingUp, IndianRupee } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_DELIVERIES = [
  { _id: '1', trackingNo: 'SMG-20240001', customer: 'Rahul Verma',  pickupAddr: 'Andheri, Mumbai',     deliveryAddr: 'Connaught Place, Delhi', status: 'in_transit',      weight: '2.3 kg', assignedTime: '08:30 AM' },
  { _id: '2', trackingNo: 'SMG-20240007', customer: 'Meera Joshi',  pickupAddr: 'Koramangala, Blr',    deliveryAddr: 'T Nagar, Chennai',       status: 'out_for_delivery',weight: '1.1 kg', assignedTime: '09:00 AM' },
  { _id: '3', trackingNo: 'SMG-20240009', customer: 'Vikram Nair',  pickupAddr: 'Banjara Hills, Hyd',  deliveryAddr: 'Kothrud, Pune',          status: 'pending',         weight: '0.6 kg', assignedTime: '10:00 AM' },
  { _id: '4', trackingNo: 'SMG-20240011', customer: 'Anita Patel',  pickupAddr: 'C G Road, Ahmedabad', deliveryAddr: 'MI Road, Jaipur',        status: 'delivered',       weight: '3.0 kg', assignedTime: '07:00 AM' },
]

const WEEKLY_DATA = [
  { day: 'Mon', delivered: 14, failed: 1 },
  { day: 'Tue', delivered: 19, failed: 0 },
  { day: 'Wed', delivered: 11, failed: 2 },
  { day: 'Thu', delivered: 22, failed: 1 },
  { day: 'Fri', delivered: 17, failed: 0 },
  { day: 'Sat', delivered: 8,  failed: 1 },
  { day: 'Sun', delivered: 3,  failed: 0 },
]

const DELIVERY_COLUMNS = [
  { key: 'trackingNo',   label: 'Tracking No.',
    render: (v) => <span className="font-mono text-[#1a6ab1] text-xs font-bold">{v}</span> },
  { key: 'customer',     label: 'Customer' },
  { key: 'pickupAddr',   label: 'Pickup',
    render: (v) => <span className="flex items-center gap-1 text-xs"><Navigation className="w-3 h-3 text-green-500" />{v}</span> },
  { key: 'deliveryAddr', label: 'Deliver To',
    render: (v) => <span className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3 text-red-400" />{v}</span> },
  { key: 'weight',       label: 'Wt.',   width: '70px' },
  { key: 'assignedTime', label: 'Time',  width: '90px' },
  { key: 'status',       label: 'Status', render: (v) => <Badge status={v} /> },
]

export default function PartnerDashboard() {
  const { user } = useAuth()
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES)

  useEffect(() => {
    partnerAPI.getAssignedShipments('me').then(res => {
      if (res.data?.shipments?.length) setDeliveries(res.data.shipments)
    }).catch(() => {})
  }, [])

  const counts = {
    assigned:  deliveries.length,
    pending:   deliveries.filter(d => d.status === 'pending').length,
    inTransit: deliveries.filter(d => ['in_transit','out_for_delivery'].includes(d.status)).length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
  }

  return (
    <DashboardLayout pageTitle="Partner Dashboard">
      {/* Welcome strip */}
      <div className="bg-[#0d2137] rounded border border-[#1a3a5c] p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base">Welcome, {user?.name?.split(' ')[0] || 'Partner'}</h2>
            <p className="text-[#7fa8c9] text-xs mt-1">
              You have <strong className="text-amber-400">{counts.inTransit}</strong> active deliveries assigned today.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="bg-white/8 border border-white/10 rounded px-3 py-2 text-center">
              <p className="text-[#7fa8c9] text-[10px] uppercase tracking-wider">Partner ID</p>
              <p className="text-white text-xs font-bold mt-0.5">SMG-PTR-001</p>
            </div>
            <div className="bg-green-500/15 border border-green-500/30 rounded px-3 py-2 text-center">
              <p className="text-green-400 text-xl font-black">{counts.delivered}</p>
              <p className="text-[#7fa8c9] text-[10px] mt-0.5">Delivered Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="Assigned"  value={counts.assigned}  icon={Package}     color="navy" />
        <StatCard title="Pending"   value={counts.pending}   icon={Clock}       color="amber" />
        <StatCard title="En Route"  value={counts.inTransit} icon={Navigation}  color="blue" />
        <StatCard title="Completed" value={counts.delivered} icon={CheckCircle} color="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {/* Weekly performance chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#0d2137] text-sm">Weekly Performance</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Delivery success this week</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#1a6ab1] inline-block" />Delivered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block" />Failed</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={WEEKLY_DATA} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="delivered" name="Delivered" fill="#1a6ab1" radius={[3,3,0,0]} />
              <Bar dataKey="failed"    name="Failed"    fill="#f87171" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 className="font-bold text-[#0d2137] text-sm mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: CheckCircle, label: 'Mark as Delivered',  bg: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-100' },
              { icon: Navigation,  label: 'Start Route',        bg: 'bg-blue-50 hover:bg-blue-100 text-[#1a6ab1] border-blue-100' },
              { icon: AlertCircle, label: 'Report Delay',       bg: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100' },
              { icon: IndianRupee, label: 'View Earnings',      bg: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' },
            ].map(({ icon: Icon, label, bg }) => (
              <button key={label} className={`w-full border flex items-center gap-2.5 text-xs font-semibold py-2.5 px-3 rounded transition-colors ${bg}`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Today's delivery queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#0d2137] text-sm">Today's Delivery Queue</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Assigned consignments for today</p>
          </div>
          <a href="/partner/shipments" className="text-xs text-[#1a6ab1] font-semibold hover:underline">Full list →</a>
        </div>
        <DataTable columns={DELIVERY_COLUMNS} data={deliveries} loading={false} />
      </div>
    </DashboardLayout>
  )
}
