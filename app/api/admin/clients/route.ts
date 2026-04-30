import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient, MissingSupabaseAdminEnvError } from '@/lib/supabase/admin'

type CreateClientBody = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

function temporaryPassword() {
  return `${randomBytes(24).toString('base64url')}Aa1`
}

export async function POST(request: Request) {
  try {
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

    const fullName = `${firstName} ${lastName}`.trim()
    const adminClient = createAdminClient()

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: temporaryPassword(),
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message ?? 'Failed to create auth user.' }, { status: 400 })
    }

    const userId = authData.user.id

    const { data: savedProfile, error: profileSaveError } = await adminClient
      .from('profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email,
        phone: phone || null,
        role: 'client',
        status: 'active',
      })
      .select('id, first_name, last_name, email, phone, role, status')
      .maybeSingle()

    if (profileSaveError || !savedProfile) {
      await adminClient.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { error: profileSaveError?.message ?? 'Failed to save profile in public.profiles.' },
        { status: 400 },
      )
    }

    return NextResponse.json({ client: savedProfile }, { status: 201 })
  } catch (error) {
    if (error instanceof MissingSupabaseAdminEnvError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const message = error instanceof Error ? error.message : 'Unexpected server error while saving client.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
