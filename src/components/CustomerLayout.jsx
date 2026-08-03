import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Home, ClipboardList, Settings } from 'lucide-react'

export default function CustomerLayout({ children }) {
  const navigate = useNavigate()
  const loc = useLocation()

  const nav = [
    { path: '/order', label: 'Menu', icon: Home },
    { path: '/orders', label: 'My Orders', icon: ClipboardList },
    { path: '/admin', label: 'Admin', icon: Settings },
  ]

  if (loc.pathname === '/receipt') return <>{children}</>

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="glass sticky top-0 z-40 mx-0 rounded-none" style={{ backdropFilter: 'blur(24px)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1D1D1F]">Cafe Ordering</h1>
            <p className="text-xs text-[#6E6E73]">Self-order your favorites</p>
          </div>
          <button onClick={() => navigate('/order')} className="btn-ghost p-2">
            <ShoppingBag size={22} className="text-[#E8652D]" />
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 py-4">
          {children}
        </div>
      </main>
      <nav className="sticky bottom-0 left-0 right-0 z-40 safe-bottom">
        <div className="glass rounded-t-2xl px-4 py-2 max-w-4xl mx-auto flex justify-around" style={{ backdropFilter: 'blur(24px)' }}>
          {nav.map(item => {
            const Icon = item.icon
            const active = loc.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all ${
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
