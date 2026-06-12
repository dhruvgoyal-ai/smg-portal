import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { shipmentAPI } from '../services/api'
import { Badge } from '../components/ui'
import {
  Search, Package, MapPin, Truck, CheckCircle, Clock,
  Navigation, ArrowLeft, RefreshCw, Calendar, Weight, User, Phone
} from 'lucide-react'

const MOCK_TRACKING = {
  trackingNo: 'SMG-20240001',
  status: 'in_transit',
  sender:   { name: 'TechMart Pvt Ltd',  address: 'Andheri East, Mumbai — 400069',             phone: '+91-98765-43210' },
  receiver: { name: 'Rahul Verma',       address: '15, Sector 22, Connaught Place, New Delhi — 110001', phone: '+91-90123-45678' },
  package:  { weight: '2.3 kg', dimensions: '30×20×15 cm', type: 'Electronics', value: '₹12,500', fragile: true },
  bookedDate: '8 Jun 2025, 10:30 AM',
  estimatedDelivery: '12 Jun 2025',
  partner: 'SMG FastMove — Ajay Kumar (DL 01 AB 1234)',
  timeline: [
    { id: 1, status: 'Shipment Booked',           location: 'SMG Mumbai HQ',          time: '08 Jun, 10:30 AM', done: true,  active: false },
    { id: 2, status: 'Pickup Completed',           location: 'Andheri, Mumbai',         time: '08 Jun, 2:15 PM',  done: true,  active: false },
    { id: 3, status: 'Arrived at Hub — Mumbai',    location: 'Bhiwandi Sorting Hub',    time: '08 Jun, 8:00 PM',  done: true,  active: false },
    { id: 4, status: 'Departed — Bhiwandi',        location: 'En route to Delhi',        time: '09 Jun, 12:00 AM', done: true,  active: false },
    { id: 5, status: 'Arrived at Hub — Delhi',     location: 'Gurgaon Sorting Hub',     time: '10 Jun, 6:00 AM',  done: true,  active: false },
    { id: 6, status: 'Out for Delivery',           location: 'Connaught Place, Delhi',  time: 'Est. 11 Jun, 10 AM', done: false, active: true  },
    { id: 7, status: 'Delivered',                  location: 'New Delhi — 110001',      time: 'Est. 12 Jun',      done: false, active: false },
  ],
}

export default function ShipmentTrackingPage() {
  const { trackingNo: paramNo } = useParams()
  const navigate = useNavigate()
  const [query, setQuery]       = useState(paramNo || '')
  const [tracking, setTracking] = useState(paramNo ? MOCK_TRACKING : null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await shipmentAPI.getTracking(query.trim())
      setTracking(res.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No shipment found with that tracking number.')
        setTracking(null)
      } else {
        setTracking({ ...MOCK_TRACKING, trackingNo: query.trim().toUpperCase() })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (paramNo) handleSearch() }, [paramNo])

  const completedCount = tracking?.timeline?.filter(t => t.done).length || 0
  const totalCount     = tracking?.timeline?.length || 0
  const progressPct    = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Header */}
      <div className="bg-[#0d2137]">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-1.5 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-[#0d2137] font-black text-sm tracking-tighter">SMG</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm">SMG Employee Portal</span>
                <p className="text-[#5a8ab0] text-[10px]">Shipment Tracking</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setError('') }}
                placeholder="Enter Tracking Number (e.g. SMG-20240001)"
                className="w-full pl-9 pr-3 py-2.5 rounded bg-white/10 border border-white/20 text-white placeholder-[#7fa8c9] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6ab1]/40"
              />
            </div>
            <button type="submit" disabled={loading}
              className="bg-[#1a6ab1] hover:bg-[#1558a0] text-white font-bold px-5 py-2.5 rounded text-sm transition-colors flex items-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </form>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {!tracking ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-600 font-semibold text-sm">Enter a tracking number to get started</h3>
            <p className="text-slate-400 text-xs mt-1">Your SMG tracking number starts with <strong>SMG-</strong></p>
          </div>
        ) : (
          <>
            {/* Status bar */}
            <div className="bg-white rounded border border-slate-200 p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tracking Number</p>
                  <p className="font-mono font-bold text-[#0d2137] text-base">{tracking.trackingNo}</p>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Status</p>
                  <Badge status={tracking.status} />
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Est. Delivery</p>
                  <p className="text-[#0d2137] font-bold text-xs">{tracking.estimatedDelivery}</p>
                </div>
              </div>
              <button onClick={() => handleSearch()} className="flex items-center gap-1.5 text-xs text-[#1a6ab1] font-semibold hover:underline">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {/* Progress */}
            <div className="bg-white rounded border border-slate-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#0d2137] text-sm">Delivery Progress</h3>
                <span className="text-xs font-bold text-[#1a6ab1]">{progressPct}% Complete</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1a6ab1] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              {/* Timeline */}
              <div className="lg:col-span-2 bg-white rounded border border-slate-200 p-5">
                <h3 className="font-bold text-[#0d2137] text-sm mb-4">Shipment Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" />
                  <div className="space-y-5">
                    {tracking.timeline.map((step) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 ${
                          step.active ? 'bg-[#1a6ab1] border-[#1a6ab1]' :
                          step.done   ? 'bg-green-500 border-green-500' :
                                        'bg-white border-slate-200'
                        }`}>
                          {step.done   ? <CheckCircle className="w-4 h-4 text-white" /> :
                           step.active ? <Truck className="w-3.5 h-3.5 text-white" /> :
                                         <Clock className="w-3.5 h-3.5 text-slate-300" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between">
                            <p className={`text-xs font-bold ${step.active ? 'text-[#1a6ab1]' : step.done ? 'text-[#0d2137]' : 'text-slate-400'}`}>
                              {step.status}
                              {step.active && <span className="ml-2 text-[9px] bg-[#1a6ab1]/10 text-[#1a6ab1] px-1.5 py-0.5 rounded font-bold">CURRENT</span>}
                            </p>
                            <p className="text-[10px] text-slate-400 ml-2 flex-shrink-0">{step.time}</p>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />{step.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {/* Sender */}
                <div className="bg-white rounded border border-slate-200 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sender</p>
                  <p className="text-xs font-bold text-[#0d2137]">{tracking.sender.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tracking.sender.address}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{tracking.sender.phone}</p>
                </div>
                {/* Receiver */}
                <div className="bg-white rounded border border-slate-200 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Receiver</p>
                  <p className="text-xs font-bold text-[#0d2137]">{tracking.receiver.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tracking.receiver.address}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{tracking.receiver.phone}</p>
                </div>
                {/* Package */}
                <div className="bg-white rounded border border-slate-200 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Package Details</p>
                  {[
                    ['Contents', tracking.package.type],
                    ['Weight',   tracking.package.weight],
                    ['Dimensions', tracking.package.dimensions],
                    ['Value',    tracking.package.value],
                    ['Handling', tracking.package.fragile ? '⚠ Fragile' : 'Standard'],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-[10px] py-0.5 border-b border-slate-50 last:border-0">
                      <span className="text-slate-400 font-semibold">{k}</span>
                      <span className="text-[#0d2137] font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
                {/* Partner */}
                <div className="bg-[#0d2137] rounded border border-[#1a3a5c] p-4">
                  <p className="text-[10px] font-bold text-[#5a8ab0] uppercase tracking-wider mb-2">Assigned Partner</p>
                  <p className="text-xs font-bold text-white">{tracking.partner}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
