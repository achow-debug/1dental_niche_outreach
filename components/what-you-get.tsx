'use client'

import { Gauge, LineChart, Smartphone } from 'lucide-react'
import { MagneticCTAButton } from '@/components/ui/magnetic-cta-button'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

type Props = {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

const CARDS = [
  {
    icon: Gauge,
    title: 'Speed audit',
    benefit: 'Find the slow pages before patients bounce.',
    price: 'From £149',
  },
  {
    icon: LineChart,
    title: 'Lead-flow audit',
    benefit: 'Stop losing enquiries at the booking step.',
    price: 'From £199',
  },
  {
    icon: Smartphone,
    title: 'Mobile UX audit',
    benefit: 'Make every tap feel premium and obvious.',
    price: 'From £249',
  },
] as const

export function WhatYouGet({ onOpenSchedulingModal }: Props) {
  return (
    <section
      id="pricing"
      aria-labelledby="what-you-get-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            What you get
          </span>
          <h2
            id="what-you-get-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Three focused audits. One clear next step.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground">
            We zero in on the one thing that’s costing you patients today — then hand you a roadmap to fix it.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, benefit, price }) => (
            <li
              key={title}
              className="group flex h-full flex-col rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{benefit}</p>
              <p className="mt-auto pt-6 text-sm font-semibold text-primary">{price}</p>
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
