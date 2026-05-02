import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type Body = {
  notificationId?: string
  markAll?: boolean
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const now = new Date().toISOString()

  if (body.markAll) {
    const { error } = await supabase
      .from('user_notifications')
      .update({ read_at: now })
      .eq('user_id', user.id)
      .is('read_at', null)

    if (error) {
      const msg = error.message?.toLowerCase() ?? ''
      if (msg.includes('user_notifications') || msg.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ ok: true, skipped: true })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  }

  const id = body.notificationId?.trim()
  if (!id) {
    return NextResponse.json({ error: 'notificationId or markAll required' }, { status: 400 })
  }

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const { error } = await supabase
    .from('user_notifications')
    .update({ read_at: now })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
