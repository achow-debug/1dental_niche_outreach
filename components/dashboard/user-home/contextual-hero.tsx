import { Badge } from '@/components/ui/badge'
import type { HeroContext } from '@/lib/dashboard/dashboard-booking-utils'

type Props = {
  context: HeroContext
  roleLabel: string
  statusLabel?: string | null
}

export function ContextualHero({ context, roleLabel, statusLabel }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.12] via-card to-card p-5 shadow-sm sm:p-6 md:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl motion-safe:animate-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-medium capitalize">
            {roleLabel}
          </Badge>
          {statusLabel ? (
            <Badge variant="outline" className="font-medium capitalize">
              {statusLabel}
            </Badge>
          ) : null}
          {context.hasBookingToday ? (
            <Badge className="bg-primary font-medium text-primary-foreground motion-safe:animate-pulse motion-reduce:animate-none">
              Today
            </Badge>
          ) : null}
        </div>
        <p className="text-sm font-medium text-primary">{context.greeting}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{context.headline}</h1>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {context.subline}
        </p>
      </div>
    </section>
  )
}
