import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserBooking } from '@/lib/dashboard/user-bookings'

function formatLine(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

type Props = {
  upcoming: UserBooking[]
}

export function ReminderTimeline({ upcoming }: Props) {
  const slice = upcoming.slice(0, 3)

  if (slice.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="size-5 text-primary" />
            Reminders
          </CardTitle>
          <CardDescription>When you have a booking, gentle prep reminders will show here.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="size-5 text-primary" />
          Reminders & prep
        </CardTitle>
        <CardDescription>Based on your next visits — arrive a few minutes early with a calm buffer.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {slice.map((b, i) => (
            <li key={b.id} className="relative flex gap-3 pl-6">
              <span
                className="absolute left-0 top-2 size-2.5 rounded-full bg-primary ring-4 ring-primary/15"
                aria-hidden
              />
              {i < slice.length - 1 ? (
                <span className="absolute left-[4px] top-5 h-[calc(100%+0.5rem)] w-px bg-border" aria-hidden />
              ) : null}
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-sm font-medium text-foreground">{b.treatmentName}</p>
                <p className="text-xs text-muted-foreground">{formatLine(b.startsAt)}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {i === 0
                    ? 'Bring any insurance details and a short list of medications if relevant.'
                    : 'We will post confirmations and changes in your notification centre.'}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/dashboard/bookings" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          View all bookings
        </Link>
      </CardContent>
    </Card>
  )
}
