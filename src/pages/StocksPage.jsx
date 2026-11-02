import { useSearchParams } from 'react-router-dom'
import { StockMarket } from '../components/markets/StockMarket'
import { Container, PageHeader } from '../components/ui/Section'
import { usePageTitle } from '../lib/hooks'

export function StocksPage() {
  usePageTitle('Stocks · Halden')
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''

  return (
    <>
      <PageHeader
        eyebrow="Stocks"
        title="The sample equity board"
        description="Search, filter by sector, and sort the sixteen names. Open a company for the path and fundamentals, or send it straight to the ticket."
      />
      <Container className="py-10 sm:py-14">
        <StockMarket key={query} mode="page" initialQuery={query} />
        <p className="mt-4 text-xs text-slate-500">Prices and fundamentals are sample figures for the interface.</p>
      </Container>
    </>
  )
}
