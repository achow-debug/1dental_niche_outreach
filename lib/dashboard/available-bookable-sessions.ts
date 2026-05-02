import type { SupabaseClient } from '@supabase/supabase-js'

export type BookableSessionRow = { id: string; starts_at: string }

/**
 * Returns future `sessions` rows for a session type with remaining capacity (server / service role).
 */
export async function fetchAvailableBookableSessions(
  admin: SupabaseClient,
  sessionTypeId: string,
  fromIso: string,
  toIso: string,
  nowIso: string,
): Promise<BookableSessionRow[]> {
  const { data: sessions, error } = await admin
    .from('sessions')
    .select('id, starts_at, max_slots')
    .eq('session_type_id', sessionTypeId)
    .eq('status', 'scheduled')
    .is('deleted_at', null)
    .gt('starts_at', nowIso)
    .gte('starts_at', fromIso)
    .lte('starts_at', toIso)
    .order('starts_at', { ascending: true })

  if (error || !sessions?.length) return []

  const ids = sessions.map((s) => s.id as string)
  const { data: bookingRows } = await admin
    .from('bookings')
    .select('session_id, status')
    .in('session_id', ids)
    .is('deleted_at', null)

  const counts = new Map<string, number>()
  for (const row of bookingRows ?? []) {
    const sid = row.session_id as string
    const st = row.status as string
    if (st === 'cancelled') continue
    counts.set(sid, (counts.get(sid) ?? 0) + 1)
  }

  return sessions
    .filter((s) => {
      const max = Number(s.max_slots) || 1
      const used = counts.get(s.id as string) ?? 0
      return used < max
    })
    .map((s) => ({ id: s.id as string, starts_at: s.starts_at as string }))
}
