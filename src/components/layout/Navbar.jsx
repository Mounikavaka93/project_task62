import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useMarket } from '../../context/useMarket'
import { useOnClickOutside } from '../../lib/hooks'
import { initials } from '../../lib/format'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { SearchField } from './SearchField'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/markets', label: 'Markets' },
  { to: '/stocks', label: 'Stocks' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const { user, signOut } = useMarket()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(location.pathname)
  const accountRef = useRef(null)
  const closeAccount = useCallback(() => setAccountOpen(false), [])
  useOnClickOutside(accountRef, closeAccount)

  if (location.pathname !== menuPath) {
    setMenuPath(location.pathname)
    setMenuOpen(false)
    setAccountOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#06101c]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `relative rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span className={`absolute right-3 bottom-1 left-3 h-px origin-left bg-emerald-300 transition ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <SearchField className="w-52" />
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-3 pl-1 text-sm text-white transition hover:border-white/25"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-300 text-xs font-bold text-[#06101c]">{initials(user.name)}</span>
                <span className="max-w-28 truncate">{user.name}</span>
              </button>
              {accountOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-[#0c1b2e] p-2 shadow-2xl">
                  <p className="truncate px-3 py-2 text-xs text-slate-400">{user.email}</p>
                  <NavLink to="/portfolio" className="block rounded-xl px-3 py-2 text-sm text-white hover:bg-white/5" role="menuitem">Portfolio</NavLink>
                  <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5" role="menuitem">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">Login</Button>
              <Button to="/signup" size="sm">Sign Up</Button>
            </>
          )}
        </div>
        <button
          type="button"
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-[#06101c] px-4 py-4 lg:hidden">
          <SearchField onNavigate={() => setMenuOpen(false)} autoFocus />
          <nav className="mt-4 grid gap-1" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `rounded-xl px-3 py-3 text-base font-medium ${isActive ? 'bg-white/10 text-white' : 'text-slate-300'}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
            {user ? (
              <>
                <p className="px-1 text-sm text-slate-400">Signed in as {user.name}</p>
                <Button to="/portfolio" variant="secondary">Portfolio</Button>
                <Button type="button" variant="ghost" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="secondary">Login</Button>
                <Button to="/signup">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
