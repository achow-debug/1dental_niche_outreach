'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { Quote, Star } from 'lucide-react'
import { MagneticCTAButton } from '@/components/ui/magnetic-cta-button'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

type Props = {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

const REVIEWS = [
  {
    quote:
      'Bookings jumped 38% in the first month after Carter Dental rebuilt our homepage. The audit pointed at exactly the friction we’d been missing.',
    name: 'Dr Priya Anand',
    practice: 'Anand Family Dental, Leeds',
  },
  {
    quote:
      'I was sceptical about a “website audit”, but the report was specific and the redesign paid for itself by week two.',
    name: 'Dr Marcus Webb',
    practice: 'Northgate Dental Studio, Edinburgh',
  },
] as const

export function ProofSlider({ onOpenSchedulingModal }: Props) {
  return (
    <section
      id="proof"
      aria-labelledby="proof-slider-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Before / After
          </span>
          <h2
            id="proof-slider-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            See what an audit actually changes.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground">
            Drag the slider to compare a real clinic’s old site with the rebuild our audit kicked off.
          </p>
        </div>

        <div className="relative mt-10 aspect-[3/2] w-full overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl backdrop-blur-md">
          <ReactCompareSlider
            className="h-full w-full select-none"
            style={{ height: '100%', width: '100%' }}
            itemOne={
              <ReactCompareSliderImage
                src="/audit-before.svg"
                alt="Old, dated dental practice website with cluttered navigation and outdated typography."
                width={1200}
                height={800}
                loading="eager"
                style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src="/audit-after.svg"
                alt="Modern dental practice website with glass navigation, a clear hero CTA and three benefit cards."
                width={1200}
                height={800}
                loading="eager"
                style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
              />
            }
            defaultPosition={50}
            handle={
              <div
                aria-label="Drag to compare"
                className="flex h-full w-1 items-center justify-center bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-lg">
                  <span aria-hidden="true" className="text-sm font-bold">⇆</span>
                </span>
              </div>
            }
          />
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {REVIEWS.map((review) => (
            <li
              key={review.name}
              className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center gap-1 text-primary" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <Quote className="mt-3 h-5 w-5 text-primary/60" aria-hidden="true" />
              <p className="mt-2 text-pretty text-base leading-relaxed text-foreground">{review.quote}</p>
              <p className="mt-4 text-sm font-semibold text-foreground">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.practice}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
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
