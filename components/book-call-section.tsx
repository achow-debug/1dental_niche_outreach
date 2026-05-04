'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

type Props = {
  onOpenSchedulingModal: () => void
}

export function BookCallSection({ onOpenSchedulingModal }: Props) {
  return (
    <section
      id="book-call"
      className="section-padding relative border-y border-surface-border bg-muted/30"
      aria-labelledby="book-call-heading"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">
          Book a call
        </p>
        <h2
          id="book-call-heading"
          className="text-editorial text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          Request a demo or website audit
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
          Answer a few quick questions, then pick a time in Calendly — all in one modal. Prefer a
          dedicated page? Use the link below.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Button type="button" variant="outline" className="h-12 px-8" onClick={onOpenSchedulingModal}>
            Request demo
          </Button>
          <Button type="button" variant="cta" className="h-12 px-8" onClick={onOpenSchedulingModal}>
            Book website audit
          </Button>
          <Button variant="ghost" className="h-12 text-muted-foreground underline-offset-4 hover:underline" asChild>
            <Link href="/book-a-call">Open full-page scheduler</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
