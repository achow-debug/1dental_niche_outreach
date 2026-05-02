'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { DashboardBookTreatment } from '@/lib/dashboard/load-dashboard-book-catalog-server'
import { resolveBookTreatment } from '@/lib/dashboard/resolve-book-treatment'

type Props = {
  initialCatalog: DashboardBookTreatment[]
}

export function BookTreatmentPickerClient({ initialCatalog }: Props) {
  const params = useSearchParams()
  const initialSlug = params.get('treatment')
  const [query, setQuery] = useState('')

  const resolved = useMemo(
    () => resolveBookTreatment(initialSlug, initialCatalog),
    [initialSlug, initialCatalog],
  )

  const [pickedSlug, setPickedSlug] = useState<string | null>(null)
  const effectiveSlug =
    pickedSlug ?? resolved?.catalogSlug ?? (initialCatalog[0] ? initialCatalog[0].catalogSlug : '')

  const filteredTreatments = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return initialCatalog
    return initialCatalog.filter((item) =>
      `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(value),
    )
  }, [query, initialCatalog])

  const selectedTreatment = useMemo(
    () => initialCatalog.find((t) => t.catalogSlug === effectiveSlug) ?? resolved,
    [initialCatalog, effectiveSlug, resolved],
  )

  if (!initialCatalog.length) {
    return (
      <div className="space-y-5 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Book a treatment</CardTitle>
            <CardDescription>No treatments are available to book online yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Please call the practice or check back soon — the team is updating the schedule.</p>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Book a treatment</CardTitle>
          <CardDescription>Step 1 of 3 - choose treatment before selecting time slots.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search treatment type"
              className="pl-9"
            />
          </div>
          <div className="grid gap-3">
            {filteredTreatments.map((treatment) => {
              const active = treatment.catalogSlug === effectiveSlug
              return (
                <button
                  key={treatment.sessionTypeId}
                  type="button"
                  onClick={() => setPickedSlug(treatment.catalogSlug)}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-150 ${
                    active
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:-translate-y-0.5 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{treatment.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{treatment.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {treatment.durationMinutes} min • {treatment.priceLabel}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={active ? 'default' : 'outline'}>{treatment.category}</Badge>
                      {treatment.badge ? <Badge variant="secondary">{treatment.badge}</Badge> : null}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Selected:{' '}
            <span className="font-medium text-foreground">
              {selectedTreatment ? selectedTreatment.name : 'None'}
            </span>
          </div>
          <Button asChild variant="cta" className="h-11 w-full sm:w-auto" disabled={!selectedTreatment}>
            <Link
              href={
                selectedTreatment
                  ? `/dashboard/book/calendar?treatment=${encodeURIComponent(selectedTreatment.catalogSlug)}`
                  : '#'
              }
              aria-disabled={!selectedTreatment}
            >
              Choose date and time
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
