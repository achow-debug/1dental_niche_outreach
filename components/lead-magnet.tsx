"use client"

import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export function LeadMagnet() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-surface rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-24 border-none shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold tracking-widest uppercase text-primary">
                  Free Patient Resource
                </span>
              </div>
              
              <h2 className="text-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                New to Carter Dental? <br />
                <span className="text-primary">Download our guide.</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
                We've created a comprehensive guide to help you understand what to expect, our approach to care, and how we help nervous patients feel at ease.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "What happens at your first visit",
                  "Understanding our treatment approach",
                  "Pricing and membership benefits",
                  "Tips for your most comfortable appointment"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 font-bold shadow-lg shadow-primary/20"
                >
                  Get the Free Guide
                  <ArrowRight className="ml-2 w-4 h-4 opacity-70" />
                </Button>
                <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start">
                  Instant Access • No Pressure • Helpful Advice
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/clinic-interior.jpg" 
                  alt="Carter Dental Studio Patient Information Guide"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Overlay text mockup */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full h-full border-2 border-white/30 rounded-2xl flex flex-col justify-end p-6 bg-gradient-to-t from-primary/80 to-transparent backdrop-blur-[2px]">
                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">Patient Resource</span>
                    <h3 className="text-white text-2xl font-bold mb-2">The Calm Dentistry Guide</h3>
                    <p className="text-white/80 text-xs">Everything you need to know before your first visit.</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
