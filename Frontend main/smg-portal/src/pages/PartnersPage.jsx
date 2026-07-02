import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Badge, DataTable, Modal } from '../components/ui'
import { partnerAPI } from '../services/api'
import { Truck, Plus, Search, Edit, Trash2, Star, MapPin, Package, Phone, Mail } from 'lucide-react'
 
const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-1">
    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
    <span className="text-xs font-semibold text-slate-700">{rating}</span>
  </div>
)
 
const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  city: '',
  password: '',
}
 
export default function PartnersPage() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen]       = useState(false)
  const [addForm, setAddForm]       = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
 
  const formatPartner = (p) => ({
    _id: p._id,
    name: p.name || p.companyName || '-',
    email: p.email || '-',
    phone: p.phone || '-',
    city: p.city || '-',
    rating: p.rating ?? 0,
    activeDeliveries: p.activeDeliveries ?? 0,
    totalCompleted: p.totalCompleted ?? 0,
    status: p.status || 'active',
    joinDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-',
  })
 
  const loadPartners = async () => {
    setLoading(true)
    try {
      const res = await partnerAPI.getAll()
      const list = res.data?.partners || res.data || []
      setPartners(list.map(formatPartner))
    } catch {
      setPartners([])
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    loadPartners()
  }, [])
 
  const filtered = partners.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  )
 
  const handleDelete = async (row) => {
    if (!window.confirm(`Delete partner "${row.name}"? This cannot be undone.`)) return
    try {
      await partnerAPI.delete(row._id)
      await loadPartners()
    } catch {
      /* no-op */
    }
  }
 
  const handleEditSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await partnerAPI.update(selected._id, {
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        city: selected.city,
        status: selected.status,
      })
      await loadPartners()
      setDetailOpen(false)
    } catch {
      /* no-op */
    } finally {
      setSaving(false)
    }
  }
 
  const handleAddSubmit = async () => {
    setSaving(true)
    try {
      await partnerAPI.create(addForm)
      await loadPartners()
      setAddForm(EMPTY_FORM)
      setAddOpen(false)
    } catch {
      /* no-op */
    } finally {
      setSaving(false)
    }
  }
 
  const columns = [
    { key: 'name', label: 'Partner',
      render: (v, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4 text-brand" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'city',             label: 'Base City',
      render: (v) => <span className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3 text-slate-400" />{v}</span>
    },
    { key: 'activeDeliveries', label: 'Active',    width: '80px',
      render: (v) => <span className="font-bold text-blue-600 text-sm">{v}</span>
    },
    { key: 'totalCompleted',   label: 'Completed', width: '100px',
      render: (v) => <span className="font-semibold text-green-600 text-sm">{v}</span>
    },
    { key: 'rating',           label: 'Rating',    width: '80px', render: (v) => <RatingStars rating={v} /> },
    { key: 'joinDate',         label: 'Joined',    width: '90px', render: (v) => <span className="text-xs text-slate-500">{v}</span> },
    { key: 'status',           label: 'Status',    render: (v) => <Badge status={v} /> },
    { key: '_actions',         label: 'Actions',   width: '80px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setSelected(row); setDetailOpen(true) }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand transition-colors">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
  ]
 
  return (
    <DashboardLayout pageTitle="Partners">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Logistics Partners</h2>
          <p className="text-slate-400 text-sm">{filtered.length} partners registered</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Partner
        </button>
      </div>
 
      {/* Search */}
      <div className="card mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search partners…" className="input-field pl-9" />
        </div>
      </div>
 
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Partners',      value: partners.length },
          { label: 'Active Now',          value: partners.filter(p => p.status === 'active').length, color: 'text-green-600' },
          { label: 'Total Deliveries',    value: partners.reduce((s, p) => s + (p.totalCompleted || 0), 0).toLocaleString(), color: 'text-brand' },
        ].map(({ label, value, color = 'text-slate-800' }) => (
          <div key={label} className="card text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
 
      <div className="card">
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No partners found" />
      </div>
 
      {/* Detail modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Partner Details">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-brand" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{selected.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge status={selected.status} />
                  <RatingStars rating={selected.rating} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                [<Mail className="w-3.5 h-3.5" key="mail" />,    'Email',             selected.email],
                [<Phone className="w-3.5 h-3.5" key="phone" />,   'Phone',             selected.phone],
                [<MapPin className="w-3.5 h-3.5" key="city" />,  'Base City',         selected.city],
                [<Truck className="w-3.5 h-3.5" key="active" />,   'Active Deliveries', selected.activeDeliveries],
                [<Package className="w-3.5 h-3.5" key="completed" />, 'Total Completed',   selected.totalCompleted],
                [null,                                 'Member Since',      selected.joinDate],
              ].map(([icon, label, val]) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-medium text-slate-800">{val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleEditSave} disabled={saving} className="btn-primary text-xs">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => setDetailOpen(false)} className="btn-secondary text-xs">Close</button>
            </div>
          </div>
        )}
      </Modal>
 
      {/* Add partner modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Partner">
        <div className="space-y-3 text-sm">
          {[
            ['name',      'Company Name',  'text',     'FastMove Logistics'],
            ['email',     'Email',         'email',    'ops@partner.com'],
            ['phone',     'Phone',         'text',     '+91-XXXXX-XXXXX'],
            ['city',      'Base City',     'text',     'Mumbai'],
            ['password',  'Password',      'password', '••••••••'],
          ].map(([name, label, type, placeholder]) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={addForm[name]}
                onChange={(e) => setAddForm({ ...addForm, [name]: e.target.value })}
                className="input-field"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={handleAddSubmit} disabled={saving} className="btn-primary text-xs">
              {saving ? 'Adding…' : 'Add Partner'}
            </button>
            <button onClick={() => { setAddOpen(false); setAddForm(EMPTY_FORM) }} className="btn-secondary text-xs">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
 