"use client"

import Image from "next/image"
import { Sparkles, Signature } from "lucide-react"

export function OurPromise() {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/dr-carter-portrait.jpg"
                alt="Dr. Amelia Carter, Lead Dentist at Carter Dental Studio"
                fill
                className="object-cover hover:scale-105 transition-transform duration-1000"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=1000"
                }}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-8 -right-8 glass-surface p-6 rounded-2xl shadow-xl z-20 reveal-on-scroll">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                     <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lead Dentist</p>
                    <p className="font-bold text-lg">Dr. Amelia Carter</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="relative">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-8 inline-block">
              A Personal Commitment
            </span>
            <h2 className="text-editorial text-4xl md:text-5xl font-bold mb-8 leading-[1.1]">
              My promise to you: <br />
              <span className="text-primary">Clinical excellence, <br className="hidden md:block" /> without the clinical feel.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-8 mb-12">
              <p>
                "I founded Carter Dental Studio because I believe that seeking healthcare should never be a source of stress. Too many people avoid the dentist because of past experiences that felt cold, rushed, or intimidating."
              </p>
              <p>
                "My promise is simple: we will listen more than we talk. We will never judge the state of your smile. And we will provide the most gentle, state-of-the-art care in an environment that feels more like a lounge than a clinic."
              </p>
            </div>

            <div className="flex flex-col gap-4">
               <div className="h-px w-full bg-border/50" />
               <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Dr. Amelia Carter</p>
                    <p className="text-xs text-muted-foreground">BDS (Hons), MSc Cosmetic Dentistry</p>
                  </div>
                  <div className="text-primary/40 scale-150 -rotate-3 select-none pointer-events-none">
                    <span className="font-serif text-3xl italic">A. Carter</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
