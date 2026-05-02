'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getHistoryBookings, getUpcomingBookings } from '@/lib/dashboard/dashboard-booking-utils'
import {
  buildGlobalBookingsEmptyState,
  buildNoVisitsTodayEmptyState,
  buildTabBookingsEmptyState,
} from '@/lib/dashboard/bookings-empty-state'
import { PremiumBookingsEmpty } from '@/components/dashboard/premium-bookings-empty'
import type { UserBooking, UserBookingStatus } from '@/lib/dashboard/user-bookings'

function statusVariant(status: UserBookingStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status === 'confirmed') return 'default'
  if (status === 'pending') return 'secondary'
  if (status === 'cancelled' || status === 'no_show') return 'destructive'
  return 'outline'
}

function formatShort(iso: string) {
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

type Tab = 'upcoming' | 'history'

type Props = {
  bookings: UserBooking[]
}

const PREVIEW_LIMIT = 4

export function BookingsPreview({ bookings }: Props) {
  const [tab, setTab] = useState<Tab>('upcoming')
  const upcoming = useMemo(() => getUpcomingBookings(bookings), [bookings])
  const history = useMemo(() => getHistoryBookings(bookings), [bookings])
  const list = tab === 'upcoming' ? upcoming : history
  const noVisitsTodayModel = useMemo(() => buildNoVisitsTodayEmptyState(bookings), [bookings])

  return (
    <Card>
      <CardHeader className="space-y-3 pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Appointments</CardTitle>
            <CardDescription>Upcoming visits and your history at a glance.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="h-9 w-full shrink-0 sm:w-auto">
            <Link href="/dashboard/bookings">Open full list</Link>
          </Button>
        </div>
        {bookings.length > 0 ? (
          <div
            role="tablist"
            aria-label="Appointment list"
            className="flex rounded-lg border border-border bg-muted/40 p-1"
          >
            {(
              [
                ['upcoming', 'Upcoming', upcoming.length],
                ['history', 'History', history.length],
              ] as const
            ).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium motion-safe:transition-colors',
                  tab === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
                <span className="ml-1.5 tabular-nums text-xs opacity-70">({count})</span>
              </button>
            ))}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        {bookings.length === 0 ? (
          <PremiumBookingsEmpty variant="compact" model={buildGlobalBookingsEmptyState()} />
        ) : list.length === 0 ? (
          <PremiumBookingsEmpty
            variant="compact"
            model={buildTabBookingsEmptyState(bookings, tab)}
            onSecondary={(action) => setTab(action === 'history' ? 'history' : 'upcoming')}
          />
        ) : (
          <>
            {tab === 'upcoming' && noVisitsTodayModel ? (
              <PremiumBookingsEmpty
                variant="compact"
                model={noVisitsTodayModel}
                onSecondary={(action) => setTab(action === 'history' ? 'history' : 'upcoming')}
              />
            ) : null}
            <ul className="space-y-2">
              {list.slice(0, PREVIEW_LIMIT).map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{b.treatmentName}</p>
                    <p className="text-xs text-muted-foreground">{formatShort(b.startsAt)}</p>
                  </div>
                  <Badge variant={statusVariant(b.status)} className="w-fit shrink-0 capitalize">
                    {b.status.replace('_', ' ')}
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        )}
        {bookings.length > 0 && list.length > PREVIEW_LIMIT ? (
          <p className="text-center text-xs text-muted-foreground">
            Showing {PREVIEW_LIMIT} of {list.length}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
