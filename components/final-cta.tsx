"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface FinalCTAProps {
  onBookClick: () => void
}

const benefits = [
  "Simple online booking",
  "Same-week availability",
  "Nervous patients welcome",
  "Clear, honest advice",
]

export function FinalCTA({ onBookClick }: FinalCTAProps) {
  return (
    <section className="py-20 md:py-28 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight text-balance">
          Ready to book your appointment?
        </h2>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Take the first step toward calm, confident dental care. 
          Book your appointment online and we&apos;ll take it from there.
        </p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-10">
          <Button 
            onClick={onBookClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Book Appointment
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground">
          No commitment required. Just a simple first step.
        </p>
      </div>
    </section>
  )
}
