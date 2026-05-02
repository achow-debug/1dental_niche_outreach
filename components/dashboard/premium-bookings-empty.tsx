'use client'

import Link from 'next/link'
import { CalendarHeart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookingsEmptyStateModel } from '@/lib/dashboard/bookings-empty-state'

type Variant = 'full' | 'compact'

type Props = {
  variant?: Variant
  model: BookingsEmptyStateModel
  onSecondary?: (action: 'history' | 'upcoming') => void
}

export function PremiumBookingsEmpty({ variant = 'full', model, onSecondary }: Props) {
  const isCompact = variant === 'compact'
  return (
    <div
      className={
        isCompact
          ? 'relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-muted/40 via-background to-primary/[0.04] p-6 text-center shadow-sm'
          : 'relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-muted/50 via-background to-primary/[0.06] p-8 text-center shadow-sm sm:p-10'
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] motion-reduce:opacity-0"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 45%),
            radial-gradient(circle at 80% 80%, hsl(var(--primary)) 0%, transparent 40%)`,
        }}
      />
      <div className={`relative mx-auto max-w-md space-y-4 ${isCompact ? '' : 'sm:space-y-5'}`}>
        <div
          className={`mx-auto flex items-center justify-center rounded-2xl bg-primary/10 text-primary ${
            isCompact ? 'size-12' : 'size-14 sm:size-16'
          }`}
        >
          <CalendarHeart className={isCompact ? 'size-6' : 'size-7 sm:size-8'} aria-hidden />
        </div>
        {isCompact ? (
          <p className="font-semibold tracking-tight text-foreground text-balance text-base">{model.headline}</p>
        ) : (
          <h2 className="text-lg font-semibold tracking-tight text-foreground text-balance sm:text-xl">{model.headline}</h2>
        )}
        <p className={`text-muted-foreground leading-relaxed text-pretty ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
          {model.body}
        </p>
        <div className={`flex flex-col gap-2 ${isCompact ? '' : 'sm:flex-row sm:justify-center'} pt-1`}>
          <Button asChild variant="cta" className={`h-11 w-full sm:w-auto ${isCompact ? 'min-h-11' : ''}`}>
            <Link href={model.primaryCta.href}>{model.primaryCta.label}</Link>
          </Button>
          {model.secondaryCta && onSecondary ? (
            <Button
              type="button"
              variant="outline"
              className={`h-11 w-full sm:w-auto ${isCompact ? 'min-h-11' : ''}`}
              onClick={() => onSecondary(model.secondaryCta!.onClickAction)}
            >
              {model.secondaryCta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
