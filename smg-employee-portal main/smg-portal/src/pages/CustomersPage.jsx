import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Badge, DataTable, Modal } from '../components/ui'
import { customerAPI } from '../services/api'
import { Users, Plus, Search, Edit, Trash2, Package, Phone, Mail, MapPin } from 'lucide-react'

const MOCK_CUSTOMERS = [
  { _id: '1', name: 'Rahul Verma',   email: 'rahul@email.com',    phone: '+91-98765-43210', city: 'Mumbai',    totalShipments: 12, status: 'active',   joinDate: 'Jan 2024' },
  { _id: '2', name: 'Priya Sharma',  email: 'priya@email.com',    phone: '+91-90123-45678', city: 'Delhi',     totalShipments: 7,  status: 'active',   joinDate: 'Feb 2024' },
  { _id: '3', name: 'Amit Kumar',    email: 'amit@email.com',     phone: '+91-88001-23456', city: 'Bangalore', totalShipments: 3,  status: 'active',   joinDate: 'Mar 2024' },
  { _id: '4', name: 'Sunita Rao',    email: 'sunita@email.com',   phone: '+91-77900-12345', city: 'Hyderabad', totalShipments: 5,  status: 'inactive', joinDate: 'Jan 2024' },
  { _id: '5', name: 'Deepak Singh',  email: 'deepak@email.com',   phone: '+91-76543-21098', city: 'Kolkata',   totalShipments: 8,  status: 'active',   joinDate: 'Apr 2024' },
  { _id: '6', name: 'Meera Joshi',   email: 'meera@email.com',    phone: '+91-65432-10987', city: 'Pune',      totalShipments: 2,  status: 'active',   joinDate: 'May 2024' },
  { _id: '7', name: 'Karthik Iyer',  email: 'karthik@email.com',  phone: '+91-54321-09876', city: 'Chennai',   totalShipments: 15, status: 'active',   joinDate: 'Dec 2023' },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS)
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen]       = useState(false)
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    customerAPI.getAll().then(res => {
      if (res.data?.customers?.length) setCustomers(res.data.customers)
    }).catch(() => {})
  }, [])

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name',  label: 'Customer',
      render: (v, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs flex-shrink-0">
            {v[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone',          label: 'Phone',  render: (v) => <span className="text-xs">{v}</span> },
    { key: 'city',           label: 'City',
      render: (v) => <span className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3 text-slate-400" />{v}</span>
    },
    { key: 'totalShipments', label: 'Shipments', width: '100px',
      render: (v) => <span className="inline-flex items-center gap-1 font-semibold text-brand text-xs"><Package className="w-3 h-3" />{v}</span>
    },
    { key: 'joinDate',       label: 'Joined', width: '90px', render: (v) => <span className="text-xs text-slate-500">{v}</span> },
    { key: 'status',         label: 'Status', render: (v) => <Badge status={v} /> },
    { key: '_actions',       label: 'Actions', width: '80px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setSelected(row); setDetailOpen(true) }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand transition-colors">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
  ]

  return (
    <DashboardLayout pageTitle="Customers">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Customer Directory</h2>
          <p className="text-slate-400 text-sm">{filtered.length} customers</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customers…" className="input-field pl-9" />
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total',    value: customers.length, color: 'text-slate-800' },
          { label: 'Active',   value: customers.filter(c => c.status === 'active').length,   color: 'text-green-600' },
          { label: 'Inactive', value: customers.filter(c => c.status === 'inactive').length, color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label} Customers</p>
          </div>
        ))}
      </div>

      <div className="card">
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No customers found" />
      </div>

      {/* Detail/Edit modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Customer Details">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-lg">
                {selected.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{selected.name}</p>
                <Badge status={selected.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                [<Mail className="w-3.5 h-3.5" />, 'Email',    selected.email],
                [<Phone className="w-3.5 h-3.5" />, 'Phone',   selected.phone],
                [<MapPin className="w-3.5 h-3.5" />, 'City',   selected.city],
                [<Package className="w-3.5 h-3.5" />, 'Shipments', selected.totalShipments],
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
              <button className="btn-primary text-xs">Save Changes</button>
              <button onClick={() => setDetailOpen(false)} className="btn-secondary text-xs">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add customer modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Customer">
        <div className="space-y-3 text-sm">
          {[
            ['name',     'Full Name',     'text',  'Rahul Verma'],
            ['email',    'Email',         'email', 'rahul@email.com'],
            ['phone',    'Phone',         'text',  '+91-XXXXX-XXXXX'],
            ['city',     'City',          'text',  'Mumbai'],
            ['password', 'Password',      'password', '••••••••'],
          ].map(([name, label, type, placeholder]) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
              <input name={name} type={type} placeholder={placeholder} className="input-field" />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button className="btn-primary text-xs">Add Customer</button>
            <button onClick={() => setAddOpen(false)} className="btn-secondary text-xs">Cancel</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
