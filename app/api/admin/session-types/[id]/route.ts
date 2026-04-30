import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Ctx = { params: Promise<{ id: string }> }

async function requireStaff() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as const }
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (error || !profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) as const }
  }
  return {} as const
}

type Body = {
  action?: 'update' | 'duplicate'
  categoryId?: string
  title?: string
  durationMinutes?: number
  priceGbp?: number
  isActive?: boolean
}

export async function PATCH(request: Request, ctx: Ctx) {
  const gate = await requireStaff()
  if ('error' in gate) return gate.error

  const { id } = await ctx.params
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (body.action === 'duplicate') {
    const { data: src, error: srcErr } = await admin
      .from('session_types')
      .select('category_id, title, description, duration_minutes, price_cents, currency, max_slots, is_active, metadata, location_label')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (srcErr || !src) {
      return NextResponse.json({ error: srcErr?.message ?? 'Session type not found.' }, { status: 404 })
    }
    const { data, error } = await admin
      .from('session_types')
      .insert({
        category_id: src.category_id,
        title: `${src.title} (copy)`,
        description: src.description,
        duration_minutes: src.duration_minutes,
        price_cents: src.price_cents,
        currency: src.currency,
        max_slots: src.max_slots,
        is_active: src.is_active,
        metadata: src.metadata ?? {},
        location_label: src.location_label,
      })
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ sessionType: data }, { status: 201 })
  }

  const updates: Record<string, unknown> = {}
  if (body.categoryId) updates.category_id = body.categoryId
  if (typeof body.title === 'string' && body.title.trim()) updates.title = body.title.trim()
  if (typeof body.durationMinutes === 'number' && Number.isFinite(body.durationMinutes) && body.durationMinutes > 0) {
    updates.duration_minutes = Math.round(body.durationMinutes)
  }
  if (typeof body.priceGbp === 'number' && Number.isFinite(body.priceGbp) && body.priceGbp >= 0) {
    updates.price_cents = Math.round(body.priceGbp * 100)
  }
  if (typeof body.isActive === 'boolean') updates.is_active = body.isActive

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields supplied.' }, { status: 400 })
  }

  const { error } = await admin.from('session_types').update(updates).eq('id', id).is('deleted_at', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
