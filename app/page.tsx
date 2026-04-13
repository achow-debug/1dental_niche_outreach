"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TrustBar } from "@/components/trust-bar"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Treatments } from "@/components/treatments"
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

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleBookClick = () => {
    setIsBookingOpen(true)
  }

  return (
    <main className="min-h-screen">
      <Header onBookClick={handleBookClick} />
      <Hero onBookClick={handleBookClick} />
      <TrustBar />
      <WhyChooseUs />
      <Treatments onBookClick={handleBookClick} />
      <NervousPatients onBookClick={handleBookClick} />
      <PricingSection onBookClick={handleBookClick} />
      <SocialProof />
      <HowItWorks onBookClick={handleBookClick} />
      <MeetDentist />
      <FAQSection />
      <FinalCTA onBookClick={handleBookClick} />
      <Footer onBookClick={handleBookClick} />
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
      
      {/* Mobile Sticky CTA */}
      <MobilestickyCTA onBookClick={handleBookClick} />
      
      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
