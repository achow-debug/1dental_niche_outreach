import { describe, expect, it } from 'vitest'
import {
  buildGlobalBookingsEmptyState,
  buildNoVisitsTodayEmptyState,
  buildNoVisitsTodayReminder,
  buildTabBookingsEmptyState,
} from '@/lib/dashboard/bookings-empty-state'
import type { UserBooking } from '@/lib/dashboard/user-bookings'

function atLondon(isoDate: string, hour: number, minute = 0): string {
  const d = new Date(`${isoDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+01:00`)
  return d.toISOString()
}

describe('buildGlobalBookingsEmptyState', () => {
  it('returns book CTA', () => {
    const m = buildGlobalBookingsEmptyState()
    expect(m.primaryCta.href).toBe('/dashboard/book')
    expect(m.headline.length).toBeGreaterThan(0)
  })
})

describe('buildTabBookingsEmptyState', () => {
  it('shows history secondary when no upcoming but has history', () => {
    const bookings: UserBooking[] = [
      {
        id: '1',
        treatmentName: 'Hygiene',
        treatmentId: 'hygiene-maintenance',
        startsAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'completed',
      },
    ]
    const m = buildTabBookingsEmptyState(bookings, 'upcoming')
    expect(m.secondaryCta?.onClickAction).toBe('history')
  })
})

describe('no visits today', () => {
  it('returns null when an upcoming visit is today (London)', () => {
    const now = new Date('2026-05-02T12:00:00+01:00')
    const bookings: UserBooking[] = [
      {
        id: '1',
        treatmentName: 'Check',
        treatmentId: 'new-patient-exam',
        startsAt: atLondon('2026-05-02', 15, 0),
        status: 'confirmed',
      },
    ]
    expect(buildNoVisitsTodayReminder(bookings, now)).toBeNull()
    expect(buildNoVisitsTodayEmptyState(bookings, now)).toBeNull()
  })

  it('returns reminder and empty model when next visit is tomorrow', () => {
    const now = new Date('2026-05-02T12:00:00+01:00')
    const bookings: UserBooking[] = [
      {
        id: '1',
        treatmentName: 'Hygiene',
        treatmentId: 'hygiene-maintenance',
        startsAt: atLondon('2026-05-03', 10, 30),
        status: 'confirmed',
      },
    ]
    const line = buildNoVisitsTodayReminder(bookings, now)
    expect(line).toContain('tomorrow')

    const mod = buildNoVisitsTodayEmptyState(bookings, now)
    expect(mod?.headline).toBe('No visits today')
    expect(mod?.body).toContain('Hygiene')
    expect(mod?.primaryCta.href).toBe('/dashboard/book')
    expect(mod?.secondaryCta?.onClickAction).toBe('upcoming')
  })
})
