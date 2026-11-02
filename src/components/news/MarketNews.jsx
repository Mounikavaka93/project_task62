import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { news } from '../../data/content'
import { formatDate } from '../../lib/format'
import { Modal } from '../ui/Modal'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'

const categories = ['All', ...new Set(news.map((item) => item.category))]

export function MarketNews() {
  const [category, setCategory] = useState('All')
  const [active, setActive] = useState(null)
  const visible = news.filter((item) => category === 'All' || item.category === category)

  return (
    <Section id="news" alt>
      <Reveal>
        <SectionHeading
          eyebrow="Market news"
          title="What the desk is reading"
          description="Short notes written for this sample board — macro, equities, commodities, rates, and breadth. Open any card to read it."
        />
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="News categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-white text-[#06101c]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <article key={item.id} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c1b2e] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/35">
              <div className="relative h-28 bg-gradient-to-br from-emerald-400/25 via-sky-500/10 to-transparent px-5 py-4">
                <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">{item.category}</span>
                <p className="absolute right-4 bottom-3 font-display text-3xl font-semibold text-white/15">{item.category}</p>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-slate-500">{formatDate(item.date)} · {item.source}</p>
                <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-white">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{item.excerpt}</p>
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 transition hover:gap-2 hover:text-emerald-200"
                >
                  Read more
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
      {active && (
        <Modal title={active.title} onClose={() => setActive(null)}>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{active.category}</p>
          <p className="mt-2 text-sm text-slate-400">{formatDate(active.date)} · {active.source}</p>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-200">
            {active.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <button type="button" onClick={() => setActive(null)} className="mt-6 text-sm font-semibold text-emerald-300">Close article</button>
        </Modal>
      )}
    </Section>
  )
}
