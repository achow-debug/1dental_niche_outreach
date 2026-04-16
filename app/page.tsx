"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AuthorityBand } from "@/components/authority-band"
import { SmileQuiz } from "@/components/smile-quiz"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Treatments } from "@/components/treatments"
import { TreatmentGallery } from "@/components/treatment-gallery"
import { ComfortMenu } from "@/components/comfort-menu"
import { OurPromise } from "@/components/our-promise"
import { NervousPatients } from "@/components/nervous-patients"
import { SocialProof } from "@/components/social-proof"
import { HowItWorks } from "@/components/how-it-works"
import { MeetDentist } from "@/components/meet-dentist"
import { FAQSection } from "@/components/faq-section"
import { PricingSection } from "@/components/pricing-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { MobilestickyCTA } from "@/components/mobile-sticky-cta"

import { ScrollReveal } from "@/components/scroll-reveal"

import { SuitabilityChecker } from "@/components/suitability-checker"

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleBookClick = () => {
    setIsBookingOpen(true)
  }

  const handleLearnMoreClick = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header onBookClick={handleBookClick} />
      
      {/* 1. Hero Experience (Sensory) */}
      <Hero onBookClick={handleBookClick} onLearnMoreClick={handleLearnMoreClick} />
      
      {/* 2. Authority Band */}
      <ScrollReveal>
        <AuthorityBand />
      </ScrollReveal>
      
      {/* 3. Interactive Conversion (Smile Quiz) */}
      <ScrollReveal className="section-padding">
        <SmileQuiz onBookClick={handleBookClick} />
      </ScrollReveal>
      
      {/* 4. Brand Foundation */}
      <ScrollReveal>
        <WhyChooseUs />
      </ScrollReveal>
      
      {/* 5. Sensory & Medical Credibility (Before & After) */}
      <ScrollReveal>
        <TreatmentGallery />
      </ScrollReveal>
      
      {/* 6. Clinical Excellence */}
      <ScrollReveal>
        <Treatments onBookClick={handleBookClick} />
      </ScrollReveal>

      <ScrollReveal>
        <SuitabilityChecker onBookClick={handleBookClick} />
      </ScrollReveal>
      
      <ScrollReveal>
        <PricingSection onBookClick={handleBookClick} />
      </ScrollReveal>
      
      {/* 7. Practice Experience (Comfort Menu) */}
      <ScrollReveal>
        <ComfortMenu />
      </ScrollReveal>
      
      {/* 8. The Patient Journey */}
      <ScrollReveal>
        <HowItWorks onBookClick={handleBookClick} />
      </ScrollReveal>
      
      {/* 9. Interactive Authority & Proof */}
      <ScrollReveal>
        <SocialProof />
      </ScrollReveal>
      
      {/* 10. Personal Touch (Our Promise) */}
      <ScrollReveal>
        <OurPromise />
      </ScrollReveal>
      
      <ScrollReveal>
        <MeetDentist />
      </ScrollReveal>
      
      {/* 11. Emotional Safety */}
      <ScrollReveal>
        <NervousPatients onBookClick={handleBookClick} />
      </ScrollReveal>
      
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>
      
      {/* 12. Final Experience Hook */}
      <ScrollReveal>
        <FinalCTA onBookClick={handleBookClick} />
      </ScrollReveal>
      
      <Footer onBookClick={handleBookClick} />
      
      {/* Utility: Overlays & Sticky */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onSuccess={() => setIsBookingOpen(false)}
      />
      
      <MobilestickyCTA onBookClick={handleBookClick} />
      
      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-24 md:hidden" aria-hidden="true" />
    </main>
  )
}
