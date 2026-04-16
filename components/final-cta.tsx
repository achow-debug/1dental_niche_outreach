"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

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
    <section className="section-padding relative overflow-hidden cta-glow-bg">
      {/* Decorative background mesh */}
      <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-8">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Start Your Journey</span>
        </div>
        
        <h2 className="text-editorial text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-8">
          Ready to experience <br />
          <span className="text-primary italic">calm dental care?</span>
        </h2>
        
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Take the first step toward a healthier, more confident smile. Book your appointment online in just 2 minutes.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center gap-3 p-4 rounded-3xl glass-surface border-none shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground tracking-tight">{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="inline-flex flex-col items-center gap-6">
          <Button 
            onClick={onBookClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-16 h-20 text-xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
          >
            Book My Appointment
            <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Next available: This Thursday
          </div>
        </div>
      </div>
      
      {/* Soft decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />
    </section>
  )
}
