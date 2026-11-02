import { useContext } from 'react'
import { MarketContext } from './market-context'

export function useMarket() {
  const value = useContext(MarketContext)
  if (!value) throw new Error('useMarket must be used within MarketProvider')
  return value
}
