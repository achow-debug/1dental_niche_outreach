import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { loadDashboardBookCatalogServer } from '@/lib/dashboard/load-dashboard-book-catalog-server'
import { resolveBookTreatment } from '@/lib/dashboard/resolve-book-treatment'
import { BookCalendarClient } from '@/app/dashboard/book/calendar/book-calendar-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function DashboardCalendarPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {}
  const treatmentParam = typeof sp.treatment === 'string' ? sp.treatment : undefined

  const supabase = await createClient()
  const catalog = await loadDashboardBookCatalogServer(supabase)
  const treatment = resolveBookTreatment(treatmentParam, catalog)

  if (!catalog.length || !treatment) {
    return (
      <div className="space-y-5 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Choose date and time</CardTitle>
            <CardDescription>We could not load treatments or this link is invalid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="cta">
              <Link href="/dashboard/book">Back to book a treatment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <BookCalendarClient treatment={treatment} />
}
