import { Fragment } from 'react'
import { Check, ChefHat, CheckCircle, XCircle } from 'lucide-react'

const steps = [
  { key: 'pending', label: 'Placed', icon: Check },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'completed', label: 'Ready', icon: CheckCircle },
]

const statusMessages = {
  pending: 'Order placed! Waiting for the kitchen to confirm.',
  preparing: 'The kitchen is preparing your order.',
  completed: 'Your order is ready! Enjoy your meal.',
  cancelled: 'This order has been cancelled.',
}

const statusLabels = { pending: 'Pending', preparing: 'Preparing', completed: 'Completed', cancelled: 'Cancelled' }

export default function OrderTracker({ order }) {
  const statusIndex = steps.findIndex(s => s.key === order.status)
  const isCancelled = order.status === 'cancelled'
  const isCompleted = order.status === 'completed'

  if (isCancelled) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#E74C3C]/10 flex items-center justify-center mx-auto mb-3">
          <XCircle size={28} className="text-[#E74C3C]" />
        </div>
        <p className="font-bold text-[#1D1D1F] text-lg">Order Cancelled</p>
        <p className="text-xs text-[#6E6E73] mt-1">{statusMessages.cancelled}</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-[#6E6E73]">Live Order Status</p>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 ${
          isCompleted ? 'bg-[#2D9B7A]/10 text-[#2D9B7A]' : 'bg-[#E8652D]/10 text-[#E8652D]'
        }`}>
          {isCompleted ? <CheckCircle size={11} /> : <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="flex items-start">
        {steps.map((step, i) => {
          const Icon = step.icon
          const current = i === statusIndex && !isCompleted
          const done = i < statusIndex || (isCompleted && i < steps.length - 1)
          const isReady = isCompleted && i === steps.length - 1
          const active = current || done || isReady

          const circleClass = done || isReady
            ? 'bg-[#2D9B7A] text-white'
            : current
              ? 'bg-[#E8652D] text-white shadow-lg shadow-[#E8652D]/30 animate-pulse'
              : 'bg-white/30 text-[#9A9A9E]'

          return (
            <Fragment key={step.key}>
              <div className="flex-1 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${circleClass}`}>
                  {done || isReady ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <p className={`mt-2 text-[10px] font-medium ${active ? 'text-[#1D1D1F]' : 'text-[#9A9A9E]'}`}>{step.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full mt-5 ${done || isCompleted ? 'bg-[#2D9B7A]' : 'bg-white/30'}`} />
              )}
            </Fragment>
          )
        })}
      </div>

      <p className="text-sm text-[#6E6E73] text-center mt-4">{statusMessages[order.status]}</p>
    </div>
  )
}
