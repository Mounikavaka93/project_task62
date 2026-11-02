import { useId } from 'react'
import { Link } from 'react-router-dom'

export function Logo({ compact = false }) {
  const id = useId().replace(/:/g, '')

  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
        <path d="M7 22.5 13 13.5l4 4.2L25 8" fill="none" stroke="#06101c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight text-white">Halden</span>
        {!compact && <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Markets</span>}
      </span>
    </Link>
  )
}
