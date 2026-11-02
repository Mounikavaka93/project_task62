export function Sparkline({ data, positive = true, width = 112, height = 36, className = '' }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = width / (data.length - 1)
  const path = data.map((value, index) => {
    const x = index * step
    const y = height - ((value - min) / span) * (height - 4) - 2
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const color = positive ? '#34d399' : '#fb7185'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className={`shrink-0 overflow-visible ${className}`}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
