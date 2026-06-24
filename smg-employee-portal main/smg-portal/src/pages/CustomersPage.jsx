import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Badge, DataTable, Modal } from '../components/ui'
import { customerAPI } from '../services/api'
import { Search, Edit, Trash2, Package, Phone, Mail, MapPin } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerAPI.getAll();

        setCustomers(
          res.data.users.filter(
            (user) => user.role === "customer"
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomers();
  }, []);

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
    </DashboardLayout>
  )
}