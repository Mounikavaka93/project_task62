import { Star } from 'lucide-react'
import { useMarket } from '../../context/useMarket'
import { Button } from '../ui/Button'

export function StockActions({ symbol, size = 'sm', stop = true }) {
  const { watchlist, toggleWatch, openTrade } = useMarket()
  const watched = watchlist.includes(symbol)

  function guard(event) {
    if (stop) event.stopPropagation()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-pressed={watched}
        onClick={(event) => {
          guard(event)
          toggleWatch(symbol)
        }}
        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-amber-300/50 hover:text-amber-200"
      >
        <Star className={`h-4 w-4 ${watched ? 'fill-amber-300 text-amber-300' : ''}`} />
      </button>
      <Button
        size={size}
        variant="buy"
        onClick={(event) => {
          guard(event)
          openTrade(symbol, 'buy')
        }}
      >
        Buy
      </Button>
      <Button
        size={size}
        variant="sell"
        onClick={(event) => {
          guard(event)
          openTrade(symbol, 'sell')
        }}
      >
        Sell
      </Button>
    </div>
  )
}
