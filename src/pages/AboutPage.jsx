import { useState } from 'react'
import { contact, steps } from '../data/content'
import { usePageTitle } from '../lib/hooks'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'
import { Container, PageHeader } from '../components/ui/Section'

const topics = ['Markets', 'Portfolio', 'Watchlist', 'Something else']

const empty = { name: '', email: '', topic: 'Markets', message: '' }

export function AboutPage() {
  usePageTitle('About · Halden')
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit(event) {
    event.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.message.trim().length < 12) next.message = 'Add a few more words so the note is useful.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A desk for the shape of a market day"
        description="Halden is a front-end trading interface. It shows how indices, a watchlist, an order ticket, and a portfolio can live in one calm layout."
      />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-xs text-emerald-300">0{index + 1}</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </article>
          ))}
        </div>
      </Container>
      <WhyChooseUs />
      <Container className="pb-16">
        <div className="mt-4 grid gap-6 rounded-3xl border border-white/10 bg-[#0c1b2e]/70 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {contact.name}<br />
              {contact.line1}<br />
              {contact.line2}
            </p>
            <p className="mt-4 text-sm text-slate-300">
              <a className="hover:text-emerald-300" href={contact.emailHref}>{contact.email}</a><br />
              <a className="hover:text-emerald-300" href={contact.phoneHref}>{contact.phone}</a>
            </p>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">The form does not send email. It only confirms that the fields are complete.</p>
          </div>
          {sent ? (
            <div className="grid content-center rounded-2xl bg-emerald-300/10 px-5 py-8" role="status">
              <h3 className="font-display text-2xl font-semibold text-white">Noted for this session</h3>
              <p className="mt-2 text-sm text-slate-300">Thanks, {form.name.trim()}. A production desk would route this to support. This demo keeps it on the page only.</p>
              <Button type="button" className="mt-5 w-fit" variant="secondary" onClick={() => { setSent(false); setForm(empty) }}>Write another note</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4" noValidate>
              <Field label="Name" htmlFor="contact-name" error={errors.name}>
                <input id="contact-name" className={inputClass} value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" />
              </Field>
              <Field label="Email" htmlFor="contact-email" error={errors.email}>
                <input id="contact-email" type="email" className={inputClass} value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" />
              </Field>
              <Field label="Topic" htmlFor="contact-topic">
                <select id="contact-topic" className={inputClass} value={form.topic} onChange={(event) => update('topic', event.target.value)}>
                  {topics.map((topic) => <option key={topic}>{topic}</option>)}
                </select>
              </Field>
              <Field label="Message" htmlFor="contact-message" error={errors.message}>
                <textarea id="contact-message" rows={4} className={`${inputClass} h-auto py-3`} value={form.message} onChange={(event) => update('message', event.target.value)} />
              </Field>
              <Button type="submit" className="w-fit">Send note</Button>
            </form>
          )}
        </div>
      </Container>
    </>
  )
}
