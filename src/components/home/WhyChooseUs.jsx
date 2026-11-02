import { Activity, ChartNoAxesCombined, LayoutGrid, ShieldCheck } from 'lucide-react'
import { reasons } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'

const icons = {
  shield: ShieldCheck,
  activity: Activity,
  layout: LayoutGrid,
  chart: ChartNoAxesCombined,
}

export function WhyChooseUs({ framed = true }) {
  const grid = (
    <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
      {reasons.map((reason, index) => {
        const Icon = icons[reason.icon]
        return (
          <article key={reason.title} className="card-lift group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 hover:border-emerald-300/40 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-300 transition group-hover:bg-emerald-300 group-hover:text-[#06101c]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{reason.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{reason.body}</p>
          </article>
        )
      })}
    </div>
  )

  if (!framed) return grid

  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow="Why choose Halden"
          title="A desk built to stay readable"
          description="Security, session context, a single ticket, and analytics that describe the book you actually hold."
        />
        {grid}
      </Reveal>
    </Section>
  )
}
