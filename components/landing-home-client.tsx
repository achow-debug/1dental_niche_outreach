'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/prefers-reduced-motion'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { LandingQuickFind } from '@/components/landing-quick-find'
import { FAQSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { LandingBackToTop } from '@/components/landing-back-to-top'
import { MobilestickyCTA } from '@/components/mobile-sticky-cta'
import { ScrollReveal } from '@/components/scroll-reveal'
import type { LandingCatalogItem } from '@/lib/landing/load-public-catalog'
import type { LandingBookClickHandler, LeadSchedulingContext } from '@/lib/landing/book-cta'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

// Below-fold + interactive surfaces — keep them off the critical path for LCP (Task 17).
const ConcernPicker = dynamic(
  () => import('@/components/concern-picker').then((m) => m.ConcernPicker),
  { ssr: false },
)
const ProofSlider = dynamic(
  () => import('@/components/proof-slider').then((m) => m.ProofSlider),
  { ssr: false },
)
const WhatYouGet = dynamic(
  () => import('@/components/what-you-get').then((m) => m.WhatYouGet),
  { ssr: false },
)
const DemoOutcomes = dynamic(
  () => import('@/components/demo-outcomes').then((m) => m.DemoOutcomes),
  { ssr: false },
)
const BookingLeadModal = dynamic(
  () => import('@/components/booking-lead-modal').then((m) => m.BookingLeadModal),
  { ssr: false },
)
const LoginModal = dynamic(
  () => import('@/components/auth/login-modal').then((m) => m.LoginModal),
  { ssr: false },
)

type Props = {
  isLoggedIn: boolean
  catalogItems: LandingCatalogItem[]
  initialSchedulingOpen?: boolean
  initialSchedulingIntent?: LeadSchedulingIntent
}

function bookDestinationPath(treatmentSlug?: string): string {
  if (treatmentSlug) {
    return `/dashboard/book?treatment=${encodeURIComponent(treatmentSlug)}`
  }
  return '/dashboard/book'
}

export function LandingHomeClient({
  isLoggedIn,
  catalogItems: _catalogItems,
  initialSchedulingOpen = false,
  initialSchedulingIntent = 'website_audit',
}: Props) {
  const router = useRouter()
  const [schedulingOpen, setSchedulingOpen] = useState(initialSchedulingOpen)
  const [schedulingIntent, setSchedulingIntent] =
    useState<LeadSchedulingIntent>(initialSchedulingIntent)
  const [schedulingContext, setSchedulingContext] = useState<LeadSchedulingContext | undefined>(
    undefined,
  )

  const handleBookClick = useCallback<LandingBookClickHandler>(
    (treatmentSlug) => {
      const path = bookDestinationPath(treatmentSlug)
      if (isLoggedIn) {
        router.push(path)
        return
      }
      router.push(`/login?redirect=${encodeURIComponent(path)}`)
    },
    [isLoggedIn, router],
  )

  const handleLearnMoreClick = () => {
    const section = document.getElementById('proof')
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    section?.scrollIntoView({ behavior })
  }

  const openSchedulingModal = useCallback(
    (intent: LeadSchedulingIntent, context?: LeadSchedulingContext) => {
      setSchedulingIntent(intent)
      setSchedulingContext(context)
      setSchedulingOpen(true)
    },
    [],
  )

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-[1] min-h-screen bg-background text-foreground outline-none selection:bg-primary/20"
    >
      <Header onBookClick={handleBookClick} onOpenSchedulingModal={openSchedulingModal} />

      <Hero onOpenSchedulingModal={openSchedulingModal} onLearnMoreClick={handleLearnMoreClick} />

      <LandingQuickFind onOpenSchedulingModal={openSchedulingModal} />

      <ScrollReveal>
        <ConcernPicker onOpenSchedulingModal={openSchedulingModal} />
      </ScrollReveal>

      <ScrollReveal>
        <ProofSlider onOpenSchedulingModal={openSchedulingModal} />
      </ScrollReveal>

      <ScrollReveal>
        <WhatYouGet onOpenSchedulingModal={openSchedulingModal} />
      </ScrollReveal>

      <ScrollReveal>
        <DemoOutcomes />
      </ScrollReveal>

      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      <Footer onBookClick={handleBookClick} onOpenSchedulingModal={openSchedulingModal} />

      <MobilestickyCTA onOpenSchedulingModal={openSchedulingModal} />

      <LandingBackToTop />

      <div className="h-14 md:hidden" aria-hidden="true" />

      <BookingLeadModal
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        intent={schedulingIntent}
        context={schedulingContext}
      />

      <LoginModal />
    </main>
  )
}
