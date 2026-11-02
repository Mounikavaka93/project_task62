import { formatZoneStamp, indices, sessionNote, sessionState, worldSessions } from '../../data/market'
import { useNow } from '../../lib/hooks'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'
import { Button } from '../ui/Button'
import { IndexCard } from './IndexCard'

export function MarketOverview() {
  const now = useNow()
  const nyse = sessionState(now, worldSessions[0])

  return (
    <Section id="markets" alt>
      <Reveal>
        <SectionHeading
          eyebrow="Market overview"
          title="Major indices, with the session attached"
          description={`${sessionNote(nyse)} Clocks use your device time. Holidays are not included.`}
          action={<Button to="/markets" variant="secondary">Open markets</Button>}
        />
        <p className="mb-5 text-sm text-slate-400">New York {formatZoneStamp(now, 'America/New_York')}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {indices.map((index) => (
            <IndexCard key={index.symbol} index={index} now={now} to={`/markets?symbol=${index.symbol}`} />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
