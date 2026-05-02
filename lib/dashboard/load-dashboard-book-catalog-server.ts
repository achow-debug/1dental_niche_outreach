import type { SupabaseClient } from '@supabase/supabase-js'
import type { SessionTypeRow } from '@/lib/dashboard/catalog-slug'
import { slugForSessionType } from '@/lib/dashboard/catalog-slug'

export type DashboardBookTreatment = {
  /** URL `treatment` query value; stable slug from catalog resolver. */
  catalogSlug: string
  sessionTypeId: string
  name: string
  description: string
  category: string
  durationMinutes: number
  priceLabel: string
  badge?: string
}

type CategoryRow = { name: string | null; slug: string | null; sort_order: number | null }

function formatPriceLabel(cents: number, currency: string | null | undefined): string {
  const code = currency && currency.length === 3 ? currency : 'GBP'
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  } catch {
    return `£${Math.round(cents / 100)}`
  }
}

function asSessionTypeRow(r: Record<string, unknown>): SessionTypeRow {
  return {
    id: String(r.id),
    title: String(r.title ?? ''),
    duration_minutes: Number(r.duration_minutes) || 30,
    price_cents: Number(r.price_cents) || 0,
    max_slots: Number(r.max_slots) || 1,
    metadata: (r.metadata as Record<string, unknown>) ?? null,
  }
}

/**
 * Active session types for the authenticated dashboard booking flow (RLS).
 */
export async function loadDashboardBookCatalogServer(
  supabase: SupabaseClient,
): Promise<DashboardBookTreatment[]> {
  const selectWithCategory = `
    id,
    title,
    description,
    duration_minutes,
    price_cents,
    currency,
    max_slots,
    metadata,
    deleted_at,
    session_categories ( name, slug, sort_order )
  `

  let { data, error } = await supabase
    .from('session_types')
    .select(selectWithCategory)
    .eq('is_active', true)
    .is('deleted_at', null)

  if (error) {
    const msg = (error.message ?? '').toLowerCase()
    if (msg.includes('column') || msg.includes('relationship')) {
      const fb = await supabase
        .from('session_types')
        .select('id, title, description, duration_minutes, price_cents, currency, max_slots, metadata, deleted_at')
        .eq('is_active', true)
        .is('deleted_at', null)
      data = fb.data as typeof data
      error = fb.error
    }
  }

  if (error || !data?.length) return []

  const rows = data as Record<string, unknown>[]

  const items: DashboardBookTreatment[] = rows.map((row) => {
    const st = asSessionTypeRow(row)
    const meta = st.metadata as Record<string, unknown> | null | undefined
    let category = 'Treatments'
    const sc = row.session_categories as CategoryRow | CategoryRow[] | null | undefined
    const cat = Array.isArray(sc) ? sc[0] : sc
    if (cat?.name) category = cat.name

    const badgeRaw = meta?.dashboard_badge ?? meta?.badge
    const badge = typeof badgeRaw === 'string' && badgeRaw.trim() ? badgeRaw.trim() : undefined

    const currency = (row.currency as string | null) ?? 'GBP'
    const priceCents = Number(row.price_cents) || 0

    return {
      catalogSlug: slugForSessionType(st),
      sessionTypeId: st.id,
      name: st.title,
      description: (row.description as string | null) ?? '',
      category,
      durationMinutes: st.duration_minutes,
      priceLabel: formatPriceLabel(priceCents, currency),
      badge,
    }
  })

  items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

  return items
}
