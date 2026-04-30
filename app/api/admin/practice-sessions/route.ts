import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
  return {} as const
}

type Body = {
  sessionTypeId?: string
  startsAt?: string
  endsAt?: string
  priceOverrideGbp?: number | null
  locationLabel?: string | null
}

export async function POST(request: Request) {
  const gate = await requireStaff()
  if ('error' in gate) return gate.error

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const sessionTypeId = body.sessionTypeId?.trim() ?? ''
  const startsAt = body.startsAt?.trim() ?? ''
  const endsAt = body.endsAt?.trim() ?? ''

  if (!sessionTypeId || !startsAt || !endsAt) {
    return NextResponse.json({ error: 'sessionTypeId, startsAt, and endsAt (ISO) are required.' }, { status: 400 })
  }

  const start = new Date(startsAt)
  const end = new Date(endsAt)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: 'Invalid start or end time.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: sessionType, error: typeError } = await admin
    .from('session_types')
    .select('max_slots')
    .eq('id', sessionTypeId)
    .is('deleted_at', null)
    .maybeSingle()

  if (typeError || !sessionType) {
    return NextResponse.json({ error: typeError?.message ?? 'Session type not found.' }, { status: 400 })
  }

  const maxSlots = Number(sessionType.max_slots) || 1
  let priceOverrideCents: number | null = null
  if (body.priceOverrideGbp != null && Number.isFinite(Number(body.priceOverrideGbp))) {
    const n = Number(body.priceOverrideGbp)
    if (n >= 0) priceOverrideCents = Math.round(n * 100)
  }

  const { data, error } = await admin
    .from('sessions')
    .insert({
      session_type_id: sessionTypeId,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      timezone: 'Europe/London',
      max_slots: maxSlots,
      price_override_cents: priceOverrideCents,
      location_override: body.locationLabel?.trim() || null,
      status: 'scheduled',
    })
    .select('id, starts_at, ends_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ session: data }, { status: 201 })
}
