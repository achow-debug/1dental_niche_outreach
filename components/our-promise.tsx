"use client"

import Image from "next/image"
import { Sparkles } from "lucide-react"

export function OurPromise() {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative group">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/dr-carter-portrait.jpg"
                alt="Dr. Amelia Carter, Lead Dentist at Carter Dental Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
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
            <h2 className="text-editorial text-3xl md:text-5xl font-bold mb-8 leading-[1.1]">
              My promise to you: <br />
              <span className="text-primary">Clinical excellence, <br className="hidden md:block" /> without the clinical feel.</span>
            </h2>
            
            <div
              className="handwritten-note rounded-[2rem] p-8 md:p-10 mb-12 border border-primary/10 shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.99 0.01 90 / 0.95) 0%, oklch(0.98 0.02 90 / 0.98) 100%)",
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-4">A note from Amelia</p>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-serif italic">
                <p>
                  &ldquo;I founded Carter Dental Studio because I believe seeking care should never feel like something to
                  endure. Too many people avoid the dentist because the last experience felt cold, rushed, or
                  intimidating.&rdquo;
                </p>
                <p>
                  &ldquo;My promise is simple: we listen more than we talk. We never judge where your smile is starting
                  from. And we deliver gentle, modern dentistry in a space that feels more like a lounge than a
                  clinic.&rdquo;
                </p>
              </div>
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
