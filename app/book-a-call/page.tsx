import type { Metadata } from 'next'

import { BookACallStandalone } from '@/components/book-a-call-standalone'
import { getCalendlyEmbedRuntimeConfig } from '@/lib/calendly/embed-config'
import type { LeadSchedulingIntent } from '@/lib/calendly/lead-questions'

export const metadata: Metadata = {
  title: 'Book a call | Carter Dental Studio',
  description:
    'Schedule a call with Carter Dental Studio. Answer a few questions, then choose a time in our secure Calendly flow.',
}

type BookACallPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function BookACallPage({ searchParams }: BookACallPageProps) {
  const calendlyEmbed = getCalendlyEmbedRuntimeConfig()
  const sp = await (searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>))
  const raw = sp.intent
  const intentParam = Array.isArray(raw) ? raw[0] : raw
  const intent: LeadSchedulingIntent = intentParam === 'audit' ? 'website_audit' : 'demo'
  return <BookACallStandalone calendlyEmbed={calendlyEmbed} intent={intent} />
}
