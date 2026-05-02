export type UserBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export type UserBooking = {
  id: string
  treatmentName: string
  /** Catalog slug from `slugForSessionType` for deep links (rebook, calendar). */
  treatmentId: string
  startsAt: string
  status: UserBookingStatus
}

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
