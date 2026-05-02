import type { PipelineCounts } from '@/lib/dashboard/dashboard-booking-utils'

const ORDER: { key: keyof PipelineCounts; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

type Props = {
  counts: PipelineCounts
}

export function PipelineSummary({ counts }: Props) {
  return (
    <section aria-label="Booking status summary" className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-foreground">Your booking pipeline</h2>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Includes cancelled and no-shows in the last count.</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ORDER.map(({ key, label }) => (
          <li
            key={key}
            className="rounded-xl border border-border/60 bg-background/80 px-3 py-3 text-center motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
          >
            <p className="text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">{counts[key]}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
