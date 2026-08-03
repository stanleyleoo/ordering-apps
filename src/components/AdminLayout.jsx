import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ClipboardList, BarChart3, ArrowLeft } from 'lucide-react'

const nav = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const loc = useLocation()

  return (
    <div className="flex min-h-dvh overflow-x-hidden">
      <aside className="hidden md:flex flex-col w-64 glass m-4 rounded-2xl h-[calc(100dvh-32px)] safe-bottom" style={{ backdropFilter: 'blur(24px)' }}>
        <div className="p-5 border-b border-white/20">
          <h1 className="text-lg font-bold text-[#1D1D1F]">Cafe Admin</h1>
          <p className="text-xs text-[#6E6E73] mt-0.5">Simple Ordering Apps</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(item => {
            const Icon = item.icon
            const active = loc.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                  active ? 'bg-[#E8652D] text-white shadow-lg shadow-[#E8652D]/20' : 'text-[#1D1D1F] hover:bg-white/20'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={() => navigate('/order')} className="flex items-center gap-2 text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
            <ArrowLeft size={16} /> Back to Order Menu
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 min-h-dvh pb-20 md:pb-4 flex flex-col">
        <div className="sticky top-0 z-30 glass rounded-none mx-0 px-4 md:px-6 py-3" style={{ backdropFilter: 'blur(24px)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="font-bold text-lg text-[#1D1D1F]">
              {loc.pathname === '/admin' && 'Dashboard'}
              {loc.pathname === '/admin/products' && 'Products'}
              {loc.pathname === '/admin/customers' && 'Customers'}
              {loc.pathname === '/admin/orders' && 'Orders'}
              {loc.pathname === '/admin/reports' && 'Reports'}
            </h1>
            <button onClick={() => navigate('/order')} className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] transition-colors md:hidden flex items-center gap-1">
              <ArrowLeft size={14} /> Menu
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="overflow-x-hidden min-h-full">
            <div className="max-w-6xl mx-auto p-4 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="glass rounded-t-2xl px-2 py-2 flex justify-around" style={{ backdropFilter: 'blur(24px)' }}>
          {nav.map(item => {
            const Icon = item.icon
            const active = loc.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  active ? 'text-[#E8652D]' : 'text-[#6E6E73]'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
