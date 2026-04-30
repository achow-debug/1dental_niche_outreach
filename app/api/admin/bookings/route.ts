import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient, MissingSupabaseAdminEnvError } from '@/lib/supabase/admin'
import { mapBookingToRow, type BookingListRow } from '@/lib/admin/bookings-map'

async function requireStaff() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as const }
  }
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (error || !profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) as const }
  }
  return { supabase, user } as const
}

export async function GET() {
  const gate = await requireStaff()
  if ('error' in gate) return gate.error

  const { supabase } = gate
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(
      `
      id,
      status,
      user_id,
      sessions (
        starts_at,
        price_override_cents,
        session_types ( title, price_cents, duration_minutes )
      )
    `,
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 400 })
  }

  const rows = (bookings ?? []) as BookingListRow[]
  const userIds = [...new Set(rows.map((b) => b.user_id))]
  let profileById = new Map<
    string,
    { first_name: string | null; last_name: string | null; full_name: string | null; email: string | null }
  >()

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, full_name, email')
      .in('id', userIds)

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 400 })
    }
    profileById = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        {
          first_name: (p as { first_name?: string | null }).first_name ?? null,
          last_name: (p as { last_name?: string | null }).last_name ?? null,
          full_name: (p as { full_name?: string | null }).full_name ?? null,
          email: (p as { email?: string | null }).email ?? null,
        },
      ]),
    )
  }

  const mapped = rows
    .map((b) => mapBookingToRow(b, profileById))
    .filter((row): row is NonNullable<typeof row> => row != null)

  return NextResponse.json({ bookings: mapped })
}

type CreateBookingBody = {
  userId?: string
  sessionTypeId?: string
  startsAt?: string
  priceGbp?: number
}

export async function POST(request: Request) {
  try {
    const gate = await requireStaff()
    if ('error' in gate) return gate.error

    let body: CreateBookingBody
    try {
      body = (await request.json()) as CreateBookingBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const userId = body.userId?.trim()
    const sessionTypeId = body.sessionTypeId?.trim()
    const startsAt = body.startsAt?.trim()
    const priceGbp = body.priceGbp

    if (!userId || !sessionTypeId || !startsAt || typeof priceGbp !== 'number' || Number.isNaN(priceGbp)) {
      return NextResponse.json(
        { error: 'userId, sessionTypeId, startsAt (ISO), and priceGbp are required.' },
        { status: 400 },
      )
    }

    const start = new Date(startsAt)
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: 'startsAt must be a valid ISO date string.' }, { status: 400 })
    }

    const admin = createAdminClient()

    let { data: sessionType, error: typeError } = await admin
      .from('session_types')
      .select('id, duration_minutes, max_slots')
      .eq('id', sessionTypeId)
      .is('deleted_at', null)
      .maybeSingle()

    if (typeError) {
      const message = (typeError.message ?? '').toLowerCase()
      if (message.includes('column session_types.deleted_at does not exist')) {
        const fallback = await admin
          .from('session_types')
          .select('id, duration_minutes, max_slots')
          .eq('id', sessionTypeId)
          .maybeSingle()
        sessionType = fallback.data
        typeError = fallback.error
      }
    }

    if (typeError || !sessionType) {
      return NextResponse.json({ error: typeError?.message ?? 'Session type not found.' }, { status: 400 })
    }

    const durationMinutes = Number(sessionType.duration_minutes) || 30
    const maxSlots = Number(sessionType.max_slots) || 1
    const end = new Date(start.getTime() + durationMinutes * 60_000)

    const priceCents = Math.max(0, Math.round(priceGbp * 100))

    const { data: sessionRow, error: sessionError } = await admin
      .from('sessions')
      .insert({
        session_type_id: sessionTypeId,
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
        user_id: userId,
        session_id: sessionRow.id,
        session_type_id: sessionTypeId,
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
    const message = error instanceof Error ? error.message : 'Unexpected server error while saving booking.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
