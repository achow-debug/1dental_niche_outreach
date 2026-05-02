export type SlotGroup = 'morning' | 'afternoon' | 'evening'

export type DashboardSlot = {
  id: string
  /** Catalog slug for deep links (same as `treatment` query). */
  treatmentCatalogSlug: string
  startsAt: string
  group: SlotGroup
}

const PRACTICE_TZ = 'Europe/London'

export function slotTimeGroup(startsAtIso: string, timeZone = PRACTICE_TZ): SlotGroup {
  const d = new Date(startsAtIso)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(d)
  const hourPart = parts.find((p) => p.type === 'hour')
  const hour = hourPart ? parseInt(hourPart.value, 10) : d.getUTCHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export function mapSessionRowsToDashboardSlots(
  rows: { id: string; starts_at: string }[],
  treatmentCatalogSlug: string,
): DashboardSlot[] {
  return rows
    .map((r) => ({
      id: r.id,
      treatmentCatalogSlug,
      startsAt: r.starts_at,
      group: slotTimeGroup(r.starts_at),
    }))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}
