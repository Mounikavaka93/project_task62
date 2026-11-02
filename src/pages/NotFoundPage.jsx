import { usePageTitle } from '../lib/hooks'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Section'

export function NotFoundPage() {
  usePageTitle('Page not found · Halden')

  return (
    <Container className="py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">That page is not on the desk</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-400">The link may be outdated. Markets, stocks, and the sample portfolio are still available.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/">Back home</Button>
        <Button to="/markets" variant="secondary">View markets</Button>
      </div>
    </Container>
  )
}
