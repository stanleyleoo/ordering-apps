import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export default function MasterProduct() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Food', image: '' })
  const [preview, setPreview] = useState('')

  const filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setForm(f => ({ ...f, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '', price: '', category: 'Food', image: '' })
    setPreview('')
    setShowForm(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({ name: product.name, description: product.description, price: String(product.price), category: product.category, image: product.image })
    setPreview(product.image)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.price) return
    const data = { ...form, price: Number(form.price), bestseller: editing?.bestseller || false }
    if (editing) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: { ...editing, ...data } })
    } else {
      const id = `${form.category.substring(0, 3).toUpperCase()}-${String(state.products.filter(p => p.category === form.category).length + 1).padStart(3, '0')}`
      dispatch({ type: 'ADD_PRODUCT', payload: { ...data, id } })
    }
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1D1D1F]">Products</h1>
          <p className="text-sm text-[#6E6E73]">{state.products.length} items</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Product</button>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-glass mb-4" />

      <div className="space-y-2">
        {filtered.map(product => (
          <div key={product.id} className="glass-card p-3 flex items-center gap-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-[#1D1D1F]">{product.name}</p>
                {product.bestseller && <span className="text-[10px] bg-[#D4A83C]/20 text-[#D4A83C] px-2 py-0.5 rounded-full font-medium">Best Seller</span>}
              </div>
              <p className="text-xs text-[#6E6E73]">{product.id} &middot; {product.category}</p>
              <p className="text-sm font-bold text-[#E8652D]">Rp {product.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(product)} className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition"><Pencil size={14} /></button>
              <button onClick={() => dispatch({ type: 'DELETE_PRODUCT', payload: product.id })} className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center hover:bg-red-50 transition text-[#E74C3C]"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-t-3xl p-5 max-h-[90dvh] overflow-y-auto animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1D1D1F]">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-full hover:bg-white/30"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-glass" placeholder="Product name" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-glass min-h-[80px] resize-none" placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Price *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-glass" placeholder="e.g. 35000" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-glass">
                    <option value="Food">Food</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#6E6E73] mb-1 block">Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 px-4 py-3 rounded-xl glass text-sm text-center cursor-pointer hover:bg-white/30 transition">
                    Choose Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {preview && <img src={preview} alt="preview" className="w-14 h-14 rounded-xl object-cover" />}
                </div>
              </div>
              <button onClick={handleSave} disabled={!form.name || !form.price} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
                <Save size={18} /> {editing ? 'Update' : 'Save'} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
