'use client'

import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { MagneticCTAButton } from '@/components/ui/magnetic-cta-button'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'
import type { LeadSchedulingContext } from '@/lib/landing/book-cta'
import { trackEvent } from '@/lib/analytics'

type Props = {
  onOpenSchedulingModal: (
    intent: LeadSchedulingIntent,
    context?: LeadSchedulingContext,
  ) => void
}

export function LandingQuickFind({ onOpenSchedulingModal }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const bottleneck = value.trim()
    trackEvent('quick_find_intent_selected', {
      bottleneck: bottleneck.slice(0, 200) || 'unspecified',
    })
    onOpenSchedulingModal('website_audit', bottleneck ? { bottleneck } : undefined)
  }

  return (
    <section aria-labelledby="quick-find-heading" className="px-4 pt-6 sm:px-6 md:pt-10">
      <div className="mx-auto max-w-3xl">
        <h2
          id="quick-find-heading"
          className="text-center text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Let us help you get started
        </h2>

        <form
          onSubmit={handleSubmit}
          className="quick-find-shimmer quick-find-glow relative mt-4 overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--glass-bg)]"
        >
          <label htmlFor="quick-find-input" className="sr-only">
            Describe your biggest website bottleneck
          </label>
          <div className="relative flex items-center gap-2">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="quick-find-input"
              type="text"
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="e.g. sales team waste time chasing"
              className="h-14 w-full rounded-2xl border-0 bg-transparent pl-12 pr-16 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-16 md:pr-20 md:text-lg"
            />
            <MagneticCTAButton
              type="submit"
              variant="cta"
              aria-label="Get my free audit"
              className="absolute right-2 inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-0 md:h-12 md:w-12"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </MagneticCTAButton>
          </div>
        </form>
      </div>
    </section>
  )
}
