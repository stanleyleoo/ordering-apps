import { useMemo, useState } from 'react'
import { DollarSign, ClipboardList, TrendingUp, ShoppingBag, Clock, ChefHat, CheckCircle, XCircle, Star, Radio } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import StarRating from '../../components/StarRating'

const statusColors = {
  pending: { bg: 'bg-[#D4A83C]/10', text: 'text-[#D4A83C]', icon: Clock },
  preparing: { bg: 'bg-[#E8652D]/10', text: 'text-[#E8652D]', icon: ChefHat },
  completed: { bg: 'bg-[#2D9B7A]/10', text: 'text-[#2D9B7A]', icon: CheckCircle },
  cancelled: { bg: 'bg-[#E74C3C]/10', text: 'text-[#E74C3C]', icon: XCircle },
}

const statusLabels = { pending: 'Pending', preparing: 'Preparing', completed: 'Completed', cancelled: 'Cancelled' }

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const [confirm, setConfirm] = useState(null)

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString()
    return state.orders.filter(o => new Date(o.timestamp).toDateString() === today)
  }, [state.orders])

  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const pendingCount = todayOrders.filter(o => o.status === 'pending').length
  const preparingCount = todayOrders.filter(o => o.status === 'preparing').length

  const activeOrders = useMemo(() => state.orders.filter(o => o.status === 'pending' || o.status === 'preparing'), [state.orders])

  const popularItems = useMemo(() => {
    const count = {}
    todayOrders.forEach(o => o.items.forEach(i => { count[i.name] = (count[i.name] || 0) + i.qty }))
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [todayOrders])

  const paymentSplit = useMemo(() => {
    const count = {}
    todayOrders.forEach(o => { count[o.paymentMethod] = (count[o.paymentMethod] || 0) + 1 })
    const total = todayOrders.length || 1
    return Object.entries(count).map(([k, v]) => ({ method: k, count: v, pct: Math.round(v / total * 100) }))
  }, [todayOrders])

  const recentOrders = useMemo(() => todayOrders.slice(0, 5), [todayOrders])

  const ratedOrders = useMemo(() => state.orders.filter(o => o.rating), [state.orders])
  const avgRating = ratedOrders.length ? ratedOrders.reduce((s, o) => s + o.rating, 0) / ratedOrders.length : 0
  const recentRatings = useMemo(() => ratedOrders.slice().reverse().slice(0, 5), [ratedOrders])

  const handleConfirm = () => {
    if (!confirm) return
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: confirm.orderId, status: confirm.nextStatus } })
    setConfirm(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-[#6E6E73]">{todayOrders.length} orders today</p>
        <span className="glass px-3 py-1.5 rounded-full text-xs text-[#6E6E73]">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Revenue', value: `Rp ${todayRevenue.toLocaleString()}`, icon: DollarSign, color: '#2D9B7A' },
          { label: 'Orders', value: todayOrders.length, icon: ClipboardList, color: '#E8652D' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: '#D4A83C' },
          { label: 'Preparing', value: preparingCount, icon: ChefHat, color: '#E8652D' },
        ].map(item => (
          <div key={item.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6E6E73] font-medium">{item.label}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${item.color}15` }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
            </div>
            <p className="text-lg md:text-xl font-bold text-[#1D1D1F] truncate">{typeof item.value === 'number' && item.label !== 'Revenue' ? item.value : item.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-[#1D1D1F] flex items-center gap-2">
            <Radio size={16} className="text-[#2D9B7A]" /> Live Orders
            <span className="flex items-center gap-1 text-[10px] text-[#2D9B7A] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9B7A] animate-pulse" /> LIVE
            </span>
          </h3>
          <span className="text-xs text-[#6E6E73]">{activeOrders.length} active</span>
        </div>

        {activeOrders.length > 0 ? (
          <div className="space-y-3">
            {activeOrders.map(order => {
              const sColor = statusColors[order.status]
              const StatusIcon = sColor.icon
              return (
                <div key={order.id} className="glass-card p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1D1D1F] text-sm">{order.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sColor.bg} ${sColor.text} flex items-center gap-1`}>
                          <StatusIcon size={11} /> {statusLabels[order.status]}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6E73] mt-0.5 truncate">{order.customer.name} &middot; {order.customer.phone}</p>
                    </div>
                    <span className="text-sm font-bold text-[#E8652D] shrink-0">Rp {order.total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-[#6E6E73] mb-2">{order.items.length} item(s) &middot; {new Date(order.timestamp).toLocaleTimeString()}</p>
                  <div className="flex gap-2">
                    {order.status === 'pending' ? (
                      <button onClick={() => setConfirm({ orderId: order.id, nextStatus: 'preparing', label: 'Start Prepare' })}
                        className="flex-1 py-1.5 rounded-full text-[10px] font-medium bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20 transition-all flex items-center justify-center gap-1">
                        <ChefHat size={13} /> Start Prepare
                      </button>
                    ) : (
                      <button onClick={() => setConfirm({ orderId: order.id, nextStatus: 'completed', label: 'Complete' })}
                        className="flex-1 py-1.5 rounded-full text-[10px] font-medium bg-[#2D9B7A]/10 text-[#2D9B7A] hover:bg-[#2D9B7A]/20 transition-all flex items-center justify-center gap-1">
                        <CheckCircle size={13} /> Complete
                      </button>
                    )}
                    <button onClick={() => setConfirm({ orderId: order.id, nextStatus: 'cancelled', label: 'Cancel' })}
                      className="flex-1 py-1.5 rounded-full text-[10px] font-medium bg-[#E74C3C]/10 text-[#E74C3C] hover:bg-[#E74C3C]/20 transition-all flex items-center justify-center gap-1">
                      <XCircle size={13} /> Cancel
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Radio size={24} className="text-[#9A9A9E] mx-auto mb-2" />
            <p className="text-sm text-[#6E6E73]">No active orders right now</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-[#E8652D]" /> Popular Items Today</h3>
          {popularItems.length > 0 ? (
            <div className="space-y-2">
              {popularItems.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-[#6E6E73] w-4">{i + 1}</span>
                    <span className="text-sm text-[#1D1D1F] truncate">{name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1D1D1F] shrink-0">{qty}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-[#6E6E73]">No orders today yet</p>}
        </div>

        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><ShoppingBag size={16} className="text-[#2D9B7A]" /> Payment Split</h3>
          {paymentSplit.length > 0 ? (
            <div className="space-y-2">
              {paymentSplit.map(({ method, count, pct }) => (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#1D1D1F] capitalize">{method}</span>
                    <span className="text-[#6E6E73]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden">
                    <div className="h-full rounded-full bg-[#E8652D] transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-[#6E6E73]">No orders today yet</p>}
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3">Recent Orders</h3>
        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0 gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1D1D1F] truncate">{order.id} <span className="text-[#6E6E73]">- {order.customer.name}</span></p>
                  <p className="text-xs text-[#6E6E73]">{order.items.length} items &middot; {new Date(order.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-[#E8652D]">Rp {order.total.toLocaleString()}</span>
                  {order.status === 'pending' && <Clock size={14} className="text-[#D4A83C]" />}
                  {order.status === 'preparing' && <ChefHat size={14} className="text-[#E8652D]" />}
                  {order.status === 'completed' && <CheckCircle size={14} className="text-[#2D9B7A]" />}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-[#6E6E73]">No orders today yet</p>}
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-[#1D1D1F] flex items-center gap-2"><Star size={16} className="text-[#D4A83C]" /> Ratings &amp; Reviews</h3>
          {ratedOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1D1D1F]">{avgRating.toFixed(1)}</span>
              <StarRating value={Math.round(avgRating)} size={14} readOnly />
              <span className="text-xs text-[#6E6E73]">({ratedOrders.length})</span>
            </div>
          )}
        </div>
        {recentRatings.length > 0 ? (
          <div className="space-y-3">
            {recentRatings.map(order => (
              <div key={order.id} className="py-2 border-b border-white/10 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[#1D1D1F] truncate">{order.customer.name} <span className="text-[#6E6E73]">- {order.id}</span></p>
                  <StarRating value={order.rating} size={14} readOnly />
                </div>
                {order.review && <p className="text-xs text-[#6E6E73] mt-1">&ldquo;{order.review}&rdquo;</p>}
                <p className="text-[10px] text-[#9A9A9E] mt-1">{new Date(order.reviewedAt || order.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6E6E73]">No reviews yet. Ratings appear once orders are completed.</p>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div className="relative glass-card p-6 rounded-2xl max-w-sm w-full mx-4 animate-fadeIn text-center" style={{ backdropFilter: 'blur(24px)' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              confirm.label === 'Cancel' ? 'bg-[#E74C3C]/10' : 'bg-[#E8652D]/10'
            }`}>
              {confirm.label === 'Cancel'
                ? <XCircle size={22} className="text-[#E74C3C]" />
                : <ChefHat size={22} className="text-[#E8652D]" />
              }
            </div>
            <h3 className="font-bold text-[#1D1D1F] text-lg mb-1">Confirm {confirm.label}</h3>
            <p className="text-sm text-[#6E6E73] mb-5">Are you sure you want to <strong>{confirm.label.toLowerCase()}</strong> order <strong>{confirm.orderId}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 text-sm rounded-full border border-white/20 text-[#6E6E73] hover:bg-white/10 transition-all">Keep</button>
              <button onClick={handleConfirm} className={`flex-1 py-2.5 text-sm rounded-full font-medium text-white transition-all ${
                confirm.label === 'Cancel'
                  ? 'bg-[#E74C3C] hover:bg-[#E74C3C]/90'
                  : 'bg-[#E8652D] hover:bg-[#E8652D]/90'
              }`}>{confirm.label}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
