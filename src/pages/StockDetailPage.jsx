import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPriceSeries, getStock, summarizeBook } from '../data/market'
import { useMarket } from '../context/useMarket'
import { usePageTitle } from '../lib/hooks'
import { compactNumber, compactUsd, currency, signedCurrency } from '../lib/format'
import { AreaTrend } from '../components/charts/AreaTrend'
import { StockActions } from '../components/markets/StockActions'
import { Button } from '../components/ui/Button'
import { DayRange } from '../components/ui/DayRange'
import { Monogram } from '../components/ui/Monogram'
import { PriceChange } from '../components/ui/PriceChange'
import { Container, PageHeader } from '../components/ui/Section'

const ranges = ['1D', '1W', '1M', '3M', '1Y']

export function StockDetailPage() {
  const { symbol } = useParams()
  const stock = getStock(symbol)
  usePageTitle(stock ? `${stock.symbol} · Halden` : 'Symbol · Halden')
  const [range, setRange] = useState('3M')
  const { holdings, cash } = useMarket()
  const series = useMemo(() => (stock ? getPriceSeries(stock.symbol, range) : []), [stock, range])
  const book = summarizeBook(holdings, cash)
  const position = book.rows.find((row) => row.symbol === stock?.symbol)

  if (!stock) {
    return (
      <>
        <PageHeader eyebrow="Stocks" title="Symbol not in the sample book" description="The desk only prices the sixteen names in this demonstration." />
        <Container className="py-10">
          <Button to="/stocks">Back to stocks</Button>
        </Container>
      </>
    )
  }

  const stats = [
    ['Open', currency(stock.open)],
    ['Previous close', currency(stock.prevClose)],
    ['Volume', compactNumber(stock.volume)],
    ['Market cap', compactUsd(stock.marketCap)],
    ['P/E', stock.pe.toFixed(1)],
    ['Dividend yield', stock.dividend ? `${stock.dividend.toFixed(2)}%` : '—'],
    ['Sector', stock.sector],
    ['Exchange', stock.exchange],
  ]

  return (
    <>
      <PageHeader
        eyebrow={`${stock.symbol} · ${stock.exchange}`}
        title={stock.name}
        description={stock.summary}
        action={<StockActions symbol={stock.symbol} size="md" />}
      />
      <Container className="py-10 sm:py-14">
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <p className="font-mono text-4xl text-white sm:text-5xl">{currency(stock.price)}</p>
          <PriceChange percent={stock.changePercent} detail={signedCurrency(stock.price - stock.prevClose)} className="text-base" />
        </div>
        <article className="rounded-3xl border border-white/10 bg-[#0c1b2e]/70 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Monogram symbol={stock.symbol} />
              <p className="text-sm text-slate-400">Sample path · {range}</p>
            </div>
            <div className="flex gap-2" role="group" aria-label="Chart range">
              {ranges.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={range === item}
                  onClick={() => setRange(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${range === item ? 'bg-emerald-300 text-[#06101c]' : 'bg-white/5 text-slate-300'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <AreaTrend
              key={`${stock.symbol}-${range}`}
              data={series}
              color={stock.changePercent >= 0 ? '#34d399' : '#fb7185'}
              formatValue={currency}
              formatAxis={(value) => compactUsd(value)}
              ariaLabel={`${stock.symbol} sample ${range} path ending at ${currency(stock.price)}`}
            />
          </div>
        </article>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 p-5">
            <h2 className="font-display text-xl font-semibold">Session range</h2>
            <div className="mt-4">
              <DayRange low={stock.low} high={stock.high} price={stock.price} />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-slate-500">Illustrative fundamentals. Not a research report.</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-display text-xl font-semibold">Your position</h2>
            {position ? (
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-slate-400">Shares</dt><dd className="font-mono">{position.shares}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-400">Average cost</dt><dd className="font-mono">{currency(position.avgCost)}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-400">Market value</dt><dd className="font-mono">{currency(position.marketValue)}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-400">Unrealized P/L</dt><dd><PriceChange percent={position.pnlPercent} detail={signedCurrency(position.pnl)} /></dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-400">Weight</dt><dd className="font-mono">{position.weight.toFixed(1)}%</dd></div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-400">You do not hold {stock.symbol}. A buy will open the position at the fill price.</p>
            )}
            <div className="mt-6">
              <StockActions symbol={stock.symbol} size="md" />
            </div>
            <Link to="/portfolio" className="mt-4 inline-block text-sm font-semibold text-emerald-300">View the full book</Link>
          </article>
        </div>
      </Container>
    </>
  )
}
