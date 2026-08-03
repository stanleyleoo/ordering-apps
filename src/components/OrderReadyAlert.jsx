import { useEffect, useRef, useState } from 'react'
import { Bell, ChefHat, X } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = ctx.currentTime + i * 0.16
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.35, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.65)
    })
    setTimeout(() => ctx.close(), 1500)
  } catch { /* audio not available */ }
}

export default function OrderReadyAlert() {
  const { state } = useApp()
  const order = state.lastOrder
  const [show, setShow] = useState(false)
  const prevStatusRef = useRef(order?.status)
  const notifiedIdRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!order) return
    const prev = prevStatusRef.current
    if (order.status === 'completed' && prev !== 'completed' && notifiedIdRef.current !== order.id) {
      notifiedIdRef.current = order.id
      setShow(true)
      playChime()
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      timerRef.current = setTimeout(() => setShow(false), 8000)
    }
    prevStatusRef.current = order.status
  }, [order])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!order || !show) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShow(false)} />
      <div className="relative w-full max-w-sm glass-card p-8 rounded-3xl text-center animate-ready" style={{ backdropFilter: 'blur(24px)' }}>
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20">
          <X size={18} className="text-[#6E6E73]" />
        </button>

        <div className="w-20 h-20 rounded-full bg-[#2D9B7A]/10 flex items-center justify-center mx-auto mb-4 animate-ready-pulse">
          <div className="w-14 h-14 rounded-full bg-[#2D9B7A] flex items-center justify-center">
            <Bell size={26} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1D1D1F]">Order Ready!</h2>
        <p className="text-[#6E6E73] mt-1">Your order <strong className="text-[#E8652D]">{order.id}</strong> is ready for pickup</p>

        <div className="mt-5 glass-card p-3 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-[#E8652D]/10 flex items-center justify-center">
            <ChefHat size={18} className="text-[#E8652D]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1D1D1F]">{order.items.length} item(s)</p>
            <p className="text-xs text-[#6E6E73] truncate">{order.items.map(i => i.name).join(', ')}</p>
          </div>
        </div>

        <button onClick={() => setShow(false)} className="btn-primary w-full mt-5">
          Enjoy your meal!
        </button>
      </div>
    </div>
  )
}
