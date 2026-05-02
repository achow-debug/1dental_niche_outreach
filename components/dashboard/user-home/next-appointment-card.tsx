import Link from 'next/link'
import { CalendarClock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PremiumBookingsEmpty } from '@/components/dashboard/premium-bookings-empty'
import { buildGlobalBookingsEmptyState } from '@/lib/dashboard/bookings-empty-state'
import { isBookingToday } from '@/lib/dashboard/dashboard-booking-utils'
import type { UserBooking, UserBookingStatus } from '@/lib/dashboard/user-bookings'

function statusVariant(status: UserBookingStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status === 'confirmed') return 'default'
  if (status === 'pending') return 'secondary'
  if (status === 'cancelled' || status === 'no_show') return 'destructive'
  return 'outline'
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

type Props = {
  booking: UserBooking | null
}

export function NextAppointmentCard({ booking }: Props) {
  if (!booking) {
    return (
      <Card className="border-dashed border-primary/25 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CalendarClock className="size-5 shrink-0 text-primary" />
            Next appointment
          </CardTitle>
          <CardDescription>When you book, your next visit appears here with quick actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <PremiumBookingsEmpty variant="compact" model={buildGlobalBookingsEmptyState()} />
        </CardContent>
      </Card>
    )
  }

  const today = isBookingToday(booking.startsAt)

  return (
    <Card className="border-primary/20 bg-card/90 shadow-sm motion-safe:transition-shadow motion-safe:hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CalendarClock className="size-5 shrink-0 text-primary" />
            Next appointment
          </CardTitle>
          {today ? (
            <Badge variant="secondary" className="shrink-0">
              Today
            </Badge>
          ) : null}
        </div>
        <CardDescription className="text-pretty">{formatWhen(booking.startsAt)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-foreground">{booking.treatmentName}</p>
          <Badge variant={statusVariant(booking.status)} className="capitalize">
            {booking.status.replace('_', ' ')}
          </Badge>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link href="/dashboard/bookings">View all bookings</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
