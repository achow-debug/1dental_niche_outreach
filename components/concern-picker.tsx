'use client'

import { Check } from 'lucide-react'
import { MagneticCTAButton } from '@/components/ui/magnetic-cta-button'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'
import { trackEvent } from '@/lib/analytics'

const CONCERNS = [
  { id: 'booking-link', label: "Patients say they can't find your booking link" },
  { id: 'no-conversion', label: "You're chasing leads that never convert" },
  { id: 'dated-mobile', label: 'Your site looks dated on mobile' },
  { id: 'unknown-issues', label: "You don't know what's broken" },
] as const

type Props = {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

export function ConcernPicker({ onOpenSchedulingModal }: Props) {
  const handleSelect = (concernId: string, concernLabel: string) => {
    trackEvent('concern_selected', { concernId, concernLabel })
    onOpenSchedulingModal('website_audit')
  }

  return (
    <section
      aria-labelledby="concern-picker-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Sound familiar?
          </span>
          <h2
            id="concern-picker-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            What’s costing your practice patients right now?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground">
            Pick the one that hurts the most — we’ll line up an audit that fixes it first.
          </p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {CONCERNS.map((concern) => (
            <li key={concern.id}>
              <button
                type="button"
                onClick={() => handleSelect(concern.id, concern.label)}
                className="group flex h-full w-full items-start justify-between gap-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 text-left shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0"
              >
                <span className="text-base font-semibold leading-snug text-foreground sm:text-[17px]">
                  {concern.label}
                </span>
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Check className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <MagneticCTAButton
            type="button"
            onClick={() => onOpenSchedulingModal('website_audit')}
            variant="cta"
            className="h-12 px-8 text-sm font-semibold"
          >
            Book Website Audit
          </MagneticCTAButton>
        </div>
      </div>
    </section>
  )
}
