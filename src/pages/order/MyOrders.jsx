import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import OrderTracker from '../../components/OrderTracker'
import RatingPanel from '../../components/RatingPanel'

const statusColors = {
  pending: { bg: 'bg-[#D4A83C]/10', text: 'text-[#D4A83C]', icon: Clock },
  preparing: { bg: 'bg-[#E8652D]/10', text: 'text-[#E8652D]', icon: ChefHat },
  completed: { bg: 'bg-[#2D9B7A]/10', text: 'text-[#2D9B7A]', icon: CheckCircle },
  cancelled: { bg: 'bg-[#E74C3C]/10', text: 'text-[#E74C3C]', icon: XCircle },
}

const statusLabels = { pending: 'Pending', preparing: 'Preparing', completed: 'Completed', cancelled: 'Cancelled' }

export default function MyOrders() {
  const navigate = useNavigate()
  const { state } = useApp()
  const lastOrder = state.lastOrder
  const [phone, setPhone] = useState(lastOrder?.customer?.phone || '')
  const [expandedId, setExpandedId] = useState(lastOrder?.id || null)

  const matched = phone
    ? state.orders.filter(o => o.customer.phone === phone).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    : []

  return (
    <div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Enter your phone number to track orders"
          className="input-glass pl-11"
        />
      </div>

      {lastOrder && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide">Latest Order</p>
            <button onClick={() => navigate('/order')} className="text-xs text-[#E8652D] font-medium">+ Order more</button>
          </div>
          <OrderTracker order={lastOrder} />
        </div>
      )}

      <p className="text-sm font-semibold text-[#1D1D1F] mb-3">
        {phone ? `Your orders (${matched.length})` : 'Your orders'}
      </p>

      {phone && matched.length === 0 && (
        <div className="text-center py-12 text-[#6E6E73]">
          <p className="font-medium">No orders found for this number</p>
          <p className="text-xs mt-1">Check the number or place an order first</p>
        </div>
      )}

      <div className="space-y-3">
        {matched.map(order => {
          const sColor = statusColors[order.status]
          const StatusIcon = sColor.icon
          const isExpanded = expandedId === order.id

          return (
            <div key={order.id} className="glass-card overflow-hidden">
              <button onClick={() => setExpandedId(isExpanded ? null : order.id)} className="w-full text-left p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#1D1D1F] text-sm">{order.id}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sColor.bg} ${sColor.text} flex items-center gap-1`}>
                        <StatusIcon size={11} /> {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6E6E73] mt-1">
                      {new Date(order.timestamp).toLocaleString()} &middot; {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-[#E8652D] text-sm">Rp {order.total.toLocaleString()}</span>
                    <ChevronDown size={16} className={`text-[#6E6E73] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <div className="space-y-1 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between gap-2 text-xs">
                        <span className="text-[#1D1D1F] min-w-0 truncate"><span className="font-medium">{item.qty}x</span> {item.name}</span>
                        <span className="text-[#6E6E73] shrink-0">Rp {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <OrderTracker order={order} />
                    <RatingPanel order={order} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
