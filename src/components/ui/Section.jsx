export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export function Section({ id, children, alt = false, className = '' }) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${alt ? 'bg-[#081422]' : ''} ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col items-start gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="border-b border-white/10 bg-[radial-gradient(900px_320px_at_0%_0%,rgba(52,211,153,0.14),transparent_55%)] pt-28 pb-10 sm:pb-12">
      <Container>
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{eyebrow}</p>}
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>}
          </div>
          {action}
        </div>
      </Container>
    </div>
  )
}
