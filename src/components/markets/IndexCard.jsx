import { Link } from 'react-router-dom'
import { formatQuote, signedMove } from '../../lib/format'
import { getPriceSeries, sessionState } from '../../data/market'
import { PriceChange } from '../ui/PriceChange'
import { Sparkline } from '../ui/Sparkline'
import { StatusPill } from '../ui/StatusPill'

export function IndexCard({ index, now, active = false, to, onSelect }) {
  const status = sessionState(now, index)
  const spark = getPriceSeries(index.symbol, '1M').slice(-24).map((point) => point.value)
  const className = `card-lift flex h-full w-full flex-col rounded-2xl border p-4 text-left hover:border-emerald-300/40 hover:bg-white/[0.05] ${active ? 'border-emerald-300/50 bg-emerald-300/5' : 'border-white/10 bg-white/[0.03]'}`

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">{index.name}</h3>
          <p className="mt-1 text-xs text-slate-400">{index.symbol} · {index.exchange}</p>
        </div>
        <StatusPill status={status} />
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-2xl tracking-tight text-white">{formatQuote(index.unit, index.price)}</p>
          <div className="mt-2">
            <PriceChange percent={index.changePercent} detail={signedMove(index.unit, index.price - index.prevClose)} />
          </div>
        </div>
        <Sparkline data={spark} positive={index.changePercent >= 0} className="ml-auto" />
      </div>
      <p className="mt-4 text-xs text-slate-500">{index.region} · {index.opens}–{index.closes} local</p>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onSelect} aria-pressed={active} className={className}>
      {body}
    </button>
  )
}
