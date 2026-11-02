import { PortfolioDashboard } from '../components/portfolio/PortfolioDashboard'
import { Container, PageHeader } from '../components/ui/Section'
import { usePageTitle } from '../lib/hooks'

export function PortfolioPage() {
  usePageTitle('Portfolio · Halden')

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="The simulated book"
        description="Total value includes cash. Profit and loss is measured against average cost. Today’s change marks open positions off the sample previous close."
      />
      <Container className="py-10 sm:py-14">
        <PortfolioDashboard framed={false} showOrders showReset />
      </Container>
    </>
  )
}
