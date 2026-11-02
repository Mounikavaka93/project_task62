import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { getPriceSeries, stocks } from '../../data/market'
import { useMarket } from '../../context/useMarket'
import { currency, signedCurrency } from '../../lib/format'
import { Button } from '../ui/Button'
import { Monogram } from '../ui/Monogram'
import { PriceChange } from '../ui/PriceChange'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'
import { Sparkline } from '../ui/Sparkline'
import { inputClass } from '../ui/Field'
import { StockActions } from '../markets/StockActions'

export function WatchlistBoard({ framed = true }) {
  const { watchlist, toggleWatch } = useMarket()
  const available = useMemo(
    () => stocks.filter((stock) => !watchlist.includes(stock.symbol)),
    [watchlist],
  )
  const [pick, setPick] = useState(available[0]?.symbol ?? '')
  const selected = available.some((stock) => stock.symbol === pick) ? pick : (available[0]?.symbol ?? '')
  const items = watchlist.map((symbol) => stocks.find((stock) => stock.symbol === symbol)).filter(Boolean)

  function addSymbol(event) {
    event.preventDefault()
    if (selected) toggleWatch(selected)
  }

  const content = (
    <>
      <form onSubmit={addSymbol} className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="watch-add">Add a stock</label>
        <select
          id="watch-add"
          className={inputClass}
          value={selected}
          onChange={(event) => setPick(event.target.value)}
          disabled={available.length === 0}
        >
          {available.length === 0 && <option value="">Every sample name is on the list</option>}
          {available.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>{stock.symbol} — {stock.name}</option>
          ))}
        </select>
        <Button type="submit" disabled={!selected} className="sm:w-auto">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 px-4 py-12 text-center">
          <p className="font-display text-2xl font-semibold">Your watchlist is empty</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">Add a sample name above, or star one from the stock board. Cards stay interactive after you do.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((stock) => {
            const spark = getPriceSeries(stock.symbol, '1M').slice(-24).map((point) => point.value)
            return (
              <article key={stock.symbol} className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/35 hover:bg-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/stocks/${stock.symbol}`} className="flex min-w-0 items-center gap-3">
                    <Monogram symbol={stock.symbol} />
                    <span className="min-w-0">
                      <span className="block font-semibold text-white">{stock.symbol}</span>
                      <span className="block truncate text-sm text-slate-400">{stock.name}</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWatch(stock.symbol)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-300 hover:border-rose-300/40 hover:text-rose-200"
                    aria-label={`Remove ${stock.symbol} from watchlist`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-2xl text-white">{currency(stock.price)}</p>
                    <div className="mt-1">
                      <PriceChange percent={stock.changePercent} detail={signedCurrency(stock.price - stock.prevClose)} />
                    </div>
                  </div>
                  <Sparkline data={spark} positive={stock.changePercent >= 0} />
                </div>
                <div className="mt-5">
                  <StockActions symbol={stock.symbol} />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )

  if (!framed) return content

  return (
    <Section id="watchlist">
      <Reveal>
        <SectionHeading
          eyebrow="Watchlist"
          title="Keep the next idea in reach"
          description="Add or remove sample names. Each card shows last price, the percentage change, and a one-month sparkline, with buy and sell on the card."
          action={<Button to="/watchlist" variant="secondary">Manage list</Button>}
        />
        {content}
      </Reveal>
    </Section>
  )
}
