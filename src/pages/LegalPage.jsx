import { legal } from '../data/content'
import { usePageTitle } from '../lib/hooks'
import { Container, PageHeader } from '../components/ui/Section'

export function LegalPage({ kind }) {
  const document = legal[kind]
  usePageTitle(`${document.title} · Halden`)

  return (
    <>
      <PageHeader eyebrow="Legal" title={document.title} description={document.intro} />
      <Container className="py-12 sm:py-16">
        <p className="text-sm text-slate-500">Updated {document.updated}</p>
        <div className="mt-8 max-w-3xl space-y-8">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold text-white">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  )
}
