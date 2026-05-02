import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmBookingButton } from '@/app/dashboard/book/confirm/confirm-booking-button'
import { loadDashboardBookCatalogServer } from '@/lib/dashboard/load-dashboard-book-catalog-server'
import { resolveBookTreatment } from '@/lib/dashboard/resolve-book-treatment'

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

type ConfirmPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function DashboardBookConfirmPage({ searchParams }: ConfirmPageProps) {
  const resolved = (await searchParams) ?? {}
  const treatmentSlug = typeof resolved.treatment === 'string' ? resolved.treatment : null
  const sessionId = typeof resolved.sessionId === 'string' ? resolved.sessionId : null
  const startsAtRaw = typeof resolved.startsAt === 'string' ? resolved.startsAt : null

  const supabase = await createClient()
  const catalog = await loadDashboardBookCatalogServer(supabase)
  const treatment = resolveBookTreatment(treatmentSlug, catalog)

  if (!treatment) {
    return (
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Confirm booking</CardTitle>
            <CardDescription>Treatment could not be resolved.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard/book">Start over</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasSlot = Boolean(sessionId) || Boolean(startsAtRaw && !Number.isNaN(new Date(startsAtRaw).getTime()))

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Confirm booking</CardTitle>
          <CardDescription>Step 3 of 3 - review before submitting request.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground">Treatment</p>
            <p className="font-medium text-foreground">{treatment.name}</p>
            <p className="text-xs text-muted-foreground">
              {treatment.durationMinutes} min • {treatment.priceLabel}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground">Time</p>
            <p className="font-medium text-foreground">
              {startsAtRaw && !Number.isNaN(new Date(startsAtRaw).getTime())
                ? formatDateTime(startsAtRaw)
                : sessionId
                  ? 'Selected slot'
                  : 'No time selected yet'}
            </p>
            {!hasSlot ? (
              <Link
                href={`/dashboard/book/calendar?treatment=${encodeURIComponent(treatment.catalogSlug)}`}
                className="mt-2 inline-flex text-xs text-primary hover:underline"
              >
                Choose a date and time first
              </Link>
            ) : null}
          </div>

          <div className="rounded-xl border border-dashed border-border p-4">
            <p className="text-muted-foreground">What happens next</p>
            <p className="mt-1 text-foreground">Your booking request is sent to the team for final confirmation.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Badge variant="outline">Saved to your account after confirm</Badge>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/dashboard/book/calendar?treatment=${encodeURIComponent(treatment.catalogSlug)}`}>
                  Change slot
                </Link>
              </Button>
              <ConfirmBookingButton
                catalogSlug={treatment.catalogSlug}
                sessionId={sessionId}
                startsAt={startsAtRaw ?? ''}
                disabled={!hasSlot}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
