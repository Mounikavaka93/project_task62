import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const getFocusable = () => [...node.querySelectorAll(selector)].filter((element) => !element.hasAttribute('disabled'))

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    node.querySelector('[data-autofocus]')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-[70]"
    >
      <button type="button" className="absolute inset-0 bg-[#02060c]/75 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <div className="relative flex min-h-full items-end justify-center p-3 sm:items-center sm:p-6">
        <div className={`animate-pop max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-[#0c1b2e] shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0c1b2e]/95 px-5 py-4 backdrop-blur sm:px-6">
            <h2 id="dialog-title" className="font-display text-xl font-semibold text-white">{title}</h2>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
