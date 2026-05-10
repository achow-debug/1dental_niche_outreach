'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BookingLeadModal } from '@/components/booking-lead-modal'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

type Props = {
  intent?: LeadSchedulingIntent
}

export function BookACallStandalone({ intent = 'demo' }: Props) {
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
          Fill in one quick form and we’ll send your audit or demo details to your email. Close the
          window to return home.
        </p>
      </div>
      <BookingLeadModal open={open} onOpenChange={handleOpenChange} intent={intent} />
    </main>
  )
}
