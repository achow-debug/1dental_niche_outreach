export type UserBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export type UserBooking = {
  id: string
  treatmentName: string
  /** Matches `DASHBOARD_TREATMENTS` ids for deep links (rebook, calendar). */
  treatmentId: string
  startsAt: string
  status: UserBookingStatus
}

/** Mock user bookings for list + calendar views until wired to Supabase. */
export const USER_BOOKINGS: UserBooking[] = [
  {
    id: 'ub-1',
    treatmentName: 'Hygiene maintenance',
    treatmentId: 'hygiene-maintenance',
    startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
  },
  {
    id: 'ub-2',
    treatmentName: 'New patient examination',
    treatmentId: 'new-patient-exam',
    startsAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'ub-3',
    treatmentName: 'Teeth whitening consultation',
    treatmentId: 'teeth-whitening-consult',
    startsAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'ub-4',
    treatmentName: 'Aligner consultation',
    treatmentId: 'aligner-consult',
    startsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'cancelled',
  },
]

/** Deep link for “rebook last treatment” from a booking list. */
export function getRebookHrefFromBookings(bookings: UserBooking[]): string {
  const completed = bookings.filter((b) => b.status === 'completed')
  if (completed.length === 0) {
    return '/dashboard/book'
  }
  const latest = [...completed].sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
  )[0]
  return `/dashboard/book/calendar?treatment=${encodeURIComponent(latest.treatmentId)}`
}

/** Mock fallback rebook link (demo data). */
export function getRebookHref(): string {
  return getRebookHrefFromBookings(USER_BOOKINGS)
}
