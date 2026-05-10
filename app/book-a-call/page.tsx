import type { Metadata } from 'next'

import { BookACallStandalone } from '@/components/book-a-call-standalone'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

export const metadata: Metadata = {
  title: 'Book a call | Carter Dental Studio',
  description:
    'Request a website audit or demo from Carter Dental Studio. Quick form — we send details to your email.',
}

type BookACallPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function BookACallPage({ searchParams }: BookACallPageProps) {
  const sp = await (searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>))
  const raw = sp.intent
  const intentParam = Array.isArray(raw) ? raw[0] : raw
  const intent: LeadSchedulingIntent = intentParam === 'audit' ? 'website_audit' : 'demo'
  return <BookACallStandalone intent={intent} />
}
