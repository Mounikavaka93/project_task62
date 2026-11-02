import { usePageTitle } from '../lib/hooks'
import { Hero } from '../components/home/Hero'
import { Ticker } from '../components/home/Ticker'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { MarketNews } from '../components/news/MarketNews'
import { MarketOverview } from '../components/markets/MarketOverview'
import { StockMarket } from '../components/markets/StockMarket'
import { PortfolioDashboard } from '../components/portfolio/PortfolioDashboard'
import { TradingSection } from '../components/trading/TradingSection'
import { WatchlistBoard } from '../components/watchlist/WatchlistBoard'

export function HomePage() {
  usePageTitle('Halden — Trading & Investment')

  return (
    <>
      <Hero />
      <Ticker />
      <MarketOverview />
      <StockMarket />
      <PortfolioDashboard />
      <WatchlistBoard />
      <TradingSection />
      <MarketNews />
      <WhyChooseUs />
    </>
  )
}
