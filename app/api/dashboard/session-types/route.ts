import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SessionTypeRow } from '@/lib/dashboard/catalog-slug'
import { slugForSessionType } from '@/lib/dashboard/catalog-slug'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let { data: rows, error } = await supabase
    .from('session_types')
    .select('id, title, duration_minutes, price_cents, metadata, deleted_at')
    .eq('is_active', true)
    .order('title', { ascending: true })

  if (error) {
    const msg = (error.message ?? '').toLowerCase()
    if (msg.includes('column') && msg.includes('deleted_at')) {
      const fb = await supabase
        .from('session_types')
        .select('id, title, duration_minutes, price_cents, metadata')
        .eq('is_active', true)
        .order('title', { ascending: true })
      rows = fb.data
      error = fb.error
    }
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const list: (SessionTypeRow & { catalogSlug: string })[] = (rows ?? [])
    .filter((r) => {
      const del = (r as { deleted_at?: string | null }).deleted_at
      return del == null
    })
    .map((r) => {
      const row = r as SessionTypeRow
      return {
        ...row,
        catalogSlug: slugForSessionType(row),
      }
    })

  return NextResponse.json({ sessionTypes: list })
}
