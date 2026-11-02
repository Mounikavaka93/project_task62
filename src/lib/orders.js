import { round2 } from './format'

export function validateOrder({ stock, side, quantity, price, orderType, cash, holdings }) {
  if (!stock) return { error: 'Choose a symbol from the sample book.' }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { error: 'Enter a whole number of shares.' }
  }
  if (quantity > 100000) return { error: 'Quantity is above the demo limit of 100,000 shares.' }

  const fillPrice = orderType === 'limit' ? price : stock.price
  if (orderType === 'limit' && (!Number.isFinite(fillPrice) || fillPrice <= 0)) {
    return { error: 'Enter a limit price above zero.' }
  }

  const total = round2(quantity * fillPrice)
  const holding = holdings.find((item) => item.symbol === stock.symbol)

  if (side === 'buy' && cash + 0.001 < total) {
    return { error: 'Not enough buying power for this order.', total, fillPrice, holding }
  }
  if (side === 'sell' && (!holding || holding.shares < quantity)) {
    return { error: 'You do not hold enough shares to sell.', total, fillPrice, holding }
  }

  return { error: '', total, fillPrice, holding }
}
