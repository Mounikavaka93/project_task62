import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getStock, initialBook } from '../data/market'
import { round2, round4 } from '../lib/format'
import { validateOrder } from '../lib/orders'
import { MarketContext } from './market-context'

const STORAGE_KEY = 'halden-desk-v1'

function cloneBook(user = null) {
  return {
    user,
    cash: initialBook.cash,
    holdings: initialBook.holdings.map((holding) => ({ ...holding })),
    watchlist: [...initialBook.watchlist],
    orders: [],
  }
}

function sanitize(saved) {
  if (!saved || typeof saved !== 'object') return null
  const cash = Number(saved.cash)
  if (!Number.isFinite(cash) || cash < 0 || cash > 100000000) return null
  if (!Array.isArray(saved.holdings) || !Array.isArray(saved.watchlist)) return null

  const holdings = []
  for (const holding of saved.holdings) {
    if (!holding || !getStock(holding.symbol)) continue
    const shares = Number(holding.shares)
    const avgCost = Number(holding.avgCost)
    if (!Number.isInteger(shares) || shares < 1 || shares > 1000000) continue
    if (!Number.isFinite(avgCost) || avgCost <= 0) continue
    holdings.push({ symbol: holding.symbol.toUpperCase(), shares, avgCost })
  }

  const watchlist = [...new Set(
    saved.watchlist
      .filter((symbol) => typeof symbol === 'string' && getStock(symbol))
      .map((symbol) => symbol.toUpperCase()),
  )]

  const orders = (Array.isArray(saved.orders) ? saved.orders : [])
    .filter((order) => order && getStock(order.symbol) && (order.side === 'buy' || order.side === 'sell'))
    .slice(0, 20)

  const user = saved.user && typeof saved.user.email === 'string' && typeof saved.user.name === 'string'
    ? { name: saved.user.name.slice(0, 80), email: saved.user.email.slice(0, 120) }
    : null

  return { cash, holdings, watchlist, orders, user }
}

function loadBook() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return sanitize(JSON.parse(raw))
  } catch {
    return null
  }
}

export function MarketProvider({ children }) {
  const [state, setState] = useState(() => loadBook() ?? cloneBook())
  const [toasts, setToasts] = useState([])
  const [tradeRequest, setTradeRequest] = useState(null)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const commit = useCallback((next) => {
    stateRef.current = next
    setState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage can be unavailable in private modes. The desk still works for this visit.
    }
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((message, tone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((current) => [...current.slice(-3), { id, message, tone }])
    window.setTimeout(() => dismissToast(id), 3600)
  }, [dismissToast])

  const signIn = useCallback((user) => {
    commit({ ...stateRef.current, user })
    pushToast(`Signed in as ${user.name}`, 'success')
  }, [commit, pushToast])

  const signOut = useCallback(() => {
    commit({ ...stateRef.current, user: null })
    pushToast('Signed out of the demo desk', 'info')
  }, [commit, pushToast])

  const toggleWatch = useCallback((symbol) => {
    const stock = getStock(symbol)
    if (!stock) return
    const previous = stateRef.current
    const exists = previous.watchlist.includes(stock.symbol)
    const watchlist = exists
      ? previous.watchlist.filter((item) => item !== stock.symbol)
      : [...previous.watchlist, stock.symbol]
    commit({ ...previous, watchlist })
    pushToast(exists ? `${stock.symbol} removed from the watchlist` : `${stock.symbol} added to the watchlist`, 'success')
  }, [commit, pushToast])

  const placeOrder = useCallback((input) => {
    const previous = stateRef.current
    const stock = getStock(input.symbol)
    const check = validateOrder({
      stock,
      side: input.side,
      quantity: Number(input.quantity),
      price: Number(input.price),
      orderType: input.orderType,
      cash: previous.cash,
      holdings: previous.holdings,
    })
    if (check.error) return { ok: false, error: check.error }

    const { total, fillPrice } = check
    let holdings
    let cash
    if (input.side === 'buy') {
      cash = round2(previous.cash - total)
      const holding = previous.holdings.find((item) => item.symbol === stock.symbol)
      if (holding) {
        const shares = holding.shares + Number(input.quantity)
        const avgCost = round4((holding.shares * holding.avgCost + total) / shares)
        holdings = previous.holdings.map((item) => (
          item.symbol === stock.symbol ? { symbol: item.symbol, shares, avgCost } : item
        ))
      } else {
        holdings = [...previous.holdings, { symbol: stock.symbol, shares: Number(input.quantity), avgCost: fillPrice }]
      }
    } else {
      cash = round2(previous.cash + total)
      const holding = previous.holdings.find((item) => item.symbol === stock.symbol)
      const shares = holding.shares - Number(input.quantity)
      holdings = shares === 0
        ? previous.holdings.filter((item) => item.symbol !== stock.symbol)
        : previous.holdings.map((item) => (
          item.symbol === stock.symbol ? { ...item, shares } : item
        ))
    }

    const receipt = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      symbol: stock.symbol,
      name: stock.name,
      side: input.side,
      quantity: Number(input.quantity),
      price: fillPrice,
      total,
      orderType: input.orderType,
      time: Date.now(),
    }

    commit({
      ...previous,
      cash,
      holdings,
      orders: [receipt, ...previous.orders].slice(0, 20),
    })
    return { ok: true, receipt }
  }, [commit])

  const resetBook = useCallback(() => {
    commit(cloneBook(stateRef.current.user))
    pushToast('Simulated book reset to the opening sample', 'info')
  }, [commit, pushToast])

  const openTrade = useCallback((symbol, side = 'buy') => {
    const stock = getStock(symbol)
    if (!stock) return
    setTradeRequest({ symbol: stock.symbol, side, nonce: Date.now() })
  }, [])

  const closeTrade = useCallback(() => setTradeRequest(null), [])

  const value = useMemo(() => ({
    user: state.user,
    cash: state.cash,
    holdings: state.holdings,
    watchlist: state.watchlist,
    orders: state.orders,
    toasts,
    tradeRequest,
    signIn,
    signOut,
    toggleWatch,
    placeOrder,
    resetBook,
    pushToast,
    dismissToast,
    openTrade,
    closeTrade,
  }), [
    state,
    toasts,
    tradeRequest,
    signIn,
    signOut,
    toggleWatch,
    placeOrder,
    resetBook,
    pushToast,
    dismissToast,
    openTrade,
    closeTrade,
  ])

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}
