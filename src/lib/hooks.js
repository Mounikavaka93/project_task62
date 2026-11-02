import { useEffect, useRef, useState } from 'react'

export function useNow(interval = 30000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return now
}

export function useInView() {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const element = ref.current
    if (!element || shown) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    const fallback = window.setTimeout(() => setShown(true), 1600)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [shown])

  return [ref, shown]
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

export function useOnClickOutside(ref, handler) {
  const saved = useRef(handler)

  useEffect(() => {
    saved.current = handler
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      saved.current()
    }
    document.addEventListener('pointerdown', listener)
    return () => document.removeEventListener('pointerdown', listener)
  }, [ref, handler])
}
