import type { BookingRow } from '@/lib/mocks/admin'

type SessionTypeRow = { title: string | null; price_cents: number | null; duration_minutes: number | null }

type SessionRow = {
  starts_at: string
  price_override_cents: number | null
  session_types: SessionTypeRow | SessionTypeRow[] | null
}

export type BookingListRow = {
  id: string
  status: string
  user_id: string
  sessions: SessionRow | SessionRow[] | null
}

const LONDON = 'Europe/London'

function formatSessionLocal(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { date: '', time: '' }
  const date = d.toLocaleDateString('en-CA', { timeZone: LONDON })
  const time = d.toLocaleTimeString('en-GB', {
    timeZone: LONDON,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return { date, time: time.replace(/\u202f/g, ' ').slice(0, 5) }
}

function clientDisplayName(profile: {
  first_name: string | null
  last_name: string | null
  full_name: string | null
  email: string | null
}) {
  const parts = [profile.first_name?.trim(), profile.last_name?.trim()].filter(Boolean)
  if (parts.length) return parts.join(' ')
  if (profile.full_name?.trim()) return profile.full_name.trim()
  return profile.email?.trim() || 'Unknown client'
}

export function mapBookingToRow(
  booking: BookingListRow,
  profileById: Map<
    string,
    { first_name: string | null; last_name: string | null; full_name: string | null; email: string | null }
  >
): BookingRow | null {
  const session = Array.isArray(booking.sessions) ? booking.sessions[0] : booking.sessions
  if (!session?.starts_at) return null

  const st = Array.isArray(session.session_types) ? session.session_types[0] : session.session_types
  const treatmentTitle = st?.title?.trim() || 'Appointment'
  const baseCents = st?.price_cents ?? 0
  const override = session.price_override_cents
  const priceGbp = (override != null ? override : baseCents) / 100

  const { date, time } = formatSessionLocal(session.starts_at)
  const profile = profileById.get(booking.user_id)
  const clientName = profile ? clientDisplayName(profile) : 'Unknown client'

  const status = booking.status as BookingRow['status']
  const allowed: BookingRow['status'][] = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']
  const normalized = allowed.includes(status) ? status : 'pending'

  return {
    id: booking.id,
    clientName,
    treatmentType: treatmentTitle,
    date,
    time,
    price: priceGbp,
    status: normalized,
  }
}
