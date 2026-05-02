import type { SessionTypeRow } from '@/lib/dashboard/catalog-slug'
import { resolveSessionTypeForSlug } from '@/lib/dashboard/catalog-slug'
import type { DashboardBookTreatment } from '@/lib/dashboard/load-dashboard-book-catalog-server'

export function sessionTypeRowsFromCatalog(catalog: DashboardBookTreatment[]): SessionTypeRow[] {
  return catalog.map((t) => ({
    id: t.sessionTypeId,
    title: t.name,
    duration_minutes: t.durationMinutes,
    price_cents: 0,
    max_slots: 1,
    metadata: null,
  }))
}

export function resolveBookTreatment(
  treatmentParam: string | null | undefined,
  catalog: DashboardBookTreatment[],
): DashboardBookTreatment | null {
  if (!catalog.length) return null
  const trimmed = treatmentParam?.trim()
  if (!trimmed) return catalog[0]
  const direct = catalog.find((t) => t.catalogSlug === trimmed || t.sessionTypeId === trimmed)
  if (direct) return direct
  const rows = sessionTypeRowsFromCatalog(catalog)
  const resolved = resolveSessionTypeForSlug(trimmed, rows)
  if (!resolved) return catalog[0]
  return catalog.find((t) => t.sessionTypeId === resolved.id) ?? catalog[0]
}
