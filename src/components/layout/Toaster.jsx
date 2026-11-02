import { Check, Info, X } from 'lucide-react'
import { useMarket } from '../../context/useMarket'

const tones = {
  success: 'border-emerald-300/40',
  info: 'border-white/15',
  error: 'border-rose-400/50',
}

export function Toaster() {
  const { toasts, dismissToast } = useMarket()
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[80] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`animate-pop pointer-events-auto flex items-start gap-3 rounded-2xl border bg-[#0c1b2e]/95 px-3 py-3 shadow-2xl backdrop-blur ${tones[toast.tone] || tones.info}`}>
          <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${toast.tone === 'error' ? 'bg-rose-400/15 text-rose-200' : 'bg-emerald-300/15 text-emerald-200'}`}>
            {toast.tone === 'info' ? <Info className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
          </span>
          <p className="flex-1 text-sm leading-snug text-slate-100">{toast.message}</p>
          <button type="button" onClick={() => dismissToast(toast.id)} className="text-slate-400 hover:text-white" aria-label="Dismiss notification">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
