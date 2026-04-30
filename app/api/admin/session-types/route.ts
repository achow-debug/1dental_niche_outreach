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
  categoryId?: string
  title?: string
  description?: string | null
  durationMinutes?: number
  priceGbp?: number
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

  const categoryId = body.categoryId?.trim() ?? ''
  const title = body.title?.trim() ?? ''
  const durationMinutes = Number(body.durationMinutes)
  const priceGbp = Number(body.priceGbp)

  if (!categoryId || !title || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return NextResponse.json(
      { error: 'categoryId, title, and positive durationMinutes are required.' },
      { status: 400 },
    )
  }

  if (!Number.isFinite(priceGbp) || priceGbp < 0) {
    return NextResponse.json({ error: 'priceGbp must be a non-negative number.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('session_types')
    .insert({
      category_id: categoryId,
      title,
      description: body.description?.trim() || null,
      duration_minutes: Math.round(durationMinutes),
      price_cents: Math.round(priceGbp * 100),
      currency: 'GBP',
      max_slots: 1,
      is_active: true,
    })
    .select('id, title, category_id, duration_minutes, price_cents')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ sessionType: data }, { status: 201 })
}
