'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, List } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { getHistoryBookings, getUpcomingBookings } from '@/lib/dashboard/dashboard-booking-utils'
import {
  buildGlobalBookingsEmptyState,
  buildNoVisitsTodayReminder,
  buildTabBookingsEmptyState,
} from '@/lib/dashboard/bookings-empty-state'
import { PremiumBookingsEmpty } from '@/components/dashboard/premium-bookings-empty'
import type { UserBooking, UserBookingStatus } from '@/lib/dashboard/user-bookings'

function statusVariant(status: UserBookingStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status === 'confirmed') return 'default'
  if (status === 'pending') return 'secondary'
  if (status === 'cancelled') return 'destructive'
  if (status === 'no_show') return 'destructive'
  return 'outline'
}

function formatBookingWhen(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

type Props = {
  bookings: UserBooking[]
}

export function BookingsClient({ bookings }: Props) {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [listTab, setListTab] = useState<'upcoming' | 'history'>('upcoming')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const sorted = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  }, [bookings])

  const upcomingList = useMemo(() => getUpcomingBookings(bookings), [bookings])
  const historyList = useMemo(() => getHistoryBookings(bookings), [bookings])
  const listRows = listTab === 'upcoming' ? upcomingList : historyList

  const datesWithBookings = useMemo(
    () => sorted.map((b) => new Date(b.startsAt)),
    [sorted],
  )

  const selectedDayKey = selectedDate?.toDateString()
  const dayBookings = selectedDayKey
    ? sorted.filter((b) => new Date(b.startsAt).toDateString() === selectedDayKey)
    : []

  const noVisitsTodayReminder = useMemo(() => buildNoVisitsTodayReminder(bookings), [bookings])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Switch between list and calendar to review your visits.</p>
        </div>
        <Button asChild variant="cta" className="h-10 w-full shrink-0 sm:w-auto">
          <Link href="/dashboard/book">Book a treatment</Link>
        </Button>
      </div>

      {sorted.length === 0 ? (
        <PremiumBookingsEmpty variant="full" model={buildGlobalBookingsEmptyState()} />
      ) : (
        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list" className="gap-2">
              <List className="size-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="size-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4 space-y-4">
            <>
              {listTab === 'upcoming' && listRows.length > 0 && noVisitsTodayReminder ? (
                <p
                  className="rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3 text-sm text-foreground"
                  role="status"
                >
                  {noVisitsTodayReminder}
                </p>
              ) : null}
              <div
                role="tablist"
                aria-label="Appointment timeframe"
                className="flex w-full max-w-md rounded-lg border border-border bg-muted/40 p-1"
              >
                {(
                  [
                    ['upcoming', 'Upcoming', upcomingList.length],
                    ['history', 'History', historyList.length],
                  ] as const
                ).map(([id, label, count]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={listTab === id}
                    onClick={() => setListTab(id)}
                    className={cn(
                      'flex-1 rounded-md px-3 py-2 text-sm font-medium motion-safe:transition-colors',
                      listTab === id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {label}
                    <span className="ml-1 tabular-nums text-xs opacity-70">({count})</span>
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {listRows.length === 0 ? (
                  <PremiumBookingsEmpty
                    variant="full"
                    model={buildTabBookingsEmptyState(bookings, listTab)}
                    onSecondary={(action) => {
                      setListTab(action === 'history' ? 'history' : 'upcoming')
                      setView('list')
                    }}
                  />
                ) : (
                  listRows.map((booking) => (
                    <Card
                      key={booking.id}
                      className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-0.5"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <CardTitle className="text-base">{booking.treatmentName}</CardTitle>
                          <Badge variant={statusVariant(booking.status)} className="capitalize">
                            {booking.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardDescription>{formatBookingWhen(booking.startsAt)}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </>
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calendar</CardTitle>
              <CardDescription>Days with a booking are highlighted. Select a day to see details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-border">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ booked: datesWithBookings }}
                  modifiersClassNames={{ booked: 'bg-primary/15 font-semibold text-foreground' }}
                />
              </div>
              <div className="min-h-[12rem] space-y-3">
                {!selectedDate ? (
                  <p className="text-sm text-muted-foreground">Select a highlighted date to view bookings.</p>
                ) : dayBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No booking on{' '}
                    {new Intl.DateTimeFormat('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(selectedDate)}
                    .
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {new Intl.DateTimeFormat('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(dayBookings[0].startsAt))}
                    </p>
                    <ul className="space-y-2">
                      {dayBookings.map((booking) => (
                        <li
                          key={booking.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-foreground">{booking.treatmentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
                                new Date(booking.startsAt),
                              )}
                            </p>
                          </div>
                          <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
