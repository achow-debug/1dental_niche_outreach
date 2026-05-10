import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Unsubscribed | Carter Dental Studio',
  description: 'Your email preferences have been updated successfully.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UnsubscribedPage() {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-lg font-bold text-primary">C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none tracking-tight text-foreground">
              Carter Dental
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Studio • Manchester
            </span>
          </div>
        </div>

        <section
          aria-labelledby="unsubscribed-heading"
          className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Preferences updated</p>
          <h1
            id="unsubscribed-heading"
            className="mt-3 text-editorial text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            You are unsubscribed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            You will no longer receive marketing emails from Carter Dental Studio. If this was accidental,
            you can request a demo to reconnect with our team.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="cta" className="h-12 px-8">
              <Link href="/book-a-call?intent=demo">Request demo</Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 text-muted-foreground">
              <Link href="/">Return to homepage</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
