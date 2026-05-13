'use client'

import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MagneticCTAButton } from '@/components/ui/magnetic-cta-button'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'
import { trackEvent } from '@/lib/analytics'

const SUGGESTIONS = [
  { id: 'mobile-speed', label: 'Slow on mobile' },
  { id: 'low-bookings', label: 'Low bookings' },
  { id: 'google-ranking', label: 'Bad on Google' },
] as const

type Props = {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

export function LandingQuickFind({ onOpenSchedulingModal }: Props) {
  const [value, setValue] = useState('')

  const openAudit = (concernId: string, concernLabel: string) => {
    trackEvent('quick_find_intent_selected', { concernId, concernLabel })
    onOpenSchedulingModal('website_audit')
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    openAudit('free-text', value.trim() || 'unspecified')
  }

  return (
    <section aria-labelledby="quick-find-heading" className="px-4 pt-6 sm:px-6 md:pt-10">
      <div className="mx-auto max-w-3xl">
        <h2
          id="quick-find-heading"
          className="text-center text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Not sure where to start? Try this <span aria-hidden="true">→</span>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="quick-find-shimmer quick-find-glow relative mt-4 overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--glass-bg)]"
        >
          <label htmlFor="quick-find-input" className="sr-only">
            Tell me what you’d like to fix
          </label>
          <div className="relative flex items-center gap-2">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="quick-find-input"
              type="text"
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Tell me what you'd like to fix…"
              className="h-14 w-full rounded-2xl border-0 bg-transparent pl-12 pr-32 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-16 md:text-lg"
            />
            <MagneticCTAButton
              type="submit"
              variant="cta"
              className="absolute right-2 hidden h-12 px-5 text-sm font-semibold sm:inline-flex md:h-14"
            >
              Book Website Audit
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </MagneticCTAButton>
          </div>
          <div className="block px-1 pt-3 sm:hidden">
            <Button type="submit" variant="cta" className="h-12 w-full text-sm font-semibold">
              Book Website Audit
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>

        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onClick={() => openAudit(suggestion.id, suggestion.label)}
                className="inline-flex min-h-[36px] items-center rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground/90 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
