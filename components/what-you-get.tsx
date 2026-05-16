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
    title: 'Faster mobile experience',
    benefit:
      'Patients on phones get a site that loads quickly and feels modern on your clinic site — fewer bounces before they book.',
  },
  {
    icon: LineChart,
    title: 'Clear booking path',
    benefit:
      'One obvious route from your homepage to enquiry or online booking — no hunting for your phone number.',
  },
  {
    icon: Smartphone,
    title: 'Trust at first glance',
    benefit:
      'Credentials, reviews, and team photos where new patients expect them — so they choose your clinic with confidence.',
  },
] as const

export function WhatYouGet({ onOpenSchedulingModal }: Props) {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            What we build for your clinic
          </span>
          <h2
            id="capabilities-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Features that turn visitors into booked patients
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground">
            Every clinic site is different — these are the upgrades we implement most often on private
            practice websites like yours.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, benefit }) => (
            <li
              key={title}
              className="group flex h-full flex-col rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{benefit}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground">
          Your first website audit is free — tell us your URL in the form.
        </p>

        <div className="mt-10 flex justify-center">
          <MagneticCTAButton
            type="button"
            onClick={() => onOpenSchedulingModal('website_audit')}
            variant="cta"
            className="h-12 px-8 text-sm font-semibold"
          >
            Request your free audit
          </MagneticCTAButton>
        </div>
      </div>
    </section>
  )
}
