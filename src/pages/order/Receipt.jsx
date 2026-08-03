import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Printer, Home, User, ClipboardList } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import OrderTracker from '../../components/OrderTracker'

export default function Receipt() {
  const navigate = useNavigate()
  const { state } = useApp()
  const order = state.lastOrder
  const [show, setShow] = useState(false)

  useEffect(() => { setShow(true) }, [])

  useEffect(() => {
    if (!order) navigate('/order')
  }, [order, navigate])

  if (!order) return null

  const getMethodIcon = (m) => {
    const map = { cash: '💰', qr: '📱', card: '💳' }
    return map[m] || '💵'
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className={`w-full max-w-sm transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-8 text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-[#2D9B7A]/10 flex items-center justify-center mx-auto mb-4">
            <div className="w-14 h-14 rounded-full bg-[#2D9B7A] flex items-center justify-center animate-checkmark">
              <Check size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1D1D1F]">Thank You!</h1>
          <p className="text-[#6E6E73] mt-1">Your order has been placed</p>
          <div className="mt-4 glass inline-block px-6 py-2 rounded-full">
            <p className="text-xs text-[#6E6E73]">Order ID</p>
            <p className="text-xl font-bold text-[#1D1D1F]">{order.id}</p>
          </div>
        </div>

        <div className="mb-4">
          <OrderTracker order={order} />
        </div>

        <div className="glass-card p-5 mb-4">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
            <div className="w-10 h-10 rounded-full bg-[#E8652D]/10 flex items-center justify-center text-lg"><User size={18} className="text-[#E8652D]" /></div>
            <div>
              <p className="font-semibold text-sm text-[#1D1D1F]">{order.customer.name}</p>
              <p className="text-xs text-[#6E6E73]">{order.customer.phone}</p>
            </div>
          </div>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#1D1D1F]"><span className="font-medium">{item.qty}x</span> {item.name}</span>
                <span className="font-medium text-[#1D1D1F]">Rp {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-white/20">
            <span className="font-bold text-[#1D1D1F]">Total</span>
            <span className="font-bold text-lg text-[#E8652D]">Rp {order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="glass-card p-4 mb-4 flex items-center gap-3">
          <span className="text-2xl">{getMethodIcon(order.paymentMethod)}</span>
          <div>
            <p className="text-sm font-medium text-[#1D1D1F]">Payment Method</p>
            <p className="text-xs text-[#6E6E73] capitalize">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="glass-card p-4 mb-4 text-center">
          <p className="text-sm text-[#6E6E73]">
            {order.paymentMethod === 'cash' ? 'Please pay at the counter' :
             order.paymentMethod === 'qr' ? 'Please scan QR code at the counter' :
             'Please tap your card at the terminal'}
          </p>
          <p className="text-xs text-[#6E6E73] mt-2">Show this screen to the cashier</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => navigate('/order')} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Home size={18} /> Back to Menu
          </button>
          <button onClick={() => window.print()} className="btn-secondary flex items-center justify-center gap-2 px-4">
            <Printer size={18} />
          </button>
        </div>
        <button onClick={() => navigate('/orders')} className="mt-3 w-full btn-ghost flex items-center justify-center gap-2 text-sm text-[#6E6E73]">
          <ClipboardList size={16} /> Track your orders
        </button>
      </div>
    </div>
  )
}
