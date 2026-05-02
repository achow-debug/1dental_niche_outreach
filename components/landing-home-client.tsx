'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/prefers-reduced-motion'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { LandingQuickFind } from '@/components/landing-quick-find'
import { AuthorityBand } from '@/components/authority-band'
import { SmileQuiz } from '@/components/smile-quiz'
import { WhyChooseUs } from '@/components/why-choose-us'
import { Treatments } from '@/components/treatments'
import { TreatmentGallery } from '@/components/treatment-gallery'
import { ComfortMenu } from '@/components/comfort-menu'
import { OurPromise } from '@/components/our-promise'
import { NervousPatients } from '@/components/nervous-patients'
import { SocialProof } from '@/components/social-proof'
import { HowItWorks } from '@/components/how-it-works'
import { MeetDentist } from '@/components/meet-dentist'
import { FAQSection } from '@/components/faq-section'
import { PricingSection } from '@/components/pricing-section'
import { FinalCTA } from '@/components/final-cta'
import { Footer } from '@/components/footer'
import { LandingBackToTop } from '@/components/landing-back-to-top'
import { MobilestickyCTA } from '@/components/mobile-sticky-cta'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SuitabilityChecker } from '@/components/suitability-checker'
import type { LandingCatalogItem } from '@/lib/landing/load-public-catalog'
import type { LandingBookClickHandler } from '@/lib/landing/book-cta'

type Props = {
  isLoggedIn: boolean
  catalogItems: LandingCatalogItem[]
}

function bookDestinationPath(treatmentSlug?: string): string {
  if (treatmentSlug) {
    return `/dashboard/book?treatment=${encodeURIComponent(treatmentSlug)}`
  }
  return '/dashboard/book'
}

export function LandingHomeClient({ isLoggedIn, catalogItems }: Props) {
  const router = useRouter()

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
    const section = document.getElementById('why-us')
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    section?.scrollIntoView({ behavior })
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-[1] min-h-screen bg-background text-foreground outline-none selection:bg-primary/20"
    >
      <Header onBookClick={handleBookClick} />

      <Hero onBookClick={handleBookClick} onLearnMoreClick={handleLearnMoreClick} />

      <LandingQuickFind />

      <ScrollReveal>
        <AuthorityBand />
      </ScrollReveal>

      <ScrollReveal className="py-8 md:py-12">
        <SmileQuiz onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <WhyChooseUs />
      </ScrollReveal>

      <ScrollReveal>
        <TreatmentGallery />
      </ScrollReveal>

      <ScrollReveal>
        <Treatments catalogItems={catalogItems} onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <SuitabilityChecker onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <PricingSection onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <ComfortMenu />
      </ScrollReveal>

      <ScrollReveal>
        <HowItWorks onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <SocialProof />
      </ScrollReveal>

      <ScrollReveal>
        <OurPromise />
      </ScrollReveal>

      <ScrollReveal>
        <MeetDentist />
      </ScrollReveal>

      <ScrollReveal>
        <NervousPatients onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal>
        <FinalCTA onBookClick={handleBookClick} />
      </ScrollReveal>

      <Footer onBookClick={handleBookClick} />

      <MobilestickyCTA onBookClick={handleBookClick} />

      <LandingBackToTop />

      <div className="h-14 md:hidden" aria-hidden="true" />
    </main>
  )
}
