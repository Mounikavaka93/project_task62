import { Link } from 'react-router-dom'

const variants = {
  primary: 'shine bg-gradient-to-r from-emerald-300 via-sky-100 to-sky-300 text-[#06101c] shadow-[0_12px_30px_-16px_rgba(52,211,153,0.9)]',
  secondary: 'border border-white/15 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  buy: 'shine bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-300 text-[#06101c]',
  sell: 'bg-rose-500 text-white hover:bg-rose-400',
  danger: 'border border-rose-300/40 text-rose-200 hover:bg-rose-400/10',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export function Button({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06101c] disabled:cursor-not-allowed disabled:opacity-45 ${sizes[size]} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
