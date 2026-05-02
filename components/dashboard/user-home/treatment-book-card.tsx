import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type TreatmentPreviewItem = {
  catalogSlug: string
  name: string
  durationMinutes: number
  priceLabel: string
  badge?: string
}

type Props = {
  rebookHref: string
  primaryCtaLabel: string
  previewTreatments: TreatmentPreviewItem[]
}

export function TreatmentBookCard({ rebookHref, primaryCtaLabel, previewTreatments }: Props) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="size-5 text-primary" />
          Treatments
        </CardTitle>
        <CardDescription>
          Choose from popular options — full catalogue on the booking hub. {primaryCtaLabel} below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewTreatments.length > 0 ? (
          <div className="grid gap-3">
            {previewTreatments.map((treatment) => (
              <Link
                key={treatment.catalogSlug}
                href={`/dashboard/book?treatment=${encodeURIComponent(treatment.catalogSlug)}`}
                className="group rounded-xl border border-border bg-background/70 p-4 motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{treatment.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {treatment.durationMinutes} min • {treatment.priceLabel}
                    </p>
                  </div>
                  {treatment.badge ? (
                    <Badge variant="outline" className="shrink-0">
                      {treatment.badge}
                    </Badge>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Browse all treatments on the booking page.</p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="cta" className="h-11 flex-1">
            <Link href="/dashboard/book">
              {primaryCtaLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1 motion-safe:transition-transform motion-safe:active:scale-[0.98]">
            <Link href={rebookHref}>Rebook last treatment</Link>
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/dashboard/book" className="font-medium text-primary hover:underline">
            View all treatments
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
