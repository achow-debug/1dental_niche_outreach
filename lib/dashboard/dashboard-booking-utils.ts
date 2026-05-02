import type { UserBooking, UserBookingStatus } from '@/lib/dashboard/user-bookings'

const TZ = 'Europe/London'

export type PipelineCounts = {
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

function dayKeyInTz(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(iso),
  )
}

function todayKeyInTz(timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(),
  )
}

/** True when booking local calendar day equals "today" in London. */
export function isBookingToday(startsAt: string, timeZone = TZ) {
  return dayKeyInTz(startsAt, timeZone) === todayKeyInTz(timeZone)
}

export function getPipelineCounts(bookings: UserBooking[]): PipelineCounts {
  const counts: PipelineCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  for (const b of bookings) {
    if (b.status === 'pending') counts.pending += 1
    else if (b.status === 'confirmed') counts.confirmed += 1
    else if (b.status === 'completed') counts.completed += 1
    else if (b.status === 'cancelled' || b.status === 'no_show') counts.cancelled += 1
  }
  return counts
}

function isPastBooking(booking: UserBooking, nowMs: number) {
  return new Date(booking.startsAt).getTime() < nowMs
}

/** Active future (or same-moment) visits: pending/confirmed with start >= now. */
export function getUpcomingBookings(bookings: UserBooking[], now = new Date()): UserBooking[] {
  const nowMs = now.getTime()
  return bookings
    .filter((b) => !isPastBooking(b, nowMs) && (b.status === 'pending' || b.status === 'confirmed'))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
}

/** Past starts, or terminal / inactive outcomes (incl. same-day if already past). */
export function getHistoryBookings(bookings: UserBooking[], now = new Date()): UserBooking[] {
  const nowMs = now.getTime()
  return bookings
    .filter((b) => {
      if (isPastBooking(b, nowMs)) return true
      return b.status === 'completed' || b.status === 'cancelled' || b.status === 'no_show'
    })
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
}

export function getNextAppointment(bookings: UserBooking[], now = new Date()): UserBooking | null {
  const upcoming = getUpcomingBookings(bookings, now)
  return upcoming[0] ?? null
}

export type HeroContext = {
  greeting: string
  headline: string
  subline: string
  hasBookingToday: boolean
}

function timeGreeting(now = new Date()) {
  const h = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: TZ }).format(now),
  )
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function buildHeroContext(firstName: string, bookings: UserBooking[], now = new Date()): HeroContext {
  const greeting = `${timeGreeting(now)}, ${firstName}`
  const next = getNextAppointment(bookings, now)
  const hasAny = bookings.length > 0
  const hasBookingToday = next ? isBookingToday(next.startsAt) : false

  if (next && hasBookingToday) {
    return {
      greeting,
      headline: `You have ${next.treatmentName} today at ${formatTime(next.startsAt)}.`,
      subline: 'We will see you soon. You can review details or reschedule from My bookings.',
      hasBookingToday: true,
    }
  }

  if (next) {
    return {
      greeting,
      headline: `Next up: ${next.treatmentName} on ${formatShortDate(next.startsAt)} at ${formatTime(next.startsAt)}.`,
      subline: 'Manage your visit anytime from the cards below.',
      hasBookingToday: false,
    }
  }

  if (!hasAny) {
    return {
      greeting,
      headline: 'Ready when you are.',
      subline: 'Book your first visit in a few taps — choose a treatment, then pick a time that suits you.',
      hasBookingToday: false,
    }
  }

  return {
    greeting,
    headline: 'You are all caught up on visits.',
    subline: 'Book again whenever you like, or browse your past appointments in My bookings.',
    hasBookingToday: false,
  }
}

export function hasCompletedBooking(bookings: UserBooking[]) {
  return bookings.some((b) => b.status === 'completed')
}

export function primaryBookCtaLabel(hasAnyBooking: boolean) {
  return hasAnyBooking ? 'Book another session' : 'Book your first visit'
}
