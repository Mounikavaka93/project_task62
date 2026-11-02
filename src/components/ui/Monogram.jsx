import { useId } from 'react'
import { getStock } from '../../data/market'

export function Monogram({ symbol, size = 40 }) {
  const stock = getStock(symbol)
  const [from, to] = stock?.tone ?? ['#6ee7b7', '#0f766e']
  const id = useId().replace(/:/g, '')
  const label = symbol.slice(0, symbol.length > 4 ? 3 : 4)
  const fontSize = label.length >= 4 ? 8 : label.length === 3 ? 9 : 12

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${id})`} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill="#06101c"
        fontFamily="Manrope, sans-serif"
      >
        {label}
      </text>
    </svg>
  )
}
