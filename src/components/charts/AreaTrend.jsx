import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

export function AreaTrend({
  data,
  height = 280,
  color = '#34d399',
  formatValue,
  formatAxis,
  compact = false,
  ariaLabel = 'Price chart',
}) {
  const wrapRef = useRef(null)
  const lineRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [hover, setHover] = useState(null)
  const gradientId = useId().replace(/:/g, '')

  const seriesKey = data?.length >= 2 ? `${width}:${data.length}:${data[data.length - 1].value}` : ''

  useEffect(() => {
    const element = wrapRef.current
    if (!element) return undefined
    const measure = () => {
      const next = Math.round(element.clientWidth)
      setWidth((current) => (Math.abs(current - next) > 1 ? next : current))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const path = lineRef.current
    if (!path) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      path.style.strokeDasharray = 'none'
      path.style.strokeDashoffset = '0'
      return undefined
    }
    const length = path.getTotalLength()
    path.style.transition = 'none'
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    const frame = requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1.15s cubic-bezier(0.16, 1, 0.3, 1)'
      path.style.strokeDashoffset = '0'
    })
    return () => cancelAnimationFrame(frame)
  }, [seriesKey])

  if (!data || data.length < 2) {
    return <div className="grid h-40 place-items-center text-sm text-slate-400">Chart data is unavailable.</div>
  }

  const values = data.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || Math.abs(max) || 1
  const yMin = min - span * 0.12
  const yMax = max + span * 0.12
  const pad = compact
    ? { l: 8, r: 8, t: 16, b: 12 }
    : { l: width < 520 ? 48 : 64, r: 12, t: 16, b: 32 }
  const innerW = Math.max(width - pad.l - pad.r, 1)
  const innerH = height - pad.t - pad.b

  const xFor = (index) => pad.l + (index / (data.length - 1)) * innerW
  const yFor = (value) => pad.t + ((yMax - value) / (yMax - yMin)) * innerH
  const line = data.map((point, index) => `${index === 0 ? 'M' : 'L'}${xFor(index).toFixed(2)},${yFor(point.value).toFixed(2)}`).join(' ')
  const area = `${line} L${xFor(data.length - 1).toFixed(2)},${yFor(yMin).toFixed(2)} L${xFor(0).toFixed(2)},${yFor(yMin).toFixed(2)} Z`
  const axisFormat = formatAxis || formatValue

  const labelSpots = width > 760 ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.5, 1]
  const yTicks = [0, 1, 2].map((step) => yMax - ((yMax - yMin) * step) / 2)

  function onPointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width) return
    const svgX = ((event.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let best = Infinity
    data.forEach((_, index) => {
      const distance = Math.abs(xFor(index) - svgX)
      if (distance < best) {
        best = distance
        nearest = index
      }
    })
    setHover(nearest)
  }

  const active = hover == null ? null : data[hover]
  const left = active ? (xFor(hover) / width) * 100 : 0
  const tooltipShift = left > 78 ? '-translate-x-full' : left < 18 ? 'translate-x-0' : '-translate-x-1/2'

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full touch-pan-y"
          role="img"
          aria-label={ariaLabel}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHover(null)}
        >
          <title>{ariaLabel}</title>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.l}
                x2={width - pad.r}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="rgba(255,255,255,0.08)"
              />
              {!compact && (
                <text x={pad.l - 8} y={yFor(tick)} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize="11" fontFamily="Manrope, sans-serif">
                  {axisFormat(tick)}
                </text>
              )}
            </g>
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          <path ref={lineRef} d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
          {!compact && labelSpots.map((spot) => {
            const index = Math.round(spot * (data.length - 1))
            return (
              <text
                key={`${spot}-${data[index].label}`}
                x={xFor(index)}
                y={height - 8}
                textAnchor={spot === 0 ? 'start' : spot === 1 ? 'end' : 'middle'}
                fill="#94a3b8"
                fontSize="11"
                fontFamily="Manrope, sans-serif"
              >
                {data[index].label}
              </text>
            )
          })}
          {active && (
            <g>
              <line x1={xFor(hover)} x2={xFor(hover)} y1={pad.t} y2={pad.t + innerH} stroke="rgba(255,255,255,0.28)" />
              <circle cx={xFor(hover)} cy={yFor(active.value)} r="4.5" fill={color} stroke="#06101c" strokeWidth="2" />
            </g>
          )}
        </svg>
      )}
      {active && (
        <div
          className={`pointer-events-none absolute top-3 z-10 rounded-xl border border-white/10 bg-[#06101c]/95 px-3 py-2 text-xs shadow-xl ${tooltipShift}`}
          style={{ left: `${left}%` }}
        >
          <div className="text-slate-400">{active.label}</div>
          <div className="mt-0.5 font-mono text-sm text-white">{formatValue(active.value)}</div>
        </div>
      )}
    </div>
  )
}
