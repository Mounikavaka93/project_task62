import { useMarket } from '../../context/useMarket'
import { Modal } from '../ui/Modal'
import { TradeTicket } from './TradeTicket'

export function TradeModal() {
  const { tradeRequest, closeTrade } = useMarket()
  if (!tradeRequest) return null

  return (
    <Modal title={tradeRequest.side === 'sell' ? 'Sell order' : 'Buy order'} onClose={closeTrade} wide>
      <TradeTicket key={tradeRequest.nonce} preset={tradeRequest} onDone={closeTrade} />
    </Modal>
  )
}
