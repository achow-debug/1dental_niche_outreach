'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardSlot, SlotGroup } from '@/lib/dashboard/booking'
import type { DashboardBookTreatment } from '@/lib/dashboard/load-dashboard-book-catalog-server'

const INITIAL_GROUP_LIMIT = 3
const TZ = 'Europe/London'

function getGroupLabel(group: SlotGroup) {
  if (group === 'morning') return 'Morning'
  if (group === 'afternoon') return 'Afternoon'
  return 'Evening'
}

function calendarDayKey(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

function slotDayKey(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
}

function formatDay(value: Date) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(
    value,
  )
}

function formatShortDateTime(value: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value)
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value)
}

type Props = {
  treatment: DashboardBookTreatment
}

export function BookCalendarClient({ treatment }: Props) {
  const [slots, setSlots] = useState<DashboardSlot[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSlots = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(
        `/api/dashboard/available-slots?treatment=${encodeURIComponent(treatment.catalogSlug)}`,
        { cache: 'no-store' },
      )
      const data = (await res.json().catch(() => ({}))) as { error?: string; slots?: DashboardSlot[] }
      if (!res.ok) {
        setLoadError(data?.error ?? 'Could not load availability.')
        setSlots([])
        return
      }
      setSlots(data.slots ?? [])
    } catch {
      setLoadError('Could not load availability.')
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [treatment.catalogSlug])

  useEffect(() => {
    void loadSlots()
  }, [loadSlots])

  const defaultDate = useMemo(() => {
    const first = slots[0]
    return first ? new Date(first.startsAt) : undefined
  }, [slots])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [showAllByGroup, setShowAllByGroup] = useState<Record<SlotGroup, boolean>>({
    morning: false,
    afternoon: false,
    evening: false,
  })

  useEffect(() => {
    if (!selectedDate && defaultDate) {
      setSelectedDate(defaultDate)
    }
  }, [defaultDate, selectedDate])

  const selectedDayKey = selectedDate ? calendarDayKey(selectedDate) : ''
  const daySlots = slots.filter((slot) => slotDayKey(slot.startsAt) === selectedDayKey)
  const grouped = {
    morning: daySlots.filter((slot) => slot.group === 'morning'),
    afternoon: daySlots.filter((slot) => slot.group === 'afternoon'),
    evening: daySlots.filter((slot) => slot.group === 'evening'),
  }

  const allAvailableDates = useMemo(() => {
    const keys = new Set(slots.map((s) => slotDayKey(s.startsAt)))
    return [...keys].map((k) => {
      const [y, m, d] = k.split('-').map(Number)
      return new Date(y, m - 1, d)
    })
  }, [slots])

  const soonestSlotId = useMemo(() => {
    if (daySlots.length === 0) return null
    const now = Date.now()
    const future = daySlots.filter((s) => new Date(s.startsAt).getTime() >= now)
    const pool = future.length ? future : daySlots
    const sorted = [...pool].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    return sorted[0]?.id ?? null
  }, [daySlots])

  const selectedSlot = daySlots.find((slot) => slot.id === selectedSlotId) ?? null
  const confirmHref = selectedSlot
    ? `/dashboard/book/confirm?treatment=${encodeURIComponent(treatment.catalogSlug)}&sessionId=${encodeURIComponent(selectedSlot.id)}&startsAt=${encodeURIComponent(selectedSlot.startsAt)}`
    : '#'

  return (
    <div className="space-y-5 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Choose date and time</CardTitle>
          <CardDescription>Step 2 of 3 - {treatment.name}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[auto_1fr]">
          {loadError ? (
            <p className="text-sm text-destructive lg:col-span-2">{loadError}</p>
          ) : null}
          {loading ? (
            <p className="text-sm text-muted-foreground lg:col-span-2">Loading available times…</p>
          ) : slots.length === 0 ? (
            <div className="space-y-3 lg:col-span-2">
              <p className="text-sm text-muted-foreground">
                There are no bookable slots for this treatment in the current schedule. Try another treatment or check
                back later.
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => void loadSlots()}>
                Retry
              </Button>
            </div>
          ) : null}

          {!loading && slots.length > 0 ? (
            <>
              <div className="rounded-xl border border-border">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setSelectedSlotId('')
                  }}
                  modifiers={{ available: allAvailableDates }}
                  modifiersClassNames={{ available: 'bg-primary/10 text-foreground font-semibold' }}
                  disabled={(date) => !allAvailableDates.some((item) => calendarDayKey(item) === calendarDayKey(date))}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Available slots</p>
                  <p className="font-medium text-foreground">
                    {selectedDate ? formatDay(selectedDate) : 'Select a date'}
                  </p>
                  {soonestSlotId ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      The next available time is highlighted on each day.
                    </p>
                  ) : null}
                </div>

                {daySlots.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    No times on this date. Pick another highlighted date.
                  </p>
                ) : (
                  (Object.keys(grouped) as SlotGroup[]).map((group) => {
                    const list = grouped[group]
                    if (list.length === 0) return null
                    const expanded = showAllByGroup[group]
                    const visible = expanded ? list : list.slice(0, INITIAL_GROUP_LIMIT)
                    return (
                      <section key={group} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{getGroupLabel(group)}</p>
                          {list.length > INITIAL_GROUP_LIMIT ? (
                            <button
                              type="button"
                              onClick={() => setShowAllByGroup((prev) => ({ ...prev, [group]: !prev[group] }))}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              {expanded ? 'Show fewer' : `Show ${list.length - INITIAL_GROUP_LIMIT} more`}
                            </button>
                          ) : null}
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {visible.map((slot) => {
                            const active = slot.id === selectedSlotId
                            const soonest = slot.id === soonestSlotId
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`relative flex min-h-[2.75rem] flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-2 text-sm font-medium motion-safe:transition-all ${
                                  active
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : soonest
                                      ? 'border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/25 motion-safe:hover:-translate-y-0.5'
                                      : 'border-border bg-card motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/40'
                                }`}
                              >
                                {soonest && !active ? (
                                  <Badge
                                    variant="secondary"
                                    className="absolute -top-2 left-1/2 h-4 -translate-x-1/2 px-1 text-[9px] font-semibold uppercase leading-none text-primary"
                                  >
                                    Soonest
                                  </Badge>
                                ) : null}
                                <span>{formatTime(new Date(slot.startsAt))}</span>
                              </button>
                            )
                          })}
                        </div>
                      </section>
                    )
                  })
                )}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedSlot
              ? `Selected ${formatShortDateTime(new Date(selectedSlot.startsAt))}`
              : 'Select a time slot'}
          </p>
          <Button asChild variant="cta" className="h-11 w-full sm:w-auto" disabled={!selectedSlot}>
            <Link href={confirmHref}>
              Continue to confirm
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
