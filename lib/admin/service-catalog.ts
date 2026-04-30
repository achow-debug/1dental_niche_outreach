import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActiveService, ServiceCategory, ServiceTemplate, TreatmentTypeRow } from '@/lib/mocks/admin'

function toLocalStartEnd(isoStart: string, isoEnd: string) {
  const s = new Date(isoStart)
  const e = new Date(isoEnd)
  const fmt = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${day}T${hh}:${mm}`
  }
  return { startsAt: fmt(s), endsAt: fmt(e) }
}

export async function loadServiceCatalog(supabase: SupabaseClient): Promise<{
  categories: ServiceCategory[]
  templates: ServiceTemplate[]
  services: ActiveService[]
  treatmentTypeRows: TreatmentTypeRow[]
}> {
  const { data: catRows, error: catErr } = await supabase
    .from('session_categories')
    .select('id, name, is_active, deleted_at')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })

  if (catErr) {
    const message = (catErr.message ?? '').toLowerCase()
    if (!message.includes("could not find the table 'public.session_categories'")) {
      throw new Error(catErr.message)
    }
  }

  const categories: ServiceCategory[] = (catRows ?? []).map((c) => ({
    id: c.id as string,
    name: c.name as string,
    description: '',
    isActive: Boolean(c.is_active),
  }))

  const baseTypeSelect = `
        id,
        title,
        duration_minutes,
        price_cents,
        is_active,
        updated_at
      `

  let { data: typeRows, error: typeErr } = await supabase
    .from('session_types')
    .select(`${baseTypeSelect}, category_id, deleted_at`)
    .is('deleted_at', null)
    .order('title', { ascending: true })

  if (typeErr) {
    const message = (typeErr.message ?? '').toLowerCase()
    if (message.includes('column session_types.deleted_at does not exist')) {
      const fallback = await supabase
        .from('session_types')
        .select(`${baseTypeSelect}, category_id`)
        .order('title', { ascending: true })
      typeRows = fallback.data
      typeErr = fallback.error
    }
  }

  if (typeErr) {
    const message = (typeErr.message ?? '').toLowerCase()
    if (message.includes('column session_types.category_id does not exist')) {
      const fallback = await supabase.from('session_types').select(baseTypeSelect).order('title', { ascending: true })
      typeRows = fallback.data
      typeErr = fallback.error
    }
  }

  if (typeErr) throw new Error(typeErr.message)

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))

  const templates: ServiceTemplate[] = (typeRows ?? []).map((t) => {
    const categoryId = (t as { category_id?: string | null }).category_id ?? null
    const catName = categoryId ? categoryNameById.get(categoryId) : null
    return {
      id: t.id as string,
      title: t.title as string,
      category: catName ?? 'Uncategorised',
      basePrice: ((t.price_cents as number) ?? 0) / 100,
      subscription: 'none' as const,
      defaultDurationMinutes: (t.duration_minutes as number) ?? 30,
      isActive: Boolean(t.is_active),
    }
  })

  const treatmentTypeRows: TreatmentTypeRow[] = (typeRows ?? []).map((t) => {
    const categoryId = (t as { category_id?: string | null }).category_id ?? null
    const catName = categoryId ? categoryNameById.get(categoryId) : null
    const updated = (t as { updated_at?: string }).updated_at
    return {
      id: t.id as string,
      name: t.title as string,
      category: catName ?? 'Uncategorised',
      durationMinutes: (t.duration_minutes as number) ?? 30,
      price: ((t.price_cents as number) ?? 0) / 100,
      status: t.is_active ? ('active' as const) : ('archived' as const),
      updatedAt: updated ? String(updated).slice(0, 10) : new Date().toISOString().slice(0, 10),
    }
  })

  const { data: sessionRows, error: sessErr } = await supabase
    .from('sessions')
    .select(
      `
        id,
        starts_at,
        ends_at,
        price_override_cents,
        status,
        location_override,
        deleted_at,
        session_types ( title )
      `,
    )
    .is('deleted_at', null)
    .order('starts_at', { ascending: false })

  if (sessErr) throw new Error(sessErr.message)

  const services: ActiveService[] = (sessionRows ?? []).map((s) => {
    const st = s.session_types as { title?: string } | { title?: string }[] | null
    const title = Array.isArray(st) ? st[0]?.title : st?.title
    const { startsAt, endsAt } = toLocalStartEnd(s.starts_at as string, s.ends_at as string)
    const override = s.price_override_cents as number | null
    return {
      id: s.id as string,
      templateTitle: title ?? 'Session',
      clinician: (s.location_override as string) || '—',
      startsAt,
      endsAt,
      priceOverride: override != null ? override / 100 : null,
      status: (s.status as ActiveService['status']) || 'scheduled',
    }
  })

  return { categories, templates, services, treatmentTypeRows }
}
