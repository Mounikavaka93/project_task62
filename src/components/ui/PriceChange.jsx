import { TrendingDown, TrendingUp } from 'lucide-react'

export function PriceChange({ percent, detail, className = '' }) {
  const up = percent > 0
  const flat = percent === 0
  const Icon = up ? TrendingUp : TrendingDown
  const color = flat ? 'text-slate-400' : up ? 'text-emerald-300' : 'text-rose-300'

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-medium tabular-nums ${color} ${className}`}>
      {!flat && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
      <span>{up ? '+' : ''}{percent.toFixed(2)}%</span>
      {detail && <span className="font-mono text-[0.92em]">{detail}</span>}
    </span>
  )
}
