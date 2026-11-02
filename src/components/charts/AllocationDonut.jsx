import { useState } from 'react'
import { currency } from '../../lib/format'

export function AllocationDonut({ slices }) {
  const [active, setActive] = useState(0)
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  if (!total) return <p className="text-sm text-slate-400">Add a position to see allocation.</p>

  const radius = 58
  const circumference = 2 * Math.PI * radius
  const gap = slices.length > 1 ? 4 : 0
  const arcs = slices.reduce((list, slice) => {
    const used = list.reduce((sum, arc) => sum + arc.portion, 0)
    const portion = (slice.value / total) * circumference
    return [...list, {
      ...slice,
      portion,
      length: Math.max(0, portion - gap),
      offset: used,
    }]
  }, [])
  const current = arcs[Math.min(active, arcs.length - 1)]
  const summary = arcs.map((slice) => `${slice.label} ${((slice.value / total) * 100).toFixed(1)} percent`).join(', ')

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[190px_1fr]">
      <svg viewBox="0 0 160 160" className="mx-auto h-44 w-44" role="img" aria-label={summary}>
        {arcs.map((slice, index) => (
          <circle
            key={slice.id}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={index === Math.min(active, arcs.length - 1) ? 16 : 12}
            strokeDasharray={`${slice.length} ${circumference - slice.length}`}
            strokeDashoffset={-slice.offset}
            transform="rotate(-90 80 80)"
            className="cursor-pointer"
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
          />
        ))}
        <text x="80" y="74" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Outfit, sans-serif" fontWeight="600">
          {current.label}
        </text>
        <text x="80" y="94" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="IBM Plex Mono, monospace">
          {((current.value / total) * 100).toFixed(1)}%
        </text>
      </svg>
      <ul className="space-y-1.5">
        {arcs.map((slice, index) => {
          const selected = index === Math.min(active, slices.length - 1)
          return (
            <li key={slice.id}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${selected ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: slice.color }} />
                  <span className="truncate font-medium text-white">{slice.label}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-slate-300">{currency(slice.value)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
