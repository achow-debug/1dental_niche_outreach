import type { SupabaseClient } from '@supabase/supabase-js'
import { slugForSessionType, type SessionTypeRow } from '@/lib/dashboard/catalog-slug'

export type LandingCatalogItem = {
  catalogSlug: string
  title: string
  description: string
  featureLines: string[]
  durationMinutes: number
  priceLabel: string
  categorySlug: string | null
  categorySortOrder: number
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

function featureLinesFromMetadata(metadata: Record<string, unknown> | null | undefined): string[] {
  if (!metadata || typeof metadata !== 'object') return []
  const raw = metadata.landing_features
  if (!Array.isArray(raw)) return []
  return raw
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .slice(0, 3)
    .map((s) => s.trim())
}

function asSessionTypeRow(r: Record<string, unknown>): SessionTypeRow {
  return {
    id: String(r.id),
    title: String(r.title ?? ''),
    duration_minutes: Number(r.duration_minutes) || 30,
    price_cents: Number(r.price_cents) ?? 0,
    max_slots: Number(r.max_slots) || 1,
    metadata: (r.metadata as Record<string, unknown>) ?? null,
  }
}

/**
 * Active public catalog rows for the landing page (RLS: active session_types for anonymous users).
 */
export async function loadPublicCatalogForLanding(
  supabase: SupabaseClient,
): Promise<LandingCatalogItem[]> {
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

  const items: LandingCatalogItem[] = rows.map((row) => {
    const st = asSessionTypeRow(row)
    const meta = st.metadata as Record<string, unknown> | null | undefined
    let categorySlug: string | null = null
    let categorySortOrder = 999
    const sc = row.session_categories as CategoryRow | CategoryRow[] | null | undefined
    const cat = Array.isArray(sc) ? sc[0] : sc
    if (cat) {
      categorySlug = cat.slug ?? null
      categorySortOrder = typeof cat.sort_order === 'number' ? cat.sort_order : 999
    }

    const description = (row.description as string | null) ?? ''
    const lines = featureLinesFromMetadata(meta)
    const currency = (row.currency as string | null) ?? 'GBP'
    const priceCents = Number(row.price_cents) || 0

    return {
      catalogSlug: slugForSessionType(st),
      title: st.title,
      description,
      featureLines: lines,
      durationMinutes: st.duration_minutes,
      priceLabel: formatPriceLabel(priceCents, currency),
      categorySlug,
      categorySortOrder,
    }
  })

  items.sort((a, b) => {
    if (a.categorySortOrder !== b.categorySortOrder) return a.categorySortOrder - b.categorySortOrder
    return a.title.localeCompare(b.title)
  })

  return items
}
