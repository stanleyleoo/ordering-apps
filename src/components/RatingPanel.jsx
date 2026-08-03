import { useState } from 'react'
import { MessageCircleHeart, Send } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import StarRating from './StarRating'

export default function RatingPanel({ order }) {
  const { dispatch } = useApp()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  if (order.status !== 'completed') return null

  if (order.rating) {
    return (
      <div className="glass-card p-4 text-center animate-fadeIn">
        <p className="text-xs font-semibold text-[#6E6E73] mb-2">Your rating</p>
        <div className="flex justify-center">
          <StarRating value={order.rating} size={22} readOnly />
        </div>
        {order.review && <p className="text-sm text-[#1D1D1F] mt-2 italic">&ldquo;{order.review}&rdquo;</p>}
        <p className="text-[10px] text-[#2D9B7A] mt-2">Thanks for your feedback!</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 text-center animate-fadeIn">
      <div className="w-10 h-10 rounded-full bg-[#E8652D]/10 flex items-center justify-center mx-auto mb-3">
        <MessageCircleHeart size={20} className="text-[#E8652D]" />
      </div>
      <p className="font-semibold text-[#1D1D1F] mb-1">How was your order?</p>
      <p className="text-xs text-[#6E6E73] mb-4">Tap a star to rate your experience</p>
      <div className="flex justify-center mb-4">
        <StarRating value={rating} onChange={setRating} size={32} />
      </div>
      {rating > 0 && (
        <div className="animate-fadeIn">
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            rows={2}
            placeholder="Share your feedback (optional)..."
            className="input-glass mb-3 resize-none"
          />
          <button
            onClick={() => dispatch({ type: 'RATE_ORDER', payload: { orderId: order.id, rating, review } })}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Send size={16} /> Submit Review
          </button>
        </div>
      )}
    </div>
  )
}
