import { round2 } from '../lib/format'

const tones = [
  ['#93c5fd', '#1d4ed8'],
  ['#6ee7b7', '#047857'],
  ['#fcd34d', '#b45309'],
  ['#fda4af', '#be123c'],
  ['#c4b5fd', '#6d28d9'],
  ['#67e8f9', '#0e7490'],
  ['#fdba74', '#c2410c'],
  ['#a5b4fc', '#4338ca'],
]

const stockRows = [
  ['AAPL', 'Apple Inc.', 'Technology', 'NASDAQ', 228.42, 0.81, 52400000, 3.48e12, 34.2, 0.44, 11, 'Apple represents mega-cap consumer technology in the sample book.'],
  ['MSFT', 'Microsoft Corp.', 'Technology', 'NASDAQ', 428.16, 0.34, 22100000, 3.18e12, 36.1, 0.72, 12, 'Microsoft stands in for enterprise software and cloud platforms.'],
  ['NVDA', 'NVIDIA Corp.', 'Technology', 'NASDAQ', 142.88, 2.46, 210400000, 3.51e12, 48.5, 0.03, 13, 'NVIDIA is the high-beta semiconductor name used throughout the desk.'],
  ['AMZN', 'Amazon.com Inc.', 'Consumer', 'NASDAQ', 197.55, -0.42, 38400000, 2.08e12, 39.4, 0, 14, 'Amazon covers retail scale and cloud infrastructure in one listing.'],
  ['GOOGL', 'Alphabet Inc.', 'Communication', 'NASDAQ', 176.2, 0.58, 28600000, 2.16e12, 24.8, 0.32, 15, 'Alphabet represents digital advertising and internet platforms.'],
  ['META', 'Meta Platforms', 'Communication', 'NASDAQ', 592.4, -1.12, 18200000, 1.5e12, 26.4, 0.35, 16, 'Meta is the sample social-platform holding and starts below its average cost.'],
  ['TSLA', 'Tesla Inc.', 'Automotive', 'NASDAQ', 248.15, 3.05, 96200000, 0.8e12, 92, 0, 17, 'Tesla is the volatile automaker on the default watchlist.'],
  ['JPM', 'JPMorgan Chase', 'Financials', 'NYSE', 224.7, 0.22, 9400000, 0.64e12, 12.4, 2.15, 18, 'JPMorgan stands in for money-center banks and credit conditions.'],
  ['AVGO', 'Broadcom Inc.', 'Technology', 'NASDAQ', 178.35, 1.54, 24300000, 0.84e12, 40.2, 1.05, 19, 'Broadcom adds a second semiconductor line to the sample portfolio.'],
  ['LLY', 'Eli Lilly', 'Healthcare', 'NYSE', 892.1, -0.67, 3800000, 0.85e12, 62.5, 0.62, 21, 'Eli Lilly represents large-cap healthcare in the sample list.'],
  ['XOM', 'Exxon Mobil', 'Energy', 'NYSE', 118.44, 0.91, 16400000, 0.52e12, 14.1, 3.25, 22, 'Exxon Mobil is the integrated energy name shown beside the crude quote.'],
  ['V', 'Visa Inc.', 'Financials', 'NYSE', 312.08, 0.15, 6200000, 0.61e12, 31.6, 0.68, 23, 'Visa represents global payments volume in the sample book.'],
  ['UNH', 'UnitedHealth', 'Healthcare', 'NYSE', 548.22, -0.88, 4100000, 0.51e12, 21.8, 1.42, 24, 'UnitedHealth is the managed-care name used to balance the book.'],
  ['NFLX', 'Netflix Inc.', 'Communication', 'NASDAQ', 742.6, 1.21, 5500000, 0.32e12, 41.7, 0, 25, 'Netflix stands in for streaming subscriptions and media spending.'],
  ['AMD', 'Advanced Micro Devices', 'Technology', 'NASDAQ', 164.9, 2.88, 62400000, 0.27e12, 108, 0, 26, 'AMD is the second high-beta chip name on the default watchlist.'],
  ['COST', 'Costco Wholesale', 'Consumer', 'NASDAQ', 918.4, 0.44, 2200000, 0.41e12, 54.2, 0.51, 27, 'Costco represents steady consumer traffic and membership retail.'],
]

const indexRows = [
  ['SPX', 'S&P 500', 'United States', 'NYSE', 'America/New_York', '09:30', '16:00', 6124.38, 0.42, 101, 'points'],
  ['COMP', 'Nasdaq Composite', 'United States', 'NASDAQ', 'America/New_York', '09:30', '16:00', 19842.15, 0.67, 102, 'points'],
  ['DJI', 'Dow Jones', 'United States', 'NYSE', 'America/New_York', '09:30', '16:00', 44318.9, 0.18, 103, 'points'],
  ['RUT', 'Russell 2000', 'United States', 'NYSE', 'America/New_York', '09:30', '16:00', 2248.55, -0.31, 104, 'points'],
  ['FTSE', 'FTSE 100', 'United Kingdom', 'LSE', 'Europe/London', '08:00', '16:30', 8412.7, 0.25, 105, 'points'],
  ['N225', 'Nikkei 225', 'Japan', 'TSE', 'Asia/Tokyo', '09:00', '15:00', 39540.2, -0.48, 106, 'points'],
  ['XAU', 'Gold', 'Global', 'COMEX', 'America/New_York', '08:20', '13:30', 2684.3, 0.73, 107, 'usd'],
  ['WTI', 'WTI Crude', 'Global', 'NYMEX', 'America/New_York', '09:00', '14:30', 78.42, -1.05, 108, 'usd'],
]

function decorate(security) {
  const prevClose = round2(security.price / (1 + security.changePercent / 100))
  const open = round2(prevClose * (1 + ((security.seed % 7) - 3) * 0.0012))
  const high = round2(Math.max(security.price, open, prevClose) * (1.002 + (security.seed % 5) * 0.0008))
  const low = round2(Math.min(security.price, open, prevClose) * (0.998 - (security.seed % 4) * 0.0007))
  return { ...security, prevClose, open, high, low }
}

function toStock(row) {
  const [symbol, name, sector, exchange, price, changePercent, volume, marketCap, pe, dividend, seed, summary] = row
  return decorate({
    symbol,
    name,
    sector,
    exchange,
    price,
    changePercent,
    volume,
    marketCap,
    pe,
    dividend,
    seed,
    summary,
    unit: 'usd',
    tone: tones[seed % tones.length],
  })
}

function toIndex(row) {
  const [symbol, name, region, exchange, tz, openAt, closeAt, price, changePercent, seed, unit] = row
  return decorate({
    symbol,
    name,
    region,
    exchange,
    tz,
    price,
    changePercent,
    seed,
    unit,
    opens: openAt,
    closes: closeAt,
  })
}

export const stocks = stockRows.map(toStock)
export const indices = indexRows.map(toIndex)

const stockMap = new Map(stocks.map((stock) => [stock.symbol, stock]))
const indexMap = new Map(indices.map((index) => [index.symbol, index]))

export const sectorOptions = ['All', 'Technology', 'Communication', 'Consumer', 'Financials', 'Healthcare', 'Energy', 'Automotive']

export const worldSessions = [
  { id: 'ny', city: 'New York', exchange: 'NYSE', tz: 'America/New_York', opens: '09:30', closes: '16:00' },
  { id: 'ldn', city: 'London', exchange: 'LSE', tz: 'Europe/London', opens: '08:00', closes: '16:30' },
  { id: 'tyo', city: 'Tokyo', exchange: 'TSE', tz: 'Asia/Tokyo', opens: '09:00', closes: '15:00' },
  { id: 'hk', city: 'Hong Kong', exchange: 'HKEX', tz: 'Asia/Hong_Kong', opens: '09:30', closes: '16:00' },
]

export const initialBook = {
  cash: 24850.32,
  holdings: [
    { symbol: 'AAPL', shares: 24, avgCost: 189.4 },
    { symbol: 'NVDA', shares: 12, avgCost: 98.2 },
    { symbol: 'MSFT', shares: 18, avgCost: 372.1 },
    { symbol: 'META', shares: 4, avgCost: 640 },
    { symbol: 'JPM', shares: 30, avgCost: 198.5 },
    { symbol: 'AVGO', shares: 6, avgCost: 164.2 },
  ],
  watchlist: ['TSLA', 'AMD', 'GOOGL', 'LLY', 'NFLX', 'COST'],
}

export function getStock(symbol) {
  if (!symbol) return undefined
  return stockMap.get(String(symbol).toUpperCase())
}

export function getIndex(symbol) {
  if (!symbol) return undefined
  return indexMap.get(String(symbol).toUpperCase())
}

export function getSecurity(symbol) {
  return getStock(symbol) || getIndex(symbol)
}

export function breadth() {
  const up = stocks.filter((stock) => stock.changePercent > 0).length
  const down = stocks.filter((stock) => stock.changePercent < 0).length
  return { up, down, flat: stocks.length - up - down, total: stocks.length }
}

export function sortStocks(list, mode) {
  const next = [...list]
  if (mode === 'gainers') next.sort((a, b) => b.changePercent - a.changePercent)
  else if (mode === 'losers') next.sort((a, b) => a.changePercent - b.changePercent)
  else if (mode === 'active') next.sort((a, b) => b.volume - a.volume)
  else if (mode === 'name') next.sort((a, b) => a.symbol.localeCompare(b.symbol))
  else if (mode === 'price') next.sort((a, b) => b.price - a.price)
  else next.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
  return next
}

export function summarizeBook(holdings, cash) {
  const rows = []
  let equity = 0
  let cost = 0
  let day = 0

  for (const holding of holdings) {
    const stock = getStock(holding.symbol)
    if (!stock) continue
    const marketValue = holding.shares * stock.price
    const costValue = holding.shares * holding.avgCost
    const dayValue = holding.shares * (stock.price - stock.prevClose)
    equity += marketValue
    cost += costValue
    day += dayValue
    rows.push({
      ...holding,
      stock,
      marketValue,
      costValue,
      pnl: marketValue - costValue,
      pnlPercent: costValue ? ((marketValue - costValue) / costValue) * 100 : 0,
      dayValue,
      weight: 0,
    })
  }

  rows.sort((a, b) => b.marketValue - a.marketValue)
  for (const row of rows) row.weight = equity ? (row.marketValue / equity) * 100 : 0

  const base = equity - day
  return {
    rows,
    equity,
    cost,
    cash,
    day,
    dayPercent: base ? (day / base) * 100 : 0,
    total: equity + cash,
    pnl: equity - cost,
    pnlPercent: cost ? ((equity - cost) / cost) * 100 : 0,
  }
}

const dayCache = new Map()
const seriesCache = new Map()

function tradingDays(count) {
  const cached = dayCache.get(count)
  if (cached) return cached
  const days = []
  const cursor = new Date(Date.UTC(2026, 10, 2))
  while (days.length < count) {
    const weekday = cursor.getUTCDay()
    if (weekday !== 0 && weekday !== 6) days.push(new Date(cursor.getTime()))
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  days.reverse()
  dayCache.set(count, days)
  return days
}

function formatDay(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function mulberry32(seed) {
  let state = seed >>> 0
  return function rand() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getSeries(key, create) {
  if (!seriesCache.has(key)) seriesCache.set(key, create())
  return seriesCache.get(key)
}

const INTRADAY_LABELS = (() => {
  const start = 9 * 60 + 30
  const end = 16 * 60
  const count = 36
  const labels = []
  for (let i = 0; i < count; i += 1) {
    const minutes = Math.round(start + ((end - start) * i) / (count - 1))
    const hour24 = Math.floor(minutes / 60)
    const minute = minutes % 60
    const suffix = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 % 12 || 12
    labels.push(`${hour12}:${String(minute).padStart(2, '0')} ${suffix}`)
  }
  return labels
})()

function makeIntraday(security) {
  const rand = mulberry32(security.seed + 501)
  const count = INTRADAY_LABELS.length
  return INTRADAY_LABELS.map((label, index) => {
    if (index === count - 1) return { label, value: security.price }
    const progress = index / (count - 1)
    const base = security.prevClose + (security.price - security.prevClose) * progress
    const noise = Math.sin(progress * Math.PI * 3) * (rand() - 0.45) * Math.abs(security.price - security.prevClose) * 0.55
    return { label, value: round2(base + noise) }
  })
}

function makeDaily(security, points) {
  const days = tradingDays(points)
  const rand = mulberry32(security.seed * 100 + points)
  let value = security.price * 0.9
  const raw = []
  for (let i = 0; i < points; i += 1) {
    value *= 1 + (rand() - 0.48) * 0.028
    raw.push(value)
  }
  const last = raw[raw.length - 1] || 1
  return days.map((day, index) => ({
    label: formatDay(day),
    value: index === points - 1 ? security.price : round2((raw[index] / last) * security.price),
  }))
}

const RANGE_POINTS = { '1W': 5, '1M': 21, '3M': 63, '6M': 126, '1Y': 252 }

export function getPriceSeries(symbol, range) {
  const security = getSecurity(symbol)
  if (!security) return []
  return getSeries(`${symbol}:${range}`, () => {
    if (range === '1D') return makeIntraday(security)
    return makeDaily(security, RANGE_POINTS[range] || 63)
  })
}

export function sparkFor(symbol) {
  return getPriceSeries(symbol, '3M').slice(-26).map((point) => point.value)
}

export function portfolioPath(points) {
  return getSeries(`path-${points}`, () => {
    const rand = mulberry32(900 + points)
    const days = tradingDays(points)
    let value = 80
    const raw = []
    for (let i = 0; i < points; i += 1) {
      value *= 1 + 0.002 + (rand() - 0.47) * 0.016
      raw.push(value)
    }
    const last = raw[raw.length - 1] || 1
    return days.map((day, index) => ({
      label: formatDay(day),
      ratio: raw[index] / last,
    }))
  })
}

function toMinutes(value) {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

export function zonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const parts = {}
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') parts[part.type] = part.value
  }
  return parts
}

export function sessionState(date, session) {
  const parts = zonedParts(date, session.tz)
  if (parts.weekday === 'Sat' || parts.weekday === 'Sun') return 'Closed'
  let hour = Number(parts.hour)
  if (hour === 24) hour = 0
  const minutes = hour * 60 + Number(parts.minute)
  if (!Number.isFinite(minutes)) return 'Closed'
  const openMinute = toMinutes(session.opens)
  const closeMinute = toMinutes(session.closes)
  if (minutes >= openMinute && minutes < closeMinute) return 'Open'
  if (minutes >= openMinute - 90 && minutes < openMinute) return 'Pre-market'
  if (minutes >= closeMinute && minutes < Math.min(closeMinute + 180, 24 * 60)) return 'After hours'
  return 'Closed'
}

export function formatZoneTime(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatZoneStamp(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function sessionNote(status) {
  if (status === 'Open') return 'U.S. cash equities are in their regular session.'
  if (status === 'Pre-market') return 'U.S. cash equities open at 9:30 a.m. Eastern.'
  if (status === 'After hours') return 'The regular U.S. session has ended. After-hours is a simplified window in this demo.'
  return 'The U.S. cash session is closed. Sample quotes stay at the illustrated last prices.'
}
