import type { UserBooking } from '@/lib/dashboard/user-bookings'
import { getHistoryBookings, getUpcomingBookings } from '@/lib/dashboard/dashboard-booking-utils'

export const DASHBOARD_BOOKINGS_TZ = 'Europe/London'

function isSameCalendarDayInZone(iso: string, d: Date, timeZone: string): boolean {
  const key = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(iso),
  )
  const key2 = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    d,
  )
  return key === key2
}

function startOfDayInTimeZone(d: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value
  if (!y || !m || !day) return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return new Date(`${y}-${m}-${day}T00:00:00`)
}

function formatNextVisit(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: DASHBOARD_BOOKINGS_TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

export type BookingsEmptyStateModel = {
  headline: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; onClickAction: 'history' | 'upcoming' }
}

/** When the user has zero bookings in the system. */
export function buildGlobalBookingsEmptyState(): BookingsEmptyStateModel {
  return {
    headline: 'Your calendar is open',
    body: 'Choose a time that fits your week — gentle care, clear pricing, and no pressure.',
    primaryCta: { label: 'Book a treatment', href: '/dashboard/book' },
  }
}

/** When the active list tab has no rows (but the other tab may still have rows). */
export function buildTabBookingsEmptyState(bookings: UserBooking[], tab: 'upcoming' | 'history'): BookingsEmptyStateModel {
  const upcoming = getUpcomingBookings(bookings)
  const history = getHistoryBookings(bookings)

  if (tab === 'upcoming') {
    if (upcoming.length === 0 && history.length > 0) {
      return {
        headline: 'No upcoming visits',
        body: 'Book your next check-up when it suits you — your previous visits are saved under History.',
        primaryCta: { label: 'Book again', href: '/dashboard/book' },
        secondaryCta: { label: 'View history', onClickAction: 'history' },
      }
    }
    return {
      headline: 'No upcoming appointments',
      body: 'When you are ready, pick a treatment and a time that works for you.',
      primaryCta: { label: 'Book a treatment', href: '/dashboard/book' },
    }
  }

  return {
    headline: 'No past appointments yet',
    body: 'After your visits, they will appear here for easy reference.',
    primaryCta: { label: 'Book your first visit', href: '/dashboard/book' },
    secondaryCta: { label: 'See upcoming', onClickAction: 'upcoming' },
  }
}

/**
 * Friendly line when there are upcoming visits but none today (e.g. “How about tomorrow?”).
 * Returns null if there is a visit today, no upcoming visits, or nothing to say.
 */
export function buildNoVisitsTodayReminder(bookings: UserBooking[], now = new Date()): string | null {
  const upcoming = getUpcomingBookings(bookings)
  if (upcoming.length === 0) return null
  const hasToday = upcoming.some((b) => isSameCalendarDayInZone(b.startsAt, now, DASHBOARD_BOOKINGS_TZ))
  if (hasToday) return null
  const next = [...upcoming].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0]
  const nextDay = startOfDayInTimeZone(new Date(next.startsAt), DASHBOARD_BOOKINGS_TZ)
  const tomorrow = startOfDayInTimeZone(new Date(now.getTime() + 86400000), DASHBOARD_BOOKINGS_TZ)
  const isTomorrow = nextDay.getTime() === tomorrow.getTime()
  if (isTomorrow) {
    return `No visits today — your next appointment is tomorrow (${formatNextVisit(next.startsAt)}).`
  }
  return `No visits today. Next up: ${formatNextVisit(next.startsAt)}.`
}
