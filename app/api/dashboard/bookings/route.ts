import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient, MissingSupabaseAdminEnvError } from '@/lib/supabase/admin'
import type { SessionTypeRow } from '@/lib/dashboard/catalog-slug'
import { resolveSessionTypeForSlug } from '@/lib/dashboard/catalog-slug'

type PostBody = {
  catalogSlug?: string
  sessionTypeId?: string
  startsAt?: string
  /** Book an existing practice session with spare capacity. */
  sessionId?: string
}

async function loadSessionTypes(admin: ReturnType<typeof createAdminClient>): Promise<SessionTypeRow[]> {
  let { data: rows, error } = await admin
    .from('session_types')
    .select('id, title, duration_minutes, price_cents, max_slots, metadata, deleted_at')
    .eq('is_active', true)
    .order('title', { ascending: true })

  if (error) {
    const msg = (error.message ?? '').toLowerCase()
    if (msg.includes('column') && msg.includes('deleted_at')) {
      const fb = await admin
        .from('session_types')
        .select('id, title, duration_minutes, price_cents, max_slots, metadata')
        .eq('is_active', true)
        .order('title', { ascending: true })
      rows = fb.data as typeof rows
      error = fb.error
    }
  }
  if (error) throw new Error(error.message)

  return (rows ?? [])
    .filter((r) => (r as { deleted_at?: string | null }).deleted_at == null)
    .map((r) => {
      const row = r as Record<string, unknown>
      return {
        id: row.id as string,
        title: row.title as string,
        duration_minutes: Number(row.duration_minutes) || 30,
        price_cents: Number(row.price_cents) || 0,
        max_slots: Number(row.max_slots) || 1,
        metadata: (row.metadata as Record<string, unknown>) ?? null,
      }
    })
}

async function countActiveBookings(admin: ReturnType<typeof createAdminClient>, sessionId: string): Promise<number> {
  const { data, error } = await admin
    .from('bookings')
    .select('id, status')
    .eq('session_id', sessionId)
    .is('deleted_at', null)

  if (error) return 999
  let n = 0
  for (const row of data ?? []) {
    if ((row as { status: string }).status === 'cancelled') continue
    n += 1
  }
  return n
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: PostBody
    try {
      body = (await request.json()) as PostBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const admin = createAdminClient()
    const sessionId = body.sessionId?.trim()

    if (sessionId) {
      const { data: sess, error: sessErr } = await admin
        .from('sessions')
        .select('id, starts_at, max_slots, session_type_id, status, deleted_at')
        .eq('id', sessionId)
        .single()

      if (sessErr || !sess) {
        return NextResponse.json({ error: 'Session not found.' }, { status: 400 })
      }

      if ((sess as { deleted_at?: string | null }).deleted_at != null) {
        return NextResponse.json({ error: 'This time is no longer available.' }, { status: 400 })
      }
      if ((sess as { status: string }).status !== 'scheduled') {
        return NextResponse.json({ error: 'This time is no longer bookable.' }, { status: 400 })
      }

      const starts = new Date((sess as { starts_at: string }).starts_at)
      if (Number.isNaN(starts.getTime()) || starts.getTime() <= Date.now()) {
        return NextResponse.json({ error: 'This time has already passed.' }, { status: 400 })
      }

      const maxSlots = Number((sess as { max_slots: number }).max_slots) || 1
      const used = await countActiveBookings(admin, sessionId)
      if (used >= maxSlots) {
        return NextResponse.json({ error: 'This slot is fully booked.' }, { status: 400 })
      }

      const { data: dup } = await admin
        .from('bookings')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle()

      if (dup) {
        return NextResponse.json({ error: 'You already have a booking for this time.' }, { status: 400 })
      }

      const stId = (sess as { session_type_id: string }).session_type_id

      const sessionTypeIdForMatch = body.sessionTypeId?.trim()
      if (body.catalogSlug?.trim() || sessionTypeIdForMatch) {
        const types = await loadSessionTypes(admin)
        const byId = sessionTypeIdForMatch ? types.find((t) => t.id === sessionTypeIdForMatch) : undefined
        const resolved = byId ?? resolveSessionTypeForSlug(body.catalogSlug?.trim() ?? '', types)
        if (resolved && resolved.id !== stId) {
          return NextResponse.json({ error: 'Treatment does not match the selected time.' }, { status: 400 })
        }
      }

      const { data: bookingRow, error: bookingError } = await admin
        .from('bookings')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          session_type_id: stId,
          status: 'pending',
        })
        .select('id')
        .single()

      if (bookingError || !bookingRow) {
        return NextResponse.json({ error: bookingError?.message ?? 'Failed to create booking.' }, { status: 400 })
      }

      return NextResponse.json({ bookingId: bookingRow.id, sessionId }, { status: 201 })
    }

    const startsAt = body.startsAt?.trim()
    if (!startsAt) {
      return NextResponse.json({ error: 'startsAt is required unless sessionId is provided.' }, { status: 400 })
    }

    if (!body.sessionTypeId?.trim() && !body.catalogSlug?.trim()) {
      return NextResponse.json({ error: 'catalogSlug or sessionTypeId is required.' }, { status: 400 })
    }

    const start = new Date(startsAt)
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: 'startsAt must be a valid ISO date string.' }, { status: 400 })
    }

    const types = await loadSessionTypes(admin)
    const sessionTypeIdTrimmed = body.sessionTypeId?.trim()
    const byId = sessionTypeIdTrimmed ? types.find((t) => t.id === sessionTypeIdTrimmed) : undefined
    const resolved = byId ?? resolveSessionTypeForSlug(body.catalogSlug?.trim() ?? '', types)

    if (!resolved) {
      return NextResponse.json({ error: 'No matching treatment type in catalog.' }, { status: 400 })
    }

    const durationMinutes = resolved.duration_minutes || 30
    const maxSlots = resolved.max_slots || 1
    const end = new Date(start.getTime() + durationMinutes * 60_000)
    const priceCents = Math.max(0, resolved.price_cents)

    const { data: sessionRow, error: sessionError } = await admin
      .from('sessions')
      .insert({
        session_type_id: resolved.id,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        timezone: 'Europe/London',
        max_slots: maxSlots,
        price_override_cents: priceCents,
        status: 'scheduled',
      })
      .select('id')
      .single()

    if (sessionError || !sessionRow) {
      return NextResponse.json({ error: sessionError?.message ?? 'Failed to create session.' }, { status: 400 })
    }

    const { data: bookingRow, error: bookingError } = await admin
      .from('bookings')
      .insert({
        user_id: user.id,
        session_id: sessionRow.id,
        session_type_id: resolved.id,
        status: 'pending',
      })
      .select('id')
      .single()

    if (bookingError || !bookingRow) {
      await admin.from('sessions').delete().eq('id', sessionRow.id)
      return NextResponse.json({ error: bookingError?.message ?? 'Failed to create booking.' }, { status: 400 })
    }

    return NextResponse.json({ bookingId: bookingRow.id, sessionId: sessionRow.id }, { status: 201 })
  } catch (error) {
    if (error instanceof MissingSupabaseAdminEnvError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const message = error instanceof Error ? error.message : 'Booking failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
