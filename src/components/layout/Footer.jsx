import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { contact } from '../../data/content'
import { useMarket } from '../../context/useMarket'
import { Logo } from '../ui/Logo'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/markets', label: 'Markets' },
  { to: '/stocks', label: 'Stocks' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/about', label: 'About' },
]

function SocialIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'x') {
    return (
      <svg {...common}>
        <path d="M5 5l14 14M19 5 5 19" />
      </svg>
    )
  }
  if (name === 'linkedin') {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 11v5M8 8h.01M12 16v-3.2a1.8 1.8 0 0 1 3.2-1.1c.2.3.3.7.3 1.1V16" />
      </svg>
    )
  }
  if (name === 'youtube') {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="m10 9 5 3-5 3z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

const socials = [
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
]

const copyrightYear = new Date().getFullYear()

export function Footer() {
  const { pushToast } = useMarket()

  return (
    <footer className="border-t border-white/10 bg-[#050d18]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            A simulated desk for reading markets, managing a watchlist, and rehearsing orders against a sample portfolio.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((social) => (
              <button
                key={social.id}
                type="button"
                aria-label={social.label}
                onClick={() => pushToast(`${social.label} is shown for the layout. This demo has no live profile.`, 'info')}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:text-white"
              >
                <SocialIcon name={social.id} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white">Quick links</h2>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-slate-400 transition hover:text-emerald-300">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white">Account</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/login" className="text-slate-400 transition hover:text-emerald-300">Login</Link></li>
            <li><Link to="/signup" className="text-slate-400 transition hover:text-emerald-300">Sign Up</Link></li>
            <li><Link to="/privacy" className="text-slate-400 transition hover:text-emerald-300">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-slate-400 transition hover:text-emerald-300">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
              <span>{contact.line1}<br />{contact.line2}</span>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 transition hover:text-white" href={contact.emailHref}>
                <Mail className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 transition hover:text-white" href={contact.phoneHref}>
                <Phone className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                {contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
          <p>© {copyrightYear} Halden Markets. All rights reserved in this demonstration.</p>
          <p>
            Halden is a front-end demo. Market figures are illustrative, session hours are simplified, and orders never leave your browser. Nothing here is investment advice or an offer to transact.
          </p>
        </div>
      </div>
    </footer>
  )
}
