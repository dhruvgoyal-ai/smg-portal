import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Badge, DataTable, Modal, EmptyState } from '../components/ui'
import { shipmentAPI } from '../services/api'
import {
  Package, Plus, Search, Filter, Download, Eye,
  Edit, Trash2, MapPin, X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MOCK_SHIPMENTS = [
  { _id: '1',  trackingNo: 'SMG-20240001', customer: 'Rahul Verma',   origin: 'Mumbai',    destination: 'Delhi',     status: 'in_transit',        date: '08 Jun 2025', weight: '2.3 kg', partner: 'FastMove' },
  { _id: '2',  trackingNo: 'SMG-20240002', customer: 'Priya Sharma',  origin: 'Bangalore', destination: 'Chennai',   status: 'delivered',         date: '07 Jun 2025', weight: '0.8 kg', partner: 'QuickShip' },
  { _id: '3',  trackingNo: 'SMG-20240003', customer: 'Amit Kumar',    origin: 'Delhi',     destination: 'Kolkata',   status: 'pending',           date: '09 Jun 2025', weight: '5.1 kg', partner: '—' },
  { _id: '4',  trackingNo: 'SMG-20240004', customer: 'Sunita Rao',    origin: 'Hyderabad', destination: 'Pune',      status: 'processing',        date: '09 Jun 2025', weight: '1.2 kg', partner: 'SwiftCourier' },
  { _id: '5',  trackingNo: 'SMG-20240005', customer: 'Deepak Singh',  origin: 'Chennai',   destination: 'Mumbai',    status: 'out_for_delivery',  date: '08 Jun 2025', weight: '3.7 kg', partner: 'FastMove' },
  { _id: '6',  trackingNo: 'SMG-20240006', customer: 'Neha Gupta',    origin: 'Jaipur',    destination: 'Ahmedabad', status: 'cancelled',         date: '08 Jun 2025', weight: '0.5 kg', partner: '—' },
  { _id: '7',  trackingNo: 'SMG-20240007', customer: 'Meera Joshi',   origin: 'Bangalore', destination: 'Chennai',   status: 'out_for_delivery',  date: '10 Jun 2025', weight: '1.1 kg', partner: 'QuickShip' },
  { _id: '8',  trackingNo: 'SMG-20240008', customer: 'Karthik Iyer',  origin: 'Pune',      destination: 'Mumbai',    status: 'delivered',         date: '06 Jun 2025', weight: '4.0 kg', partner: 'SwiftCourier' },
  { _id: '9',  trackingNo: 'SMG-20240009', customer: 'Vikram Nair',   origin: 'Hyderabad', destination: 'Pune',      status: 'pending',           date: '10 Jun 2025', weight: '0.6 kg', partner: '—' },
  { _id: '10', trackingNo: 'SMG-20240010', customer: 'Ananya Reddy',  origin: 'Mumbai',    destination: 'Bangalore', status: 'processing',        date: '09 Jun 2025', weight: '2.8 kg', partner: 'FastMove' },
]

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned']

export default function ShipmentsPage({ role = 'admin' }) {
  const navigate = useNavigate()
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS)
  const [loading, setLoading]     = useState(false)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [selected, setSelected]   = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen]       = useState(false)

  useEffect(() => {
    setLoading(true)
    shipmentAPI.getAll({ status: statusFilter !== 'all' ? statusFilter : undefined })
      .then(res => { if (res.data?.shipments?.length) setShipments(res.data.shipments) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [statusFilter])

  const filtered = shipments.filter(s =>
    (statusFilter === 'all' || s.status === statusFilter) &&
    (search === '' ||
      s.trackingNo?.toLowerCase().includes(search.toLowerCase()) ||
      s.customer?.toLowerCase().includes(search.toLowerCase()) ||
      s.destination?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const columns = [
    { key: 'trackingNo', label: 'Tracking No.',
      render: (v, row) => (
        <button onClick={() => { setSelected(row); setDetailOpen(true) }}
          className="font-mono font-bold text-brand text-xs hover:underline">{v}</button>
      )
    },
    { key: 'customer',    label: 'Customer' },
    { key: 'origin',      label: 'From' },
    { key: 'destination', label: 'To',
      render: (v) => <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{v}</span>
    },
    { key: 'weight',      label: 'Weight', width: '80px' },
    ...(role === 'admin' ? [{ key: 'partner', label: 'Partner', width: '110px' }] : []),
    { key: 'date',        label: 'Date', width: '110px' },
    { key: 'status',      label: 'Status', render: (v) => <Badge status={v} /> },
    ...(role !== 'partner' ? [{
      key: '_actions', label: 'Actions', width: '90px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/track/${row.trackingNo}`)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand transition-colors" title="Track">
            <Eye className="w-3.5 h-3.5" />
          </button>
          {role === 'admin' && (
            <button onClick={() => { setSelected(row); setDetailOpen(true) }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors" title="Edit">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }] : []),
  ]

  return (
    <DashboardLayout pageTitle={role === 'partner' ? 'My Deliveries' : 'Shipments'}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {role === 'partner' ? 'Assigned Deliveries' : role === 'customer' ? 'My Shipments' : 'All Shipments'}
          </h2>
          <p className="text-slate-400 text-sm">{filtered.length} shipments found</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          {role === 'admin' && (
            <button onClick={() => setAddOpen(true)} className="btn-primary text-xs">
              <Plus className="w-3.5 h-3.5" /> New Shipment
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by tracking, customer, city…"
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-brand text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No shipments match your filters" />
      </div>

      {/* Shipment Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={`Shipment — ${selected?.trackingNo}`} size="lg">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Tracking No.',  selected.trackingNo],
                ['Status',        <Badge status={selected.status} />],
                ['Customer',      selected.customer],
                ['Partner',       selected.partner || '—'],
                ['Origin',        selected.origin],
                ['Destination',   selected.destination],
                ['Weight',        selected.weight],
                ['Date',          selected.date],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-slate-800 font-medium">{val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => { setDetailOpen(false); navigate(`/track/${selected.trackingNo}`) }}
                className="btn-primary text-xs">
                <Eye className="w-3.5 h-3.5" /> Full Tracking
              </button>
              {role === 'admin' && (
                <button className="btn-secondary text-xs">
                  <Edit className="w-3.5 h-3.5" /> Edit Shipment
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* New Shipment Modal (admin) */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create New Shipment" size="lg">
        <NewShipmentForm onClose={() => setAddOpen(false)} />
      </Modal>
    </DashboardLayout>
  )
}

function NewShipmentForm({ onClose }) {
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    origin: '', destination: '', weight: '', type: 'Standard',
    partner: '', notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await shipmentAPI.create(form)
      onClose()
    } catch {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        {[
          ['customerName',  'Customer Name',  'text',  'Rahul Verma'],
          ['customerEmail', 'Customer Email', 'email', 'rahul@email.com'],
          ['customerPhone', 'Phone',          'text',  '+91-XXXXX-XXXXX'],
          ['origin',        'Origin City',    'text',  'Mumbai'],
          ['destination',   'Destination',    'text',  'Delhi'],
          ['weight',        'Weight (kg)',     'text',  '2.5'],
        ].map(([name, label, type, placeholder]) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
            <input name={name} type={type} value={form[name]} onChange={handleChange}
              placeholder={placeholder} className="input-field" />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Package Type</label>
        <select name="type" value={form.type} onChange={handleChange} className="input-field">
          <option>Standard</option>
          <option>Express</option>
          <option>Fragile</option>
          <option>Heavy</option>
          <option>Documents</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange}
          rows={2} placeholder="Special instructions…" className="input-field resize-none" />
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading} className="btn-primary text-xs">
          {loading ? 'Creating…' : 'Create Shipment'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
      </div>
    </form>
  )
}
