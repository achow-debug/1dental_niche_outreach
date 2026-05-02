import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, MissingSupabaseAdminEnvError } from '@/lib/supabase/admin'
import type { SessionTypeRow } from '@/lib/dashboard/catalog-slug'
import { resolveSessionTypeForSlug, slugForSessionType } from '@/lib/dashboard/catalog-slug'
import { fetchAvailableBookableSessions } from '@/lib/dashboard/available-bookable-sessions'
import { mapSessionRowsToDashboardSlots } from '@/lib/dashboard/booking'

async function loadSessionTypesForResolve(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<SessionTypeRow[]> {
  let { data: rows, error } = await supabase
    .from('session_types')
    .select('id, title, duration_minutes, price_cents, max_slots, metadata, deleted_at')
    .eq('is_active', true)
    .order('title', { ascending: true })

  if (error) {
    const msg = (error.message ?? '').toLowerCase()
    if (msg.includes('column') && msg.includes('deleted_at')) {
      const fb = await supabase
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

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const catalogSlug = url.searchParams.get('treatment')?.trim() ?? ''
    const sessionTypeIdParam = url.searchParams.get('sessionTypeId')?.trim() ?? ''
    if (!catalogSlug && !sessionTypeIdParam) {
      return NextResponse.json({ error: 'treatment or sessionTypeId is required.' }, { status: 400 })
    }

    const types = await loadSessionTypesForResolve(supabase)
    const resolved = sessionTypeIdParam
      ? types.find((t) => t.id === sessionTypeIdParam)
      : resolveSessionTypeForSlug(catalogSlug, types)

    if (!resolved) {
      return NextResponse.json({ error: 'Unknown treatment type.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: settings } = await admin
      .from('practice_settings')
      .select('max_advance_booking_days')
      .eq('singleton', true)
      .maybeSingle()
    const maxDays = typeof settings?.max_advance_booking_days === 'number' ? settings.max_advance_booking_days : 90

    const now = new Date()
    const from = new Date(now)
    from.setHours(0, 0, 0, 0)
    const to = new Date(from)
    to.setDate(to.getDate() + maxDays)

    const rows = await fetchAvailableBookableSessions(
      admin,
      resolved.id,
      from.toISOString(),
      to.toISOString(),
      now.toISOString(),
    )

    const canonicalSlug = slugForSessionType(resolved)
    const slots = mapSessionRowsToDashboardSlots(rows, canonicalSlug)

    return NextResponse.json({
      sessionTypeId: resolved.id,
      catalogSlug: canonicalSlug,
      slots,
    })
  } catch (error) {
    if (error instanceof MissingSupabaseAdminEnvError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const message = error instanceof Error ? error.message : 'Failed to load slots.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
