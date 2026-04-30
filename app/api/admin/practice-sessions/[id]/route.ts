import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Ctx = { params: Promise<{ id: string }> }

const ALLOWED_STATUS = new Set(['scheduled', 'cancelled', 'completed'])

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

export async function PATCH(request: Request, ctx: Ctx) {
  const gate = await requireStaff()
  if ('error' in gate) return gate.error

  const { id } = await ctx.params
  let body: { status?: string }
  try {
    body = (await request.json()) as { status?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const status = body.status?.trim()
  if (!status || !ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('sessions').update({ status }).eq('id', id).is('deleted_at', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
