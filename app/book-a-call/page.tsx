import type { Metadata } from 'next'

import { BookACallStandalone } from '@/components/book-a-call-standalone'
import { getCalendlyEmbedRuntimeConfig } from '@/lib/calendly/embed-config'

export const metadata: Metadata = {
  title: 'Book a call | Carter Dental Studio',
  description:
    'Schedule a call with Carter Dental Studio. Answer a few questions, then choose a time in our secure Calendly flow.',
}

export default function BookACallPage() {
  const calendlyEmbed = getCalendlyEmbedRuntimeConfig()
  return <BookACallStandalone calendlyEmbed={calendlyEmbed} />
}
