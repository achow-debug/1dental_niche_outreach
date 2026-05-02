"use client"

import { Button } from "@/components/ui/button"
import { CalendarDays, Stethoscope, CheckCircle2, ArrowRight } from "lucide-react"

interface HowItWorksProps {
  onBookClick: () => void
}

const steps = [
  {
    icon: CalendarDays,
    title: "Book your appointment",
    description: "Choose a time that works for you using our simple online booking. No pressure, just a clear path to care."
  },
  {
    icon: Stethoscope,
    title: "Visit the clinic",
    description: "Arrive at our calm, modern studio. We'll discuss your concerns and carry out a gentle assessment."
  },
  {
    icon: CheckCircle2,
    title: "Leave with clarity",
    description: "You'll leave with a clear understanding of your options and a personalised plan for your smile."
  },
]

export function HowItWorks({ onBookClick }: HowItWorksProps) {
  return (
    <section
      id="process"
      className="section-padding scroll-mt-28 md:scroll-mt-32 bg-secondary/30 relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Simple Process</span>
          </div>
          <h2 className="text-editorial text-3xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6">
            Everything is <br />
            <span className="text-primary italic">transparent & easy.</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
            From the moment you book until the moment you leave, we ensure you feel in control.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start relative pb-6 md:pb-8">
          {/* Desktop connecting lines */}
          <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-px bg-primary/20 -z-10" />
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="w-28 h-28 rounded-3xl bg-background border border-border shadow-sm flex items-center justify-center mb-8 group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-500 relative">
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                  {index + 1}
                </div>
                <step.icon className="w-12 h-12 text-primary" />
              </div>
              
              <h3 className="text-editorial text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="mt-8 lg:hidden">
                  <ArrowRight className="w-6 h-6 text-primary/30 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-10 md:mt-14 text-center animate-fade-in-up animation-delay-500">
          <Button 
            onClick={onBookClick}
            variant="cta"
            className="h-16 px-12 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105"
          >
            Book Appointment
          </Button>
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            Takes less than 2 minutes • Instant confirmation
          </p>
        </div>
      </div>
    </section>
  )
}
