import { createClient } from '@/lib/supabase/server'
import type { SessionTypeRow } from '@/lib/dashboard/catalog-slug'
import { slugForSessionType } from '@/lib/dashboard/catalog-slug'
import type { UserBooking, UserBookingStatus } from '@/lib/dashboard/user-bookings'

type BookingRow = {
  id: string
  status: UserBookingStatus
  session_type_id: string | null
  sessions: { starts_at: string } | { starts_at: string }[] | null
  session_types?: SessionTypeRow | SessionTypeRow[] | null
}

function mapBookingRow(row: BookingRow): UserBooking {
  const sessions = row.sessions
  const startsAt = Array.isArray(sessions) ? sessions[0]?.starts_at : sessions?.starts_at
  const st = row.session_types
  const typeRow = Array.isArray(st) ? st[0] : st
  const title = typeRow?.title ?? 'Appointment'
  const slug = typeRow ? slugForSessionType(typeRow) : String(row.session_type_id ?? 'unknown')
  return {
    id: row.id,
    treatmentName: title,
    treatmentId: slug,
    startsAt: startsAt ?? new Date().toISOString(),
    status: row.status,
  }
}

async function loadTypesByIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[],
): Promise<Map<string, SessionTypeRow>> {
  const map = new Map<string, SessionTypeRow>()
  if (ids.length === 0) return map
  const { data } = await supabase.from('session_types').select('id, title, metadata').in('id', ids)
  for (const t of data ?? []) {
    map.set(t.id as string, t as SessionTypeRow)
  }
  return map
}

export async function loadUserBookingsForDashboard(): Promise<UserBooking[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const fullSelect = `
      id,
      status,
      session_type_id,
      sessions ( starts_at ),
      session_types ( id, title, metadata )
    `

  let { data, error } = await supabase
    .from('bookings')
    .select(fullSelect)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    const { data: simple, error: err2 } = await supabase
      .from('bookings')
      .select(
        `
        id,
        status,
        session_type_id,
        sessions ( starts_at )
      `,
      )
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (err2 || !simple?.length) return []

    const ids = [...new Set(simple.map((b) => (b as BookingRow).session_type_id).filter(Boolean))] as string[]
    const typeById = await loadTypesByIds(supabase, ids)

    return (simple as BookingRow[]).map((row) => {
      const tid = row.session_type_id
      const typeRow = tid ? typeById.get(tid) : undefined
      return mapBookingRow({
        ...row,
        session_types: typeRow ?? null,
      })
    })
  }

  if (!data?.length) return []

  return (data as BookingRow[]).map((row) => mapBookingRow(row))
}
