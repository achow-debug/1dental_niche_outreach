'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BookingLeadCalendlyModal } from '@/components/booking-lead-calendly-modal'
import type { CalendlyEmbedRuntimeConfig } from '@/lib/calendly/embed-config'

type Props = {
  calendlyEmbed: CalendlyEmbedRuntimeConfig
}

export function BookACallStandalone({ calendlyEmbed }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      router.push('/')
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background pb-16 pt-28 outline-none md:pt-32"
    >
      <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Book a call
        </h1>
        <p className="mt-3 text-muted-foreground">
          A short questionnaire opens first, then the Calendly scheduler. Close the window to return
          home.
        </p>
      </div>
      <BookingLeadCalendlyModal open={open} onOpenChange={handleOpenChange} calendly={calendlyEmbed} />
    </main>
  )
}
