import { BookingsClient } from '@/app/dashboard/bookings/bookings-client'
import { loadUserBookingsForDashboard } from '@/lib/dashboard/load-user-bookings-server'

export const metadata = {
  title: 'My bookings | Carter Dental Studio',
  description: 'View and manage your appointments.',
}

export default async function DashboardBookingsPage() {
  const bookings = await loadUserBookingsForDashboard()

  return <BookingsClient bookings={bookings} />
}
