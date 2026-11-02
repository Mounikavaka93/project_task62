const tones = {
  Open: 'bg-emerald-400/15 text-emerald-300',
  'Pre-market': 'bg-amber-300/15 text-amber-200',
  'After hours': 'bg-sky-400/15 text-sky-200',
  Closed: 'bg-white/10 text-slate-300',
}

export function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[status] || tones.Closed}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Open' ? 'bg-emerald-300 motion-safe:animate-pulse' : 'bg-current'}`} />
      {status}
    </span>
  )
}
