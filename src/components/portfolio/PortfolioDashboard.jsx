import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ChartLine, CircleDollarSign, Wallet } from 'lucide-react'
import { portfolioPath, summarizeBook } from '../../data/market'
import { useMarket } from '../../context/useMarket'
import { compactUsd, currency, signedCurrency } from '../../lib/format'
import { AllocationDonut } from '../charts/AllocationDonut'
import { AreaTrend } from '../charts/AreaTrend'
import { Button } from '../ui/Button'
import { Monogram } from '../ui/Monogram'
import { PriceChange } from '../ui/PriceChange'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'

const ranges = [
  { id: '1M', points: 21 },
  { id: '3M', points: 63 },
  { id: '6M', points: 126 },
]

const slicePalette = ['#34d399', '#38bdf8', '#fbbf24', '#e879f9', '#fb7185', '#22d3ee', '#fdba74', '#a5b4fc']

function colorForSlice(id, index) {
  if (id === 'CASH') return '#94a3b8'
  if (id === 'OTHER') return '#64748b'
  return slicePalette[index % slicePalette.length]
}

function Stat({ icon: Icon, label, value, detail, tone = 'text-white' }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-emerald-300" aria-hidden="true" />
      </div>
      <p className={`mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${tone}`}>{value}</p>
      <div className="mt-2 text-sm text-slate-400">{detail}</div>
    </article>
  )
}

export function PortfolioDashboard({ framed = true, showOrders = false, showReset = false }) {
  const { holdings, cash, orders, resetBook } = useMarket()
  const [range, setRange] = useState('3M')
  const [confirmReset, setConfirmReset] = useState(false)
  const book = useMemo(() => summarizeBook(holdings, cash), [holdings, cash])
  const points = ranges.find((item) => item.id === range)?.points ?? 63
  const path = useMemo(
    () => portfolioPath(points).map((point) => ({ label: point.label, value: point.ratio * book.total })),
    [points, book.total],
  )

  const slices = useMemo(() => {
    const items = [
      ...book.rows.map((row) => ({ id: row.symbol, label: row.symbol, value: row.marketValue })),
      { id: 'CASH', label: 'Cash', value: book.cash },
    ].filter((item) => item.value > 0)
    items.sort((a, b) => b.value - a.value)
    const maxSlices = 6
    const trimmed = items.length <= maxSlices
      ? items
      : [...items.slice(0, maxSlices - 1), {
        id: 'OTHER',
        label: 'Other',
        value: items.slice(maxSlices - 1).reduce((sum, item) => sum + item.value, 0),
      }]
    return trimmed.map((item, index) => ({ ...item, color: colorForSlice(item.id, index) }))
  }, [book])

  const largest = book.rows[0]
  const insights = [
    largest ? `${largest.symbol} is the largest holding at ${largest.weight.toFixed(1)}% of invested capital.` : 'The book is all cash.',
    book.cost ? `Unrealized P/L is ${book.pnlPercent.toFixed(1)}% versus average cost.` : 'There is no cost basis to compare yet.',
    `Today’s marked move is ${signedCurrency(book.day)} across open positions.`,
  ]

  const content = (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CircleDollarSign} label="Total portfolio value" value={currency(book.total)} detail={`${currency(book.equity)} invested · ${currency(book.cash)} cash`} />
        <Stat
          icon={ChartLine}
          label="Profit / loss"
          value={signedCurrency(book.pnl)}
          tone={book.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}
          detail={<PriceChange percent={book.pnlPercent} detail="vs average cost" />}
        />
        <Stat
          icon={Activity}
          label="Today’s change"
          value={signedCurrency(book.day)}
          tone={book.day >= 0 ? 'text-emerald-300' : 'text-rose-300'}
          detail={<PriceChange percent={book.dayPercent} detail="on positions" />}
        />
        <Stat icon={Wallet} label="Buying power" value={currency(book.cash)} detail="Available for the next simulated buy" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
        <article className="rounded-3xl border border-white/10 bg-[#0c1b2e]/70 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold">Performance</h3>
              <p className="mt-1 text-sm text-slate-400">Illustrative path, scaled to the current value of this simulated book.</p>
            </div>
            <div className="flex gap-2" role="group" aria-label="Performance range">
              {ranges.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRange(item.id)}
                  aria-pressed={range === item.id}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${range === item.id ? 'bg-emerald-300 text-[#06101c]' : 'bg-white/5 text-slate-300'}`}
                >
                  {item.id}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <AreaTrend
              data={path}
              formatValue={currency}
              formatAxis={compactUsd}
              ariaLabel={`Illustrative portfolio value over ${range}, ending at ${currency(book.total)}`}
            />
          </div>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <h3 className="font-display text-xl font-semibold">Allocation</h3>
          <p className="mt-1 text-sm text-slate-400">Invested names plus cash. Hover a slice or pick a row.</p>
          <div className="mt-4">
            <AllocationDonut slices={slices} />
          </div>
        </article>
      </div>

      <article className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold">Analytics</h3>
        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          {insights.map((insight) => (
            <li key={insight} className="rounded-2xl bg-black/20 px-3 py-3 text-sm leading-relaxed text-slate-300">{insight}</li>
          ))}
        </ul>
      </article>

      <article className="mt-4 rounded-3xl border border-white/10 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Holdings</h3>
          <Link to="/stocks" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">Add a name</Link>
        </div>
        {book.rows.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-slate-400">Your book is all cash. Buy a sample name to open a position.</p>
        ) : (
          <>
            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm [&_td]:align-middle [&_th]:align-middle">
                <caption className="sr-only">Portfolio holdings</caption>
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    {['Asset', 'Shares', 'Avg cost', 'Last', 'Market value', 'P/L', 'Today', 'Weight'].map((heading) => (
                      <th key={heading} scope="col" className="px-2 py-2 font-medium">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {book.rows.map((row) => (
                    <tr key={row.symbol} className="border-t border-white/8">
                      <td className="px-2 py-3">
                        <Link to={`/stocks/${row.symbol}`} className="flex items-center gap-2 font-semibold text-white hover:text-emerald-300">
                          <Monogram symbol={row.symbol} size={32} />
                          {row.symbol}
                        </Link>
                      </td>
                      <td className="px-2 py-3 font-mono">{row.shares}</td>
                      <td className="px-2 py-3 font-mono">{currency(row.avgCost)}</td>
                      <td className="px-2 py-3 font-mono">{currency(row.stock.price)}</td>
                      <td className="px-2 py-3 font-mono">{currency(row.marketValue)}</td>
                      <td className="px-2 py-3"><PriceChange percent={row.pnlPercent} detail={signedCurrency(row.pnl)} /></td>
                      <td className="px-2 py-3"><PriceChange percent={row.stock.changePercent} detail={signedCurrency(row.dayValue)} /></td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                            <span className="block h-full rounded-full bg-emerald-300" style={{ width: `${Math.min(100, row.weight)}%` }} />
                          </div>
                          <span className="font-mono text-xs text-slate-300">{row.weight.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-3 md:hidden">
              {book.rows.map((row) => (
                <Link key={row.symbol} to={`/stocks/${row.symbol}`} className="rounded-2xl border border-white/10 p-4 transition hover:border-emerald-300/30">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-semibold"><Monogram symbol={row.symbol} size={32} />{row.symbol}</span>
                    <span className="font-mono">{currency(row.marketValue)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
                    <span>{row.shares} shares · avg {currency(row.avgCost)}</span>
                    <PriceChange percent={row.pnlPercent} detail={signedCurrency(row.pnl)} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </article>

      {showOrders && (
        <article className="mt-4 rounded-3xl border border-white/10 p-4 sm:p-5">
          <h3 className="font-display text-xl font-semibold">Recent orders</h3>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">Fills you confirm will show up here.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/8">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      <span className={order.side === 'buy' ? 'text-emerald-300' : 'text-rose-300'}>{order.side === 'buy' ? 'Buy' : 'Sell'}</span>
                      {' '}{order.quantity} {order.symbol}
                    </p>
                    <p className="text-xs text-slate-500">{order.id} · {new Date(order.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                  <p className="font-mono text-slate-200">{currency(order.total)} @ {currency(order.price)}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}

      {showReset && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {confirmReset ? (
            <>
              <p className="text-sm text-slate-300">Replace cash, holdings, watchlist, and orders with the opening sample?</p>
              <Button type="button" size="sm" variant="danger" onClick={() => { resetBook(); setConfirmReset(false) }}>Confirm reset</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            </>
          ) : (
            <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>Reset simulated book</Button>
          )}
        </div>
      )}
    </>
  )

  if (!framed) return content

  return (
    <Section id="portfolio" alt>
      <Reveal>
        <SectionHeading
          eyebrow="Portfolio dashboard"
          title="A book that answers when you trade"
          description="Value, profit and loss, today’s change, and the positions behind them. Confirm an order and these figures move with the fill."
          action={<Button to="/portfolio" variant="secondary">Full portfolio</Button>}
        />
        {content}
      </Reveal>
    </Section>
  )
}
