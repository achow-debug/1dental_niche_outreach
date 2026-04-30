import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'

const ALLOWED = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, ctx: Ctx) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { status?: string }
  try {
    body = (await request.json()) as { status?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const status = body.status?.trim()
  if (!status || !ALLOWED.has(status)) {
    return NextResponse.json({ error: 'Invalid or missing status.' }, { status: 400 })
  }

  const { id } = await ctx.params

  const { error } = await supabase.from('bookings').update({ status }).eq('id', id).is('deleted_at', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
