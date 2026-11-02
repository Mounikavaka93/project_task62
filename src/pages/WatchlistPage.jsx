import { WatchlistBoard } from '../components/watchlist/WatchlistBoard'
import { Container, PageHeader } from '../components/ui/Section'
import { usePageTitle } from '../lib/hooks'

export function WatchlistPage() {
  usePageTitle('Watchlist · Halden')

  return (
    <>
      <PageHeader
        eyebrow="Watchlist"
        title="Names you want nearby"
        description="Add a symbol from the sample list or remove one from a card. Prices and percentage changes match the stock board."
      />
      <Container className="py-10 sm:py-14">
        <WatchlistBoard framed={false} />
      </Container>
    </>
  )
}
