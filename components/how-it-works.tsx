"use client"

import { Button } from "@/components/ui/button"
import { CalendarDays, Stethoscope, CheckCircle2 } from "lucide-react"

interface HowItWorksProps {
  onBookClick: () => void
}

const steps = [
  {
    icon: CalendarDays,
    step: "01",
    title: "Book your appointment",
    description: "Choose a time that works for you using our simple online booking. Select your treatment type and preferred date."
  },
  {
    icon: Stethoscope,
    step: "02",
    title: "Visit the clinic",
    description: "Arrive at our calm, modern clinic. We&apos;ll discuss your concerns, carry out your examination or treatment, and answer any questions."
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Leave with clarity",
    description: "You&apos;ll leave with a clear understanding of your next steps, any follow-up care needed, and confidence in your dental health."
  },
]

export function HowItWorks({ onBookClick }: HowItWorksProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            How booking works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps from booking to a healthier smile.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-accent flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <span className="inline-block text-xs font-semibold text-primary mb-2">
                  Step {step.step}
                </span>
                <h3 className="font-semibold text-foreground text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={onBookClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 font-medium"
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </section>
  )
}
