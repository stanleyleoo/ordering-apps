import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, X, ChevronRight, Phone, User, Store } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { categories, paymentMethods } from '../../data/mockData'

function CartDrawer({ open, onClose }) {
  const { state, dispatch } = useApp()
  const [phone, setPhone] = useState(state.phoneInput)
  const [name, setName] = useState(state.customerName)
  const [step, setStep] = useState('cart')
  const [selectedPayment, setSelectedPayment] = useState('')

  const total = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const handlePhoneChange = (val) => {
    setPhone(val)
    dispatch({ type: 'SET_PHONE', payload: val })
    if (val.length >= 10) {
      const found = state.customers.find(c => c.phone === val)
      if (found) {
        setName(found.name)
        dispatch({ type: 'SET_CUSTOMER', payload: found })
        dispatch({ type: 'SET_CUSTOMER_NAME', payload: found.name })
      } else {
        setName('')
        dispatch({ type: 'SET_CUSTOMER', payload: null })
        dispatch({ type: 'SET_CUSTOMER_NAME', payload: '' })
      }
    }
  }

  const handlePlaceOrder = () => {
    if (!phone || !name || !selectedPayment) return
    let customer = state.customers.find(c => c.phone === phone)
    if (!customer) {
      customer = { id: `CUS-${String(state.customers.length + 1).padStart(3, '0')}`, name, phone, email: '' }
      dispatch({ type: 'ADD_CUSTOMER', payload: customer })
    }
    dispatch({
      type: 'ADD_ORDER',
      payload: { customer: { ...customer, name }, items: state.cart, total, paymentMethod: selectedPayment },
    })
    navigate('/receipt')
  }

  const navigate = useNavigate()

  if (!open) return null

  const renderCart = () => (
    <div className="space-y-3">
      {state.cart.length === 0 ? (
        <div className="text-center py-12 text-[#6E6E73]">
          <ShoppingCart size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Your cart is empty</p>
          <p className="text-sm mt-1">Add items from the menu</p>
        </div>
      ) : (
        <>
          {state.cart.map(item => (
            <div key={item.productId} className="glass-card p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1D1D1F]">{item.name}</p>
                <p className="text-sm font-bold text-[#E8652D]">Rp {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { productId: item.productId, qty: item.qty - 1 } })} className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition"><Minus size={14} /></button>
                <span className="w-6 text-center font-semibold text-sm">{item.qty}</span>
                <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { productId: item.productId, qty: item.qty + 1 } })} className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition"><Plus size={14} /></button>
              </div>
              <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId })} className="p-1 text-[#6E6E73] hover:text-[#E74C3C] transition"><X size={16} /></button>
            </div>
          ))}
          <div className="glass-card p-4 mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-[#6E6E73]">Subtotal</span>
              <span className="font-bold text-[#1D1D1F]">Rp {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-[#E8652D]">Rp {total.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => setStep('checkout')} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
            Checkout <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  )

  const renderCheckout = () => (
    <div className="space-y-4 animate-fadeIn">
      <button onClick={() => setStep('cart')} className="btn-ghost text-sm text-[#6E6E73]">&larr; Back to cart</button>
      <h3 className="font-semibold text-lg text-[#1D1D1F]">Customer Info</h3>
      <div>
        <label className="text-sm font-medium text-[#6E6E73] mb-1 block">Phone Number</label>
        <div className="relative">
          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
          <input
            type="tel" value={phone} onChange={e => handlePhoneChange(e.target.value)}
            placeholder="e.g. 08123456789" className="input-glass pl-11"
          />
        </div>
      </div>
      {phone.length >= 10 && (
        <div className="animate-fadeIn">
          <label className="text-sm font-medium text-[#6E6E73] mb-1 block">Name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={state.identifiedCustomer ? '' : 'Enter your name'}
              className="input-glass pl-11"
              readOnly={!!state.identifiedCustomer}
            />
          </div>
          {state.identifiedCustomer && <p className="text-xs text-[#2D9B7A] mt-1">Welcome back, {state.identifiedCustomer.name}!</p>}
          {!state.identifiedCustomer && phone.length >= 10 && name && <p className="text-xs text-[#6E6E73] mt-1">New customer will be registered</p>}
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-[#6E6E73] mb-2 block">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map(pm => (
            <button key={pm.id} onClick={() => setSelectedPayment(pm.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedPayment === pm.id
                  ? 'glass-card border-[#E8652D] border-2'
                  : 'glass hover:bg-white/30'
              }`}
            >
              <span className="text-2xl block mb-1">{pm.icon}</span>
              <p className="text-xs font-medium text-[#1D1D1F]">{pm.name}</p>
              <p className="text-[10px] text-[#6E6E73] mt-0.5">{pm.description}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="flex justify-between text-sm"><span className="text-[#6E6E73]">Items</span><span>{state.cart.reduce((s,i) => s + i.qty, 0)}</span></div>
        <div className="flex justify-between text-lg font-bold mt-2"><span>Total</span><span className="text-[#E8652D]">Rp {total.toLocaleString()}</span></div>
      </div>
      <button onClick={handlePlaceOrder} disabled={!phone || !name || !selectedPayment}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        Place Order <ChevronRight size={18} />
      </button>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => { if (step === 'cart') onClose(); else setStep('cart') }} />
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-t-3xl p-5 max-h-[85dvh] overflow-y-auto animate-slideUp shadow-2xl" style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#1D1D1F]">{step === 'cart' ? 'Your Order' : 'Checkout'}</h2>
          <button onClick={() => { if (step === 'cart') onClose(); else setStep('cart') }} className="p-1 rounded-full hover:bg-white/30"><X size={20} /></button>
        </div>
        {step === 'cart' ? renderCart() : renderCheckout()}
      </div>
    </div>
  )
}

export default function OrderMenu() {
  const { state, dispatch } = useApp()
  const [showCart, setShowCart] = useState(false)

  const filtered = state.activeCategory === 'All'
    ? state.products
    : state.products.filter(p => p.category === state.activeCategory)

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div>
      <div className="mb-6">
        <div className="glass-card p-4 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#E8652D]/10 flex items-center justify-center text-xl"><Store /></div>
          <div>
            <h2 className="font-bold text-lg text-[#1D1D1F]">Welcome!</h2>
            <p className="text-sm text-[#6E6E73]">Browse our menu and place your order</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button key={cat} onClick={() => dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: cat })}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                state.activeCategory === cat ? 'tab-active shadow-lg shadow-[#E8652D]/20' : 'glass hover:bg-white/30 text-[#1D1D1F]'
              }`}
            >
              {cat === 'All' ? 'All Menu' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 animate-fadeIn">
        {filtered.map(product => (
          <div key={product.id} className="glass-card overflow-hidden group">
            <div className="relative aspect-square overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {product.bestseller && (
                <span className="absolute top-2 left-2 bg-[#D4A83C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">Best Seller</span>
              )}
              <button onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#E8652D] text-white flex items-center justify-center shadow-lg hover:bg-[#D4551F] transition active:scale-90"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm text-[#1D1D1F] leading-tight">{product.name}</p>
              <p className="text-xs text-[#6E6E73] mt-1 line-clamp-1">{product.description}</p>
              <p className="font-bold text-sm text-[#E8652D] mt-2">Rp {product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <button onClick={() => setShowCart(true)}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 glass px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-slideUp hover:bg-white/30 transition max-w-[90vw]"
          style={{ backdropFilter: 'blur(24px)' }}
        >
          <div className="relative">
            <ShoppingCart size={22} className="text-[#E8652D]" />
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#E8652D] text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
          </div>
          <span className="font-medium text-sm text-[#1D1D1F]">View Order</span>
          <span className="font-bold text-sm text-[#E8652D]">Rp {cartTotal.toLocaleString()}</span>
        </button>
      )}

      <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
    </div>
  )
}
