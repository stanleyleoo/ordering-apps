import { useState } from 'react'
import { Clock, CheckCircle, XCircle, ChefHat, Search, Filter } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

const statusColors = {
  pending: { bg: 'bg-[#D4A83C]/10', text: 'text-[#D4A83C]', icon: Clock },
  preparing: { bg: 'bg-[#E8652D]/10', text: 'text-[#E8652D]', icon: ChefHat },
  completed: { bg: 'bg-[#2D9B7A]/10', text: 'text-[#2D9B7A]', icon: CheckCircle },
  cancelled: { bg: 'bg-[#E74C3C]/10', text: 'text-[#E74C3C]', icon: XCircle },
}

const statusLabels = { pending: 'Pending', preparing: 'Preparing', completed: 'Completed', cancelled: 'Cancelled' }

export default function ListOrders() {
  const { state, dispatch } = useApp()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = state.orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const nextStatus = (status) => {
    const map = { pending: 'preparing', preparing: 'completed', completed: 'completed', cancelled: 'cancelled' }
    return map[status] || status
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1D1D1F]">Orders</h1>
          <p className="text-sm text-[#6E6E73]">{state.orders.length} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[{ key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'preparing', label: 'Preparing' }, { key: 'completed', label: 'Completed' }, { key: 'cancelled', label: 'Cancelled' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.key ? 'bg-[#E8652D] text-white' : 'glass hover:bg-white/30 text-[#1D1D1F]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or customer..." className="input-glass pl-11" />
      </div>

      <div className="space-y-3">
        {filtered.map(order => {
          const sColor = statusColors[order.status]
          const StatusIcon = sColor.icon
          const nextSt = nextStatus(order.status)

          return (
            <div key={order.id} className="glass-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#1D1D1F]">{order.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${sColor.bg} ${sColor.text} flex items-center gap-1`}>
                      <StatusIcon size={12} /> {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-[#6E6E73] mt-0.5">{order.customer.name} \u2022 {order.customer.phone}</p>
                </div>
                <span className="text-lg font-bold text-[#E8652D]">Rp {order.total.toLocaleString()}</span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#1D1D1F]"><span className="font-medium">{item.qty}x</span> {item.name}</span>
                    <span className="text-[#6E6E73]">Rp {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/20">
                <span className="text-xs text-[#6E6E73]">{new Date(order.timestamp).toLocaleString()} &middot; {order.paymentMethod}</span>
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <button onClick={() => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: nextSt } })}
                    className="btn-primary text-sm py-2 px-4 text-xs flex items-center gap-1">
                    {order.status === 'pending' ? <><ChefHat size={14} /> Start Prepare</> : <><CheckCircle size={14} /> Complete</>}
                  </button>
                )}
                {order.status === 'pending' && (
                  <button onClick={() => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: 'cancelled' } })}
                    className="btn-ghost text-sm text-[#E74C3C]">Cancel</button>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#6E6E73]">
            <p className="font-medium">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
