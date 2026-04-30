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

export async function POST(request: Request) {
  const gate = await requireStaff()
  if ('error' in gate) return gate.error

  let body: { name?: string }
  try {
    body = (await request.json()) as { name?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const name = body.name?.trim() ?? ''
  if (!name) {
    return NextResponse.json({ error: 'name is required.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('session_categories')
    .insert({ name, sort_order: 0, is_active: true })
    .select('id, name, is_active')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ category: data }, { status: 201 })
}
