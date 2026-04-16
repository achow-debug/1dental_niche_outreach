"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles } from "lucide-react"

interface PricingSectionProps {
  onBookClick: () => void
}

const standardPricing = [
  { service: "New Patient Examination", price: "£95" },
  { service: "Routine Check-up", price: "£65" },
  { service: "Hygiene Appointment", price: "£85" },
  { service: "Emergency Appointment", price: "£120" },
  { service: "Teeth Whitening", price: "from £350" },
  { service: "Cosmetic Consultation", price: "£75" },
]

const membershipBenefits = [
  "Two hygiene appointments per year",
  "One comprehensive examination per year",
  "10% discount on all treatments",
  "Priority booking for appointments",
  "Emergency appointments included",
  "No joining fee",
]

const promises = [
  {
    title: "Clear pricing, always",
    description: "You&apos;ll know the cost before any treatment begins. No hidden fees, no surprises."
  },
  {
    title: "Honest recommendations",
    description: "We only recommend what you genuinely need, not unnecessary treatments."
  },
  {
    title: "Your comfort comes first",
    description: "If you&apos;re not comfortable, we pause. Your pace, not ours."
  },
]

export function PricingSection({ onBookClick }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Transparent pricing, quality care
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We believe in clear, upfront pricing so you can make informed decisions about your dental care.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Standard Pricing */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Treatment pricing
            </h3>
            <div className="space-y-4">
              {standardPricing.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-border last:border-0"
                >
                  <span className="text-foreground">{item.service}</span>
                  <span className="font-semibold text-foreground">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Full treatment menu available at your appointment. All prices include consultation.
            </p>
          </div>

          {/* Membership Plan */}
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                <Sparkles className="w-3 h-3" />
                Popular choice
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Care Plan Membership
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-semibold text-foreground">£25</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              {membershipBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              onClick={onBookClick}
              variant="cta"
              className="h-12 w-full font-medium"
            >
              Book Appointment
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Ask about membership at your first visit. No commitment required.
            </p>
          </div>
        </div>

        {/* Patient Promises */}
        <div className="bg-card rounded-3xl p-8 md:p-10 border border-border">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            Our promise to you
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {promises.map((promise, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {promise.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
