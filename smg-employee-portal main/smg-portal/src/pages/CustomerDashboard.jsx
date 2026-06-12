import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { StatCard, Badge, DataTable } from '../components/ui'
import { shipmentAPI } from '../services/api'
import { Package, Truck, CheckCircle, Clock, MapPin, Search, ArrowRight, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const MOCK_SHIPMENTS = [
  { _id: '1', trackingNo: 'SMG-20240001', origin: 'Mumbai',    destination: 'Delhi',   status: 'in_transit', expectedDate: '12 Jun 2025', items: 'Electronics' },
  { _id: '2', trackingNo: 'SMG-20240002', origin: 'Bangalore', destination: 'Chennai', status: 'delivered',  expectedDate: '10 Jun 2025', items: 'Clothing' },
  { _id: '3', trackingNo: 'SMG-20240003', origin: 'Delhi',     destination: 'Kolkata', status: 'processing', expectedDate: '14 Jun 2025', items: 'Documents' },
]

const SHIPMENT_COLUMNS = [
  { key: 'trackingNo',   label: 'Tracking No.',
    render: (v) => <span className="font-mono font-bold text-[#1a6ab1] text-xs">{v}</span> },
  { key: 'origin',       label: 'From' },
  { key: 'destination',  label: 'To',
    render: (v) => <span className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3 text-slate-400" />{v}</span> },
  { key: 'items',        label: 'Contents' },
  { key: 'expectedDate', label: 'Expected', width: '120px' },
  { key: 'status',       label: 'Status',   render: (v) => <Badge status={v} /> },
]

export default function CustomerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS)
  const [trackInput, setTrackInput] = useState('')

  useEffect(() => {
    shipmentAPI.getAll({ limit: 5 }).then(res => {
      if (res.data?.shipments?.length) setShipments(res.data.shipments)
    }).catch(() => {})
  }, [])

  const handleTrack = (e) => {
    e.preventDefault()
    if (trackInput.trim()) navigate(`/track/${trackInput.trim()}`)
  }

  const counts = {
    total:     shipments.length,
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    pending:   shipments.filter(s => ['pending','processing'].includes(s.status)).length,
  }

  return (
    <DashboardLayout pageTitle="Customer Dashboard">
      {/* Welcome + quick track */}
      <div className="bg-[#0d2137] rounded border border-[#1a3a5c] p-5 mb-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-white font-bold text-base">Welcome, {user?.name?.split(' ')[0] || 'Customer'}</h2>
            <p className="text-[#7fa8c9] text-xs mt-1">Track your consignments or check delivery status below.</p>
          </div>
          <div className="hidden sm:block bg-white/8 border border-white/10 rounded px-3 py-2 text-center">
            <p className="text-[10px] text-[#7fa8c9] uppercase tracking-wider">Customer ID</p>
            <p className="text-white text-xs font-bold mt-0.5">SMG-CST-001</p>
          </div>
        </div>
        <form onSubmit={handleTrack} className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={trackInput}
              onChange={e => setTrackInput(e.target.value)}
              placeholder="Enter Tracking Number (e.g. SMG-20240001)"
              className="w-full pl-9 pr-3 py-2.5 rounded bg-white/10 border border-white/20 text-white placeholder-[#7fa8c9] text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/40"
            />
          </div>
          <button type="submit" className="bg-[#1a6ab1] hover:bg-[#1558a0] text-white font-bold px-4 py-2.5 rounded text-xs transition-colors flex items-center gap-1.5">
            Track <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard title="Total Orders"  value={counts.total}     icon={Package}      color="navy" />
        <StatCard title="In Transit"    value={counts.inTransit} icon={Truck}        color="blue" />
        <StatCard title="Delivered"     value={counts.delivered} icon={CheckCircle}  color="green" />
        <StatCard title="Pending"       value={counts.pending}   icon={Clock}        color="amber" />
      </div>

      {/* Shipments table */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#0d2137] text-sm">My Consignments</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Your recent shipments</p>
          </div>
          <a href="/customer/shipments" className="text-xs text-[#1a6ab1] font-semibold hover:underline">View All →</a>
        </div>
        <DataTable columns={SHIPMENT_COLUMNS} data={shipments} loading={false} />
      </div>

      {/* Support CTA */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="card bg-[#0d2137] border-[#1a3a5c]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#1a6ab1]/30 rounded flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-[#7fa8c9]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">SMG Customer Support</h4>
              <p className="text-[#7fa8c9] text-[10px] mt-0.5">Available Mon–Sat, 9 AM – 7 PM</p>
              <p className="text-[#1a6ab1] text-xs font-bold mt-1">1800-SMG-0001</p>
            </div>
          </div>
        </div>
        <div className="card bg-amber-50 border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="text-[#0d2137] font-bold text-xs">Book a New Shipment</h4>
              <p className="text-slate-500 text-[10px] mt-0.5">Contact your account manager to initiate a pickup.</p>
              <button className="mt-1 text-xs text-[#1a6ab1] font-bold hover:underline">Request Pickup →</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
