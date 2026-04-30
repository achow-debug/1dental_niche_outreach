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

export async function PATCH(request: Request, ctx: Ctx) {
  const gate = await requireStaff()
  if ('error' in gate) return gate.error

  const { id } = await ctx.params
  let body: { name?: string; isActive?: boolean }
  try {
    body = (await request.json()) as { name?: string; isActive?: boolean }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (typeof body.name === 'string' && body.name.trim()) updates.name = body.name.trim()
  if (typeof body.isActive === 'boolean') updates.is_active = body.isActive
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No valid fields supplied.' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('session_categories').update(updates).eq('id', id).is('deleted_at', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
