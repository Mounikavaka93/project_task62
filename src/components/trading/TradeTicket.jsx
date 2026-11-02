import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { getStock, stocks, summarizeBook } from '../../data/market'
import { useMarket } from '../../context/useMarket'
import { currency } from '../../lib/format'
import { validateOrder } from '../../lib/orders'
import { Button } from '../ui/Button'
import { Field, inputClass } from '../ui/Field'

export function TradeTicket({ preset, onDone }) {
  const market = useMarket()
  const [symbol, setSymbol] = useState(preset?.symbol ?? 'AAPL')
  const [side, setSide] = useState(preset?.side ?? 'buy')
  const [orderType, setOrderType] = useState('market')
  const [qty, setQty] = useState('1')
  const [limit, setLimit] = useState('')
  const [phase, setPhase] = useState('form')
  const [receipt, setReceipt] = useState(null)
  const [submitError, setSubmitError] = useState('')

  const stock = getStock(symbol) ?? stocks[0]
  const quantity = Number(qty)
  const limitPrice = Number(limit)
  const book = useMemo(() => summarizeBook(market.holdings, market.cash), [market.holdings, market.cash])
  const holding = market.holdings.find((item) => item.symbol === stock.symbol)
  const check = validateOrder({
    stock,
    side,
    quantity,
    price: limitPrice,
    orderType,
    cash: market.cash,
    holdings: market.holdings,
  })
  const fillPrice = orderType === 'market' ? stock.price : limitPrice
  const estimated = Number.isFinite(quantity) && quantity > 0 && Number.isFinite(fillPrice) && fillPrice > 0
    ? quantity * fillPrice
    : 0
  const cashAfter = side === 'buy' ? market.cash - (check.total || estimated) : market.cash + (check.total || estimated)

  function chooseType(next) {
    setOrderType(next)
    if (next === 'limit' && !limit) setLimit(stock.price.toFixed(2))
  }

  function chooseSymbol(next) {
    setSymbol(next)
    const nextStock = getStock(next)
    if (orderType === 'limit' && nextStock) setLimit(nextStock.price.toFixed(2))
  }

  function bump(delta) {
    const current = Number(qty) || 0
    setQty(String(Math.min(100000, Math.max(1, current + delta))))
  }

  function review(event) {
    event.preventDefault()
    if (check.error) return
    setSubmitError('')
    setPhase('review')
  }

  function confirm() {
    const result = market.placeOrder({
      symbol: stock.symbol,
      side,
      quantity: qty,
      price: orderType === 'limit' ? limit : stock.price,
      orderType,
    })
    if (!result.ok) {
      setSubmitError(result.error)
      setPhase('review')
      return
    }
    setReceipt(result.receipt)
    setPhase('success')
  }

  function another() {
    setPhase('form')
    setReceipt(null)
    setSubmitError('')
    setQty('1')
  }

  if (phase === 'success' && receipt) {
    return (
      <div className="mx-auto max-w-lg text-center" aria-live="polite">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-300/15 text-emerald-300">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold">Order confirmed</h3>
        <p className="mt-2 text-sm text-slate-400">The simulated book has been updated. Nothing was sent to an exchange.</p>
        <dl className="mt-6 space-y-3 rounded-2xl border border-dashed border-white/15 px-4 py-4 text-left text-sm">
          {[
            ['Order', receipt.id],
            ['Side', receipt.side === 'buy' ? 'Buy' : 'Sell'],
            ['Symbol', `${receipt.quantity} ${receipt.symbol}`],
            ['Price', currency(receipt.price)],
            ['Total', currency(receipt.total)],
            ['Type', receipt.orderType === 'market' ? 'Market' : 'Limit'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">{label}</dt>
              <dd className="font-mono text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" onClick={another}>Place another</Button>
          {onDone && <Button type="button" variant="secondary" onClick={onDone}>Done</Button>}
        </div>
      </div>
    )
  }

  if (phase === 'review') {
    return (
      <div>
        <h3 className="font-display text-2xl font-semibold">Confirm {side}</h3>
        <p className="mt-2 text-sm text-slate-400">
          {orderType === 'market'
            ? 'This market ticket fills immediately at the indicative price.'
            : 'Limit tickets in this demo fill at your price when you confirm.'}
        </p>
        <dl className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm">
          {[
            ['Symbol', stock.symbol],
            ['Company', stock.name],
            ['Side', side === 'buy' ? 'Buy' : 'Sell'],
            ['Quantity', String(quantity)],
            ['Order type', orderType === 'market' ? 'Market' : 'Limit'],
            ['Fill price', currency(check.fillPrice || fillPrice)],
            ['Estimated total', currency(check.total || estimated)],
            ['Commission', currency(0)],
            ['Buying power after', currency(Math.max(0, cashAfter))],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">{label}</dt>
              <dd className="text-right font-medium text-white">{value}</dd>
            </div>
          ))}
        </dl>
        {submitError && <p className="mt-3 text-sm text-rose-300" role="alert">{submitError}</p>}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant={side === 'buy' ? 'buy' : 'sell'} onClick={confirm}>
            Confirm {side}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setPhase('form')}>Back to ticket</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={review} className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="space-y-5">
        <div className="grid grid-cols-2 rounded-full bg-white/5 p-1" role="group" aria-label="Order side">
          {['buy', 'sell'].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={side === item}
              onClick={() => setSide(item)}
              className={`h-10 rounded-full text-sm font-semibold capitalize transition ${side === item ? (item === 'buy' ? 'bg-emerald-300 text-[#06101c]' : 'bg-rose-500 text-white') : 'text-slate-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <Field label="Symbol" htmlFor="ticket-symbol">
          <select id="ticket-symbol" className={inputClass} value={stock.symbol} onChange={(event) => chooseSymbol(event.target.value)}>
            {stocks.map((item) => (
              <option key={item.symbol} value={item.symbol}>{item.symbol} — {item.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Order type" htmlFor="ticket-type" hint={orderType === 'market' ? 'Fills at the indicative last price.' : 'Fills at the price you enter when you confirm.'}>
          <select id="ticket-type" className={inputClass} value={orderType} onChange={(event) => chooseType(event.target.value)}>
            <option value="market">Market</option>
            <option value="limit">Limit</option>
          </select>
        </Field>
        <Field label="Quantity" htmlFor="ticket-qty" error={qty !== '' && !Number.isInteger(quantity) ? 'Use a whole number of shares.' : ''}>
          <div className="flex gap-2">
            <button type="button" onClick={() => bump(-1)} className="h-11 w-11 shrink-0 rounded-xl border border-white/10 text-lg" aria-label="Decrease quantity">–</button>
            <input
              id="ticket-qty"
              inputMode="numeric"
              className={inputClass}
              value={qty}
              onChange={(event) => setQty(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <button type="button" onClick={() => bump(1)} className="h-11 w-11 shrink-0 rounded-xl border border-white/10 text-lg" aria-label="Increase quantity">+</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['1', '5', '10', '25'].map((presetQty) => (
              <button key={presetQty} type="button" onClick={() => setQty(presetQty)} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10">
                {presetQty}
              </button>
            ))}
            {side === 'sell' && holding && (
              <button type="button" onClick={() => setQty(String(holding.shares))} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10">
                Sell all
              </button>
            )}
          </div>
        </Field>
        {orderType === 'limit' ? (
          <Field label="Limit price" htmlFor="ticket-limit">
            <input
              id="ticket-limit"
              inputMode="decimal"
              className={inputClass}
              value={limit}
              onChange={(event) => {
                const next = event.target.value.replace(/[^\d.]/g, '')
                const [whole, ...rest] = next.split('.')
                const cleaned = rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole
                setLimit(cleaned.slice(0, 10))
              }}
            />
          </Field>
        ) : (
          <Field label="Indicative price" hint="Shown from the sample quote. It does not tick.">
            <p className="font-mono text-2xl text-white">{currency(stock.price)}</p>
          </Field>
        )}
      </div>

      <aside className="flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-5">
        <h3 className="font-display text-xl font-semibold">Order summary</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">Orders fill only inside this browser.</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-baseline justify-between gap-4"><dt className="shrink-0 text-slate-400">Name</dt><dd className="min-w-0 text-right text-white">{stock.name}</dd></div>
          <div className="flex items-baseline justify-between gap-4"><dt className="shrink-0 text-slate-400">Last</dt><dd className="min-w-0 text-right font-mono">{currency(stock.price)}</dd></div>
          <div className="flex items-baseline justify-between gap-4"><dt className="shrink-0 text-slate-400">Position</dt><dd className="min-w-0 text-right">{holding ? `${holding.shares} shares · avg ${currency(holding.avgCost)}` : 'None'}</dd></div>
          <div className="flex items-baseline justify-between gap-4"><dt className="shrink-0 text-slate-400">Buying power</dt><dd className="min-w-0 text-right font-mono">{currency(market.cash)}</dd></div>
          <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3"><dt className="shrink-0 text-slate-400">Estimated total</dt><dd className="min-w-0 text-right font-mono text-base text-white">{currency(check.total || estimated || 0)}</dd></div>
          <div className="flex items-baseline justify-between gap-4"><dt className="shrink-0 text-slate-400">Book value</dt><dd className="min-w-0 text-right font-mono">{currency(book.total)}</dd></div>
        </dl>
        {check.error && <p className="mt-4 text-sm text-rose-300" role="alert">{check.error}</p>}
        <Button type="submit" className="mt-5 w-full lg:mt-auto" variant={side === 'buy' ? 'buy' : 'sell'} disabled={Boolean(check.error)}>
          Review {side}
        </Button>
      </aside>
    </form>
  )
}
