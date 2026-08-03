import { useMemo, useState } from 'react'
import { DollarSign, ShoppingBag, Receipt, Star, TrendingUp, Clock, Users, Flame } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

const ranges = [
  { days: 7, label: '7D' },
  { days: 14, label: '14D' },
  { days: 30, label: '30D' },
]

const ratingColors = ['#E74C3C', '#E8652D', '#D4A83C', '#9DB83C', '#2D9B7A']

function BarChart({ data, color = '#E8652D' }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const showLabel = (i) => data.length <= 14 || i % 4 === 0 || i === data.length - 1

  return (
    <div className="flex items-end gap-1 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <div className="w-full rounded-t-md transition-all duration-500" style={{
            height: d.value > 0 ? `${Math.max((d.value / max) * 100, 3)}%` : '3%',
            background: d.value > 0 ? color : 'rgba(255,255,255,0.15)',
          }} />
          {showLabel(i) && <span className="text-[9px] text-[#6E6E73] truncate w-full text-center">{d.label}</span>}
        </div>
      ))}
    </div>
  )
}

function HBarList({ items, color = '#E8652D', format = v => v }) {
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1 gap-2">
            <span className="text-[#1D1D1F] truncate min-w-0">{item.label}</span>
            <span className="text-[#6E6E73] shrink-0">{format(item.value)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const { state } = useApp()
  const [range, setRange] = useState(7)

  const rangeOrders = useMemo(() => {
    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000
    return state.orders
      .filter(o => new Date(o.timestamp).getTime() >= cutoff && o.status !== 'cancelled')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [state.orders, range])

  const totalRevenue = rangeOrders.reduce((s, o) => s + o.total, 0)
  const avgOrder = rangeOrders.length ? Math.round(totalRevenue / rangeOrders.length) : 0
  const rated = rangeOrders.filter(o => o.rating)
  const avgRating = rated.length ? rated.reduce((s, o) => s + o.rating, 0) / rated.length : 0

  const revenueByDay = useMemo(() => {
    const dayMap = {}
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      dayMap[d.toDateString()] = {
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: 0,
      }
    }
    rangeOrders.forEach(o => {
      const key = new Date(o.timestamp).toDateString()
      if (dayMap[key]) dayMap[key].value += o.total
    })
    return Object.values(dayMap)
  }, [rangeOrders, range])

  const popularItems = useMemo(() => {
    const count = {}
    rangeOrders.forEach(o => o.items.forEach(i => {
      count[i.name] = (count[i.name] || 0) + i.qty
    }))
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }))
  }, [rangeOrders])

  const peakHours = useMemo(() => {
    const arr = Array.from({ length: 24 }, (_, h) => ({ label: `${String(h).padStart(2, '0')}:00`, value: 0 }))
    rangeOrders.forEach(o => {
      arr[new Date(o.timestamp).getHours()].value++
    })
    return arr.filter(h => h.value > 0)
  }, [rangeOrders])

  const customerStats = useMemo(() => {
    const map = {}
    rangeOrders.forEach(o => {
      const key = o.customer.phone
      if (!map[key]) map[key] = { label: o.customer.name, value: 0, orders: 0 }
      map[key].value += o.total
      map[key].orders++
    })
    return Object.values(map).sort((a, b) => b.value - a.value).slice(0, 6)
  }, [rangeOrders])

  const ratingDist = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]
    rangeOrders.filter(o => o.rating).forEach(o => { counts[o.rating - 1]++ })
    return counts
  }, [rangeOrders])
  const ratedCount = ratingDist.reduce((s, x) => s + x, 0)

  const donutStops = (() => {
    if (ratedCount === 0) return ''
    let acc = 0
    return ratingDist.map((c, i) => {
      const start = (acc / ratedCount) * 360
      acc += c
      const end = (acc / ratedCount) * 360
      return `${ratingColors[i]} ${start}deg ${end}deg`
    }).join(', ')
  })()

  const bestDay = revenueByDay.reduce((best, d) => d.value > best.value ? d : best, { value: 0 })
  const busiestHour = peakHours.reduce((best, h) => h.value > best.value ? h : best, { value: 0 })

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-2">
        <p className="text-sm text-[#6E6E73]">{rangeOrders.length} orders in period</p>
        <div className="flex gap-1 glass rounded-full p-1">
          {ranges.map(r => (
            <button key={r.days} onClick={() => setRange(r.days)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${range === r.days ? 'bg-[#E8652D] text-white' : 'text-[#6E6E73] hover:bg-white/30'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Revenue', value: `Rp ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#2D9B7A' },
          { label: 'Orders', value: rangeOrders.length, icon: Receipt, color: '#E8652D' },
          { label: 'Avg Order', value: `Rp ${avgOrder.toLocaleString()}`, icon: ShoppingBag, color: '#4F46E5' },
          { label: 'Avg Rating', value: ratedCount ? avgRating.toFixed(1) : '—', icon: Star, color: '#D4A83C' },
        ].map(item => (
          <div key={item.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6E6E73] font-medium">{item.label}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${item.color}15` }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
            </div>
            <p className="text-base md:text-xl font-bold text-[#1D1D1F] truncate">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] flex items-center gap-2"><TrendingUp size={16} className="text-[#E8652D]" /> Revenue Trend</h3>
          <div className="text-right">
            <p className="text-[10px] text-[#6E6E73]">Best day</p>
            <p className="text-xs font-bold text-[#1D1D1F]">{bestDay.label} <span className="text-[#2D9B7A]">Rp {bestDay.value.toLocaleString()}</span></p>
          </div>
        </div>
        <BarChart data={revenueByDay} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><Flame size={16} className="text-[#E8652D]" /> Popular Items</h3>
          {popularItems.length > 0
            ? <HBarList items={popularItems} format={v => `${v}x`} />
            : <p className="text-sm text-[#6E6E73]">No data in this period</p>}
        </div>

        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><Clock size={16} className="text-[#4F46E5]" /> Peak Hours</h3>
          {peakHours.length > 0 ? (
            <>
              <HBarList items={peakHours.slice(0, 6)} color="#4F46E5" format={v => `${v} orders`} />
              <p className="text-xs text-[#6E6E73] mt-3">Busiest hour: <strong className="text-[#4F46E5]">{busiestHour.label}</strong> ({busiestHour.value} orders)</p>
            </>
          ) : <p className="text-sm text-[#6E6E73]">No data in this period</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><Users size={16} className="text-[#2D9B7A]" /> Top Customers</h3>
          {customerStats.length > 0 ? (
            <div className="space-y-2">
              {customerStats.map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/10 last:border-0">
                  <span className="w-5 text-xs font-bold text-[#6E6E73]">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-[#E8652D]/10 flex items-center justify-center text-xs font-bold text-[#E8652D] flex-shrink-0">
                    {c.label.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1D1D1F] truncate">{c.label}</p>
                    <p className="text-[10px] text-[#6E6E73]">{c.orders} orders</p>
                  </div>
                  <span className="text-sm font-bold text-[#E8652D] shrink-0">Rp {c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-[#6E6E73]">No data in this period</p>}
        </div>

        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm text-[#1D1D1F] mb-3 flex items-center gap-2"><Star size={16} className="text-[#D4A83C]" /> Rating Distribution</h3>
          {ratedCount > 0 ? (
            <div className="flex items-center gap-5">
              <div className="w-28 h-28 rounded-full flex-shrink-0 relative" style={{ background: `conic-gradient(${donutStops})` }}>
                <div className="absolute inset-3 rounded-full bg-white/70 backdrop-blur flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#1D1D1F]">{avgRating.toFixed(1)}</span>
                  <span className="text-[10px] text-[#6E6E73]">avg</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingDist.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-[#1D1D1F] w-6">{i + 1}★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/30 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(c / ratedCount) * 100}%`, background: ratingColors[i] }} />
                    </div>
                    <span className="text-[#6E6E73] w-5 text-right">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-[#6E6E73]">No ratings in this period</p>}
        </div>
      </div>
    </div>
  )
}
