import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sectorOptions, sortStocks, stocks } from '../../data/market'
import { compactNumber, compactUsd, currency, signedCurrency } from '../../lib/format'
import { Button } from '../ui/Button'
import { Monogram } from '../ui/Monogram'
import { PriceChange } from '../ui/PriceChange'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'
import { StockActions } from './StockActions'

const homeTabs = [
  { id: 'trending', label: 'Trending' },
  { id: 'gainers', label: 'Gainers' },
  { id: 'losers', label: 'Losers' },
  { id: 'active', label: 'Most active' },
]

export function StockMarket({ mode = 'home', initialQuery = '' }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('trending')
  const [sector, setSector] = useState('All')
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState('trending')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = stocks.filter((stock) => {
      const sectorOk = sector === 'All' || stock.sector === sector
      const textOk = !needle || stock.symbol.toLowerCase().includes(needle) || stock.name.toLowerCase().includes(needle)
      return sectorOk && textOk
    })
    list = sortStocks(list, mode === 'home' ? tab : sort)
    if (mode === 'home') list = list.slice(0, 6)
    return list
  }, [mode, query, sector, sort, tab])

  const board = (
    <>
      {mode === 'home' ? (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Stock groups">
          {homeTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === item.id ? 'bg-emerald-300 text-[#06101c]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="block">
            <span className="sr-only">Search stocks</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by symbol or company"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/30"
            />
          </label>
          <label className="block text-sm">
            <span className="sr-only">Sector</span>
            <select value={sector} onChange={(event) => setSector(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#0c1b2e] px-3 text-sm text-white">
              {sectorOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#0c1b2e] px-3 text-sm text-white">
              <option value="trending">Trending</option>
              <option value="gainers">Gainers</option>
              <option value="losers">Losers</option>
              <option value="active">Most active</option>
              <option value="price">Price</option>
              <option value="name">Symbol</option>
            </select>
          </label>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-slate-400">No sample names match that filter.</p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
            <table className="w-full text-left text-sm [&_td]:align-middle [&_th]:align-middle">
              <caption className="sr-only">Sample stocks</caption>
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Company</th>
                  <th scope="col" className="px-4 py-3 font-medium">Price</th>
                  <th scope="col" className="px-4 py-3 font-medium">Change</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium lg:table-cell">Volume</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium xl:table-cell">Market cap</th>
                  <th scope="col" className="px-4 py-3 font-medium">Trade</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((stock) => (
                  <tr
                    key={stock.symbol}
                    onClick={() => navigate(`/stocks/${stock.symbol}`)}
                    className="cursor-pointer border-t border-white/8 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Monogram symbol={stock.symbol} size={36} />
                        <div>
                          <div className="font-semibold text-white">{stock.symbol}</div>
                          <div className="text-xs text-slate-400">{stock.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-white">{currency(stock.price)}</td>
                    <td className="px-4 py-3">
                      <PriceChange percent={stock.changePercent} detail={signedCurrency(stock.price - stock.prevClose)} />
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-slate-300 lg:table-cell">{compactNumber(stock.volume)}</td>
                    <td className="hidden px-4 py-3 font-mono text-slate-300 xl:table-cell">{compactUsd(stock.marketCap)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StockActions symbol={stock.symbol} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:hidden">
            {visible.map((stock) => (
              <article
                key={stock.symbol}
                onClick={() => navigate(`/stocks/${stock.symbol}`)}
                className="min-w-0 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/30"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Monogram symbol={stock.symbol} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{stock.symbol}</h3>
                    <p className="truncate text-sm text-slate-400">{stock.name}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
                  <p className="font-mono text-lg text-white">{currency(stock.price)}</p>
                  <PriceChange percent={stock.changePercent} detail={signedCurrency(stock.price - stock.prevClose)} className="text-xs" />
                </div>
                <div className="mt-4" onClick={(event) => event.stopPropagation()}>
                  <StockActions symbol={stock.symbol} stop={false} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  )

  if (mode === 'page') return board

  return (
    <Section id="stocks">
      <Reveal>
        <SectionHeading
          eyebrow="Stock market"
          title="Names the desk is watching"
          description="Trending, gainers, losers, and the most active names in the sixteen-stock sample. Star a row to pin it, or open a ticket without leaving the board."
          action={<Button to="/stocks" variant="secondary">View all stocks</Button>}
        />
        {board}
      </Reveal>
    </Section>
  )
}
