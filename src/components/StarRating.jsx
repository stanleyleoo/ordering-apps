import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ value, onChange, size = 24, readOnly = false }) {
  const [hover, setHover] = useState(0)
  const active = hover || value || 0

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => {
        const filled = n <= active
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onTouchStart={() => !readOnly && setHover(n)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90'} transition-transform`}
          >
            <Star
              size={size}
              className={filled ? 'text-[#D4A83C] fill-[#D4A83C]' : 'text-[#9A9A9E]'}
              strokeWidth={2}
            />
          </button>
        )
      })}
    </div>
  )
}
