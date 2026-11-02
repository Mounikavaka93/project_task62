import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'
import { TradeTicket } from './TradeTicket'

export function TradingSection() {
  return (
    <Section id="trade">
      <Reveal>
        <SectionHeading
          eyebrow="Trading desk"
          title="Review the order, then confirm it"
          description="Choose a side, a quantity, and a market or limit price. The summary uses your buying power and current position. Confirming updates cash, holdings, and P/L together."
        />
        <div className="rounded-3xl border border-white/10 bg-[#0c1b2e]/60 p-4 sm:p-6">
          <TradeTicket />
        </div>
      </Reveal>
    </Section>
  )
}
