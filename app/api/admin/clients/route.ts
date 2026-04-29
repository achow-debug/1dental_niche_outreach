import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type CreateClientBody = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: CreateClientBody
  try {
    body = (await request.json()) as CreateClientBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const firstName = body.firstName?.trim() ?? ''
  const lastName = body.lastName?.trim() ?? ''
  const email = body.email?.trim().toLowerCase() ?? ''
  const phone = body.phone?.trim() ?? ''

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: 'firstName, lastName, and email are required.' },
      { status: 400 },
    )
  }

  const adminClient = createAdminClient()
  const fullName = `${firstName} ${lastName}`.trim()

  const { data: created, error: insertError } = await adminClient
    .from('profiles')
    .insert({
      id: crypto.randomUUID(),
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone: phone || null,
      role: 'client',
      status: 'active',
    })
    .select('id, first_name, last_name, email, phone, role, status')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 })
  }

  return NextResponse.json({ client: created }, { status: 201 })
}
