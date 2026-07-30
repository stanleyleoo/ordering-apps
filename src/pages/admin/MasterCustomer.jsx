import { useState } from 'react'
import { Pencil, Trash2, X, Save, Search } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export default function MasterCustomer() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)

  const filtered = state.customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, phone: c.phone, email: c.email || '' })
  }

  const handleSave = () => {
    if (!form.name || !form.phone) return
    dispatch({ type: 'UPDATE_CUSTOMER', payload: { ...editing, ...form } })
    setEditing(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1D1D1F]">Customers</h1>
          <p className="text-sm text-[#6E6E73]">{state.customers.length} registered</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="input-glass pl-11" />
      </div>

      <div className="space-y-2">
        {filtered.map(customer => (
          <div key={customer.id} className="glass-card p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8652D]/10 flex items-center justify-center text-sm font-bold text-[#E8652D]">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[#1D1D1F]">{customer.name}</p>
              <p className="text-xs text-[#6E6E73]">{customer.phone}{customer.email ? ` \u2022 ${customer.email}` : ''}</p>
              <p className="text-[10px] text-[#6E6E73]">{customer.id}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(customer)} className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition"><Pencil size={14} /></button>
              <button onClick={() => dispatch({ type: 'DELETE_CUSTOMER', payload: customer.id })} className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center hover:bg-red-50 transition text-[#E74C3C]"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-t-3xl p-5 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1D1D1F]">Edit Customer</h2>
              <button onClick={() => setEditing(null)} className="p-1 rounded-full hover:bg-white/30"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-glass" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-glass" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-glass" />
              </div>
              <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2"><Save size={18} /> Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
