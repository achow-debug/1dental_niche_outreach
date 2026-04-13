"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnimatedGradientMesh } from "@/components/animated-gradient-mesh"
import { Shield, Clock, Heart, Sparkles } from "lucide-react"

interface HeroProps {
  onBookClick: () => void
  onLearnMoreClick: () => void
}

const trustPoints = [
  { icon: Shield, text: "12+ years experience" },
  { icon: Heart, text: "Nervous patients welcome" },
  { icon: Clock, text: "Same-week appointments" },
]

export function Hero({ onBookClick, onLearnMoreClick }: HeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Animated gradient mesh background */}
      <AnimatedGradientMesh />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Private dental care in Manchester
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight text-balance">
              Dental care that feels calm, modern, and easy to book
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              At Carter Dental Studio, we believe visiting the dentist should feel comfortable and straightforward. 
              Modern private care designed around you.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button 
                onClick={onBookClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-base font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Appointment
              </Button>
              <button 
                onClick={onLearnMoreClick}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
              >
                Learn why patients choose us
              </button>
            </div>
            
            {/* Trust Points */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
              {trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <point.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{point.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div className="relative lg:order-last">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-2xl">
              <Image
                src="/images/clinic-interior.jpg"
                alt="Modern, bright Carter Dental Studio interior with contemporary equipment and calming atmosphere"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-4 border border-border hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">500+ patients</p>
                  <p className="text-xs text-muted-foreground">trust our care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
