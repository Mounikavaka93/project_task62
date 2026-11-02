import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { stocks } from '../../data/market'
import { Monogram } from '../ui/Monogram'

export function SearchField({ onNavigate, autoFocus = false, className = '' }) {
  const id = useId()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return stocks
      .filter((stock) => stock.symbol.toLowerCase().includes(needle) || stock.name.toLowerCase().includes(needle))
      .slice(0, 6)
  }, [query])

  function go(symbol) {
    setQuery('')
    setOpen(false)
    onNavigate?.()
    navigate(`/stocks/${symbol}`)
  }

  return (
    <div className={`relative ${className}`}>
      <label className="sr-only" htmlFor={id}>Search sample stocks</label>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        id={id}
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && matches[0]) {
            event.preventDefault()
            go(matches[0].symbol)
          }
          if (event.key === 'Escape') {
            setQuery('')
            setOpen(false)
          }
        }}
        placeholder="Search symbols"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && query.trim().length > 0}
        aria-controls={`${id}-results`}
        className="h-10 w-full rounded-full border border-white/10 bg-white/5 pr-3 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/30"
      />
      {open && query.trim() && (
        <ul id={`${id}-results`} role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b1a2e] shadow-2xl">
          {matches.length === 0 && <li className="px-3 py-3 text-sm text-slate-400">No matching sample names.</li>}
          {matches.map((stock) => (
            <li key={stock.symbol}>
              <button
                type="button"
                role="option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => go(stock.symbol)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/5"
              >
                <Monogram symbol={stock.symbol} size={32} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{stock.symbol}</span>
                  <span className="block truncate text-xs text-slate-400">{stock.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
