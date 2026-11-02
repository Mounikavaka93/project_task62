import { ArrowRight } from 'lucide-react'
import { breadth, formatZoneTime, getPriceSeries, getStock, sessionState, summarizeBook, worldSessions } from '../../data/market'
import { useMarket } from '../../context/useMarket'
import { useNow } from '../../lib/hooks'
import { compactNumber, currency, signedCurrency, signedMove } from '../../lib/format'
import { Button } from '../ui/Button'
import { Monogram } from '../ui/Monogram'
import { PriceChange } from '../ui/PriceChange'
import { StatusPill } from '../ui/StatusPill'
import { AreaTrend } from '../charts/AreaTrend'
import { Container } from '../ui/Section'

export function Hero() {
  const now = useNow()
  const stock = getStock('NVDA')
  const series = getPriceSeries('NVDA', '1D')
  const nyse = sessionState(now, worldSessions[0])
  const book = useMarket()
  const summary = summarizeBook(book.holdings, book.cash)
  const tape = breadth()

  function scrollToTrade(event) {
    event.preventDefault()
    document.getElementById('trade')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative pt-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="dot-grid absolute inset-0" />
        <div className="orb absolute -top-24 left-[-4rem] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="orb-delayed absolute top-10 right-[-3rem] h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <svg className="absolute right-[-2rem] bottom-24 hidden h-72 w-[28rem] opacity-30 lg:block" viewBox="0 0 420 220" aria-hidden="true">
          {[40, 78, 116, 154, 192, 230, 268, 306, 344].map((x, index) => {
            const height = 40 + ((index * 37) % 90)
            const y = 160 - height
            return (
              <rect
                key={x}
                className="candle"
                x={x}
                y={y}
                width="16"
                height={height}
                rx="3"
                fill={index % 4 === 2 ? '#fb7185' : '#34d399'}
                style={{ animationDelay: `${index * 80}ms` }}
              />
            )
          })}
        </svg>
      </div>

      <Container className="relative grid min-w-0 items-center gap-12 py-14 sm:py-16 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-10">
        <div className="animate-rise min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={nyse} />
            <p className="text-sm text-slate-300">
              NYSE {formatZoneTime(now, 'America/New_York')} ET
            </p>
          </div>
          <h1 className="mt-5 max-w-xl font-display text-4xl leading-[1.05] font-semibold tracking-tight break-words text-white sm:text-6xl lg:text-7xl">
            <span className="animate-line block">Trade the open.</span>
            <span className="animate-line mt-1 block bg-gradient-to-r from-emerald-300 via-sky-200 to-sky-400 bg-clip-text text-transparent [animation-delay:140ms]">
              Hold the long view.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed break-words text-slate-300 sm:text-lg">
            A calm desk for indices, equities, and the portfolio you are building — with a watchlist, an order ticket, and P/L that updates when you do.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={scrollToTrade}>
              Start trading
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/markets" size="lg" variant="secondary">Explore markets</Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">Simulated orders · Sample quotes · No account funding</p>
          <dl className="mt-10 grid grid-cols-[repeat(3,minmax(0,1fr))] items-start gap-2 border-t border-white/10 pt-6 sm:gap-3">
            {[
              ['8', 'Indices on the board'],
              ['16', 'Sample equities'],
              ['Instant', 'Simulated fills'],
            ].map(([value, label]) => (
              <div key={label} className="min-w-0">
                <dt className="truncate font-display text-lg font-semibold text-white sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-[11px] leading-snug text-slate-400 sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-float relative [animation-delay:200ms]">
          <article className="rounded-3xl border border-white/10 bg-[#0c1b2e]/80 p-4 shadow-[0_30px_80px_-40px_rgba(56,189,248,0.45)] backdrop-blur sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Monogram symbol={stock.symbol} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-semibold">{stock.symbol}</h2>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 motion-safe:animate-pulse" />
                  </div>
                  <p className="text-sm text-slate-400">{stock.name} · {stock.exchange}</p>
                </div>
              </div>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">Indicative</span>
            </div>
            <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <p className="font-mono text-3xl tracking-tight text-white sm:text-4xl">{currency(stock.price)}</p>
              <PriceChange percent={stock.changePercent} detail={signedMove('usd', stock.price - stock.prevClose)} />
            </div>
            <div className="mt-4">
              <AreaTrend
                data={series}
                height={168}
                compact
                color={stock.changePercent >= 0 ? '#34d399' : '#fb7185'}
                formatValue={currency}
                ariaLabel={`${stock.symbol} sample intraday path ending at ${currency(stock.price)}`}
              />
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-4">
              {[
                ['Open', currency(stock.open)],
                ['High', currency(stock.high)],
                ['Low', currency(stock.low)],
                ['Volume', compactNumber(stock.volume)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 font-mono text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                <p className="text-xs text-slate-400">Sample book today</p>
                <p className={`mt-1 font-mono text-lg ${summary.day >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{signedCurrency(summary.day)}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                <p className="text-xs text-slate-400">Names in the book</p>
                <p className="mt-1 text-lg font-semibold text-white">{tape.up} up · {tape.down} down</p>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full" onClick={() => book.openTrade(stock.symbol, 'buy')}>Trade {stock.symbol}</Button>
            </div>
          </article>
        </div>
      </Container>
    </section>
  )
}
