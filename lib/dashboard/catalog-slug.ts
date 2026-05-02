/** Maps dashboard URL slugs to keywords matched against `session_types.title` (case-insensitive). */
export const CATALOG_SLUG_KEYWORDS: Record<string, string[]> = {
  'hygiene-maintenance': ['hygiene', 'scaling', 'polish', 'cleaning'],
  'new-patient-exam': ['new patient', 'first visit', 'examination'],
  'teeth-whitening-consult': ['whiten', 'whitening'],
  'aligner-consult': ['aligner', 'invisalign', 'clear aligner'],
}

export type SessionTypeRow = {
  id: string
  title: string
  duration_minutes: number
  price_cents: number
  max_slots: number
  metadata?: Record<string, unknown> | null
}

export function slugForSessionType(row: SessionTypeRow): string {
  const meta = row.metadata as { dashboard_slug?: string } | null | undefined
  if (meta?.dashboard_slug && typeof meta.dashboard_slug === 'string') {
    return meta.dashboard_slug
  }
  const t = row.title.toLowerCase()
  for (const [slug, kws] of Object.entries(CATALOG_SLUG_KEYWORDS)) {
    if (kws.some((k) => t.includes(k))) return slug
  }
  return row.id
}

export function resolveSessionTypeForSlug(slug: string, rows: SessionTypeRow[]): SessionTypeRow | null {
  if (!rows.length) return null
  const trimmed = slug.trim()
  if (!trimmed) return null
  if (rows.some((r) => r.id === trimmed)) {
    return rows.find((r) => r.id === trimmed) ?? null
  }
  const kws = CATALOG_SLUG_KEYWORDS[trimmed]
  if (kws) {
    for (const row of rows) {
      const t = row.title.toLowerCase()
      if (kws.some((k) => t.includes(k))) return row
    }
  }
  return rows.find((r) => slugForSessionType(r) === trimmed) ?? null
}
