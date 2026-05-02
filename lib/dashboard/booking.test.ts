import { describe, expect, it } from 'vitest'
import { mapSessionRowsToDashboardSlots, slotTimeGroup } from '@/lib/dashboard/booking'

describe('slotTimeGroup', () => {
  it('classifies morning in Europe/London', () => {
    expect(slotTimeGroup('2026-06-01T08:30:00.000Z')).toBe('morning')
  })

  it('classifies afternoon', () => {
    expect(slotTimeGroup('2026-06-01T14:00:00.000Z')).toBe('afternoon')
  })

  it('classifies evening', () => {
    expect(slotTimeGroup('2026-06-01T18:00:00.000Z')).toBe('evening')
  })
})

describe('mapSessionRowsToDashboardSlots', () => {
  it('maps ids and sorts by time', () => {
    const slots = mapSessionRowsToDashboardSlots(
      [
        { id: 'b', starts_at: '2026-06-02T16:00:00.000Z' },
        { id: 'a', starts_at: '2026-06-02T09:00:00.000Z' },
      ],
      'hygiene-maintenance',
    )
    expect(slots.map((s) => s.id)).toEqual(['a', 'b'])
    expect(slots[0].treatmentCatalogSlug).toBe('hygiene-maintenance')
  })
})
