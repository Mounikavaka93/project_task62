import { currency } from '../../lib/format'

export function DayRange({ low, high, price }) {
  const span = high - low || 1
  const percent = Math.min(100, Math.max(0, ((price - low) / span) * 100))

  return (
    <div>
      <div className="relative h-1.5 rounded-full bg-white/10">
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#06101c] bg-emerald-300"
          style={{ left: `calc(${percent}% - 7px)` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>Low {currency(low)}</span>
        <span>High {currency(high)}</span>
      </div>
    </div>
  )
}
