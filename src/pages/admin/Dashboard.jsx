import { useMemo } from 'react'
import { DollarSign, ClipboardList, TrendingUp, ShoppingBag, Clock, ChefHat, CheckCircle } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export default function Dashboard() {
  const { state } = useApp()

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString()
    return state.orders.filter(o => new Date(o.timestamp).toDateString() === today)
  }, [state.orders])

  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const pendingCount = todayOrders.filter(o => o.status === 'pending').length
  const preparingCount = todayOrders.filter(o => o.status === 'preparing').length

  const popularItems = useMemo(() => {
    const count = {}
    todayOrders.forEach(o => o.items.forEach(i => { count[i.name] = (count[i.name] || 0) + i.qty }))
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [todayOrders])

  const statusCounts = { pending: todayOrders.filter(o => o.status === 'pending').length, preparing: todayOrders.filter(o => o.status === 'preparing').length, completed: todayOrders.filter(o => o.status === 'completed').length, cancelled: todayOrders.filter(o => o.status === 'cancelled').length }

  const paymentSplit = useMemo(() => {
    const count = {}
    todayOrders.forEach(o => { count[o.paymentMethod] = (count[o.paymentMethod] || 0) + 1 })
    const total = todayOrders.length || 1
    return Object.entries(count).map(([k, v]) => ({ method: k, count: v, pct: Math.round(v / total * 100) }))
  }, [todayOrders])

  const recentOrders = useMemo(() => todayOrders.slice(0, 5), [todayOrders])

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-[#E8652D]" /> Popular Items Today</h3>
          {popularItems.length > 0 ? (
            <div className="space-y-2">
              {popularItems.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#6E6E73] w-4">{i + 1}</span>
                    <span className="text-sm text-[#1D1D1F]">{name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1D1D1F]">{qty}</span>
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

      <div className="glass-card p-4">
        <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3">Recent Orders</h3>
        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1D1D1F]">{order.id} <span className="text-[#6E6E73]">- {order.customer.name}</span></p>
                  <p className="text-xs text-[#6E6E73]">{order.items.length} items &middot; {new Date(order.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className="flex items-center gap-2">
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
    </div>
  )
}
