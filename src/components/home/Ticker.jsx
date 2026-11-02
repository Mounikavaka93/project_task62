import { indices, stocks } from '../../data/market'
import { formatQuote, signedMove } from '../../lib/format'
import { PriceChange } from '../ui/PriceChange'

const tape = [...indices, ...stocks]

export function Ticker() {
  const items = [...tape, ...tape]

  return (
    <div className="ticker overflow-hidden border-y border-white/10 bg-black/25">
      <div className="animate-marquee flex w-max py-3">
        {items.map((item, index) => (
          <span key={`${item.symbol}-${index}`} className="mx-5 inline-flex items-center gap-2 text-sm">
            <span className="font-semibold text-white">{item.symbol}</span>
            <span className="font-mono text-slate-300">{formatQuote(item.unit, item.price)}</span>
            <PriceChange percent={item.changePercent} detail={signedMove(item.unit, item.price - item.prevClose)} />
          </span>
        ))}
      </div>
    </div>
  )
}
