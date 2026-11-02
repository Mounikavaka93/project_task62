import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { Toaster } from './components/layout/Toaster'
import { TradeModal } from './components/trading/TradeModal'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'
import { MarketsPage } from './pages/MarketsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { StockDetailPage } from './pages/StockDetailPage'
import { StocksPage } from './pages/StocksPage'
import { WatchlistPage } from './pages/WatchlistPage'

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-[#06101c] text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-emerald-300 focus:px-4 focus:py-2 focus:text-[#06101c]">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <main key={pathname} id="main" tabIndex={-1} className="animate-page outline-none">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/stocks/:symbol" element={<StockDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <TradeModal />
      <Toaster />
    </div>
  )
}
