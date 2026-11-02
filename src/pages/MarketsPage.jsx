import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  formatZoneTime,
  getIndex,
  getPriceSeries,
  indices,
  sessionState,
  worldSessions,
} from '../data/market'
import { useNow, usePageTitle } from '../lib/hooks'
import { compactNumber, compactUsd, formatQuote, signedMove } from '../lib/format'
import { AreaTrend } from '../components/charts/AreaTrend'
import { IndexCard } from '../components/markets/IndexCard'
import { Container, PageHeader } from '../components/ui/Section'
import { PriceChange } from '../components/ui/PriceChange'
import { StatusPill } from '../components/ui/StatusPill'

const ranges = ['1M', '3M', '6M', '1Y']

export function MarketsPage() {
  usePageTitle('Markets · Halden')
  const now = useNow()
  const [params, setParams] = useSearchParams()
  const selected = getIndex(params.get('symbol')) ?? indices[0]
  const [range, setRange] = useState('3M')
  const series = useMemo(() => getPriceSeries(selected.symbol, range), [selected.symbol, range])
  const status = sessionState(now, selected)

  return (
    <>
      <PageHeader
        eyebrow="Markets"
        title="Where the session stands"
        description="Eight sample indices and commodities, with weekday hours for New York, London, Tokyo, and Hong Kong. Pick a card to open its path."
      />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {worldSessions.map((session) => {
            const state = sessionState(now, session)
            return (
              <article key={session.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-white">{session.city}</h2>
                    <p className="text-xs text-slate-400">{session.exchange} · {session.opens}–{session.closes}</p>
                  </div>
                  <StatusPill status={state} />
                </div>
                <p className="mt-4 font-mono text-2xl text-white">{formatZoneTime(now, session.tz)}</p>
              </article>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">Session windows are simplified weekday hours. Exchange holidays are not included.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {indices.map((index) => (
            <IndexCard
              key={index.symbol}
              index={index}
              now={now}
              active={index.symbol === selected.symbol}
              onSelect={() => setParams({ symbol: index.symbol })}
            />
          ))}
        </div>

        <article className="mt-6 rounded-3xl border border-white/10 bg-[#0c1b2e]/70 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-3xl font-semibold">{selected.name}</h2>
                <StatusPill status={status} />
              </div>
              <p className="mt-2 text-sm text-slate-400">{selected.symbol} · {selected.exchange} · {selected.region}</p>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <p className="font-mono text-4xl text-white">{formatQuote(selected.unit, selected.price)}</p>
                <PriceChange percent={selected.changePercent} detail={signedMove(selected.unit, selected.price - selected.prevClose)} />
              </div>
            </div>
            <div className="flex gap-2" role="group" aria-label="Index chart range">
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
              key={`${selected.symbol}-${range}`}
              data={series}
              color={selected.changePercent >= 0 ? '#34d399' : '#fb7185'}
              formatValue={(value) => formatQuote(selected.unit, value)}
              formatAxis={(value) => (selected.unit === 'usd' ? compactUsd(value) : compactNumber(value))}
              ariaLabel={`${selected.name} sample path for ${range}`}
            />
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              ['Open', formatQuote(selected.unit, selected.open)],
              ['High', formatQuote(selected.unit, selected.high)],
              ['Low', formatQuote(selected.unit, selected.low)],
              ['Previous', formatQuote(selected.unit, selected.prevClose)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/[0.04] px-3 py-3">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 font-mono text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </Container>
    </>
  )
}
