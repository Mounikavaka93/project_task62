import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useMarket } from '../context/useMarket'
import { usePageTitle } from '../lib/hooks'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'
import { Logo } from '../components/ui/Logo'

function nameFromEmail(email) {
  const local = email.split('@')[0].replace(/[._+-]+/g, ' ')
  return local.replace(/\b\w/g, (char) => char.toUpperCase()) || 'Trader'
}

export function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  usePageTitle(isSignup ? 'Sign Up · Halden' : 'Login · Halden')
  const { user, signIn, signOut } = useMarket()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})

  if (user) {
    return (
      <div className="px-4 pt-28 pb-16">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <h1 className="font-display text-3xl font-semibold">You’re signed in</h1>
          <p className="mt-2 text-sm text-slate-400">{user.name} · {user.email}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button to="/portfolio">Go to portfolio</Button>
            <Button type="button" variant="secondary" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </div>
    )
  }

  function submit(event) {
    event.preventDefault()
    const next = {}
    if (isSignup && name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'
    if (isSignup && confirm !== password) next.confirm = 'Those passwords don’t match.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const displayName = isSignup ? name.trim() : (user?.name && user.email === email.trim() ? user.name : nameFromEmail(email.trim()))
    signIn({ name: displayName, email: email.trim() })
    navigate('/portfolio')
  }

  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-white/10 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_20%_20%,rgba(52,211,153,0.2),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-10 pt-28">
          <Logo />
          <div>
            <h1 className="max-w-md font-display text-5xl font-semibold leading-tight">The book stays on this device.</h1>
            <p className="mt-4 max-w-md text-slate-300">Sign-in only labels the desk. Any email and an 8-character password will open it. We never store the password.</p>
          </div>
          <p className="text-sm text-slate-500">Sample quotes. Simulated fills. No funding.</p>
        </div>
      </div>
      <div className="px-4 pt-28 pb-16 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <h2 className="font-display text-4xl font-semibold">{isSignup ? 'Create your desk' : 'Welcome back'}</h2>
          <p className="mt-2 text-sm text-slate-400">
            {isSignup ? 'Already have a demo profile?' : 'New to the desk?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-emerald-300">{isSignup ? 'Login' : 'Sign up'}</Link>
          </p>
          <form onSubmit={submit} className="mt-8 grid gap-4" noValidate>
            {isSignup && (
              <Field label="Full name" htmlFor="auth-name" error={errors.name}>
                <input id="auth-name" className={inputClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
              </Field>
            )}
            <Field label="Email" htmlFor="auth-email" error={errors.email}>
              <input id="auth-email" type="email" className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </Field>
            <Field label="Password" htmlFor="auth-password" error={errors.password} hint="Demo only. Use any 8 or more characters.">
              <div className="relative">
                <input
                  id="auth-password"
                  type={show ? 'text' : 'password'}
                  className={`${inputClass} pr-12`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button type="button" onClick={() => setShow((value) => !value)} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            {isSignup && (
              <Field label="Confirm password" htmlFor="auth-confirm" error={errors.confirm}>
                <input id="auth-confirm" type={show ? 'text' : 'password'} className={inputClass} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
              </Field>
            )}
            <Button type="submit">{isSignup ? 'Sign Up' : 'Login'}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
