"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BackgroundVideo } from "@/components/background-video"
import { Shield, Clock, Heart, Sparkles, Award } from "lucide-react"

interface HeroProps {
  onBookClick: () => void
  onLearnMoreClick: () => void
}

const trustItems = [
  { icon: Shield, label: "12+ Years Experience" },
  { icon: Heart, label: "Nervous patients" },
  { icon: Clock, label: "Same-week bookings" },
  { icon: Award, label: "Bespoke Care" },
]

export function Hero({ onBookClick, onLearnMoreClick }: HeroProps) {
  const [scrollY, setScrollY] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setPrefersReducedMotion(mq.matches)
    updateMotion()
    mq.addEventListener("change", updateMotion)
    return () => mq.removeEventListener("change", updateMotion)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setScrollY(window.scrollY)
      })
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const parallax = (factor: number) =>
    prefersReducedMotion ? 0 : scrollY * factor

  return (
    <section className="relative pt-32 pb-0 md:pt-48 md:pb-0 overflow-hidden hero-glow-bg">
      {/* Ambient Sensory Video Background */}
      <BackgroundVideo />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div 
            className="text-center lg:text-left relative z-10 transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateY(${parallax(0.1)}px)` }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-widest uppercase text-primary">
                Private dental care in Manchester
              </span>
            </div>
            
            <h1 className="text-editorial text-5xl md:text-6xl lg:text-8xl font-bold text-foreground mb-8 animate-fade-in-up animation-delay-100">
              Gentle care <br className="hidden md:block" />
              <span className="text-primary">for your smile.</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              At Carter Dental Studio, we believe visiting the dentist should feel as comfortable as it is effective. Modern clinical excellence designed around you.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center animate-fade-in-up animation-delay-300">
              <Button 
                onClick={onBookClick}
                variant="cta"
                className="magnetic-btn h-16 px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105"
              >
                Book a visit
              </Button>
              <button 
                type="button"
                onClick={onLearnMoreClick}
                className="group flex items-center gap-2 rounded-sm text-sm font-bold text-muted-foreground uppercase tracking-widest transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Learn why patients choose us
                <div className="w-8 h-px bg-muted-foreground transition-all group-hover:w-12 group-hover:bg-primary" />
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div 
            className="relative lg:order-last animate-fade-in-up animation-delay-400 transition-transform duration-500 ease-out"
            style={{ transform: `translateY(${parallax(-0.05)}px)` }}
          >
            <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden bg-muted shadow-2xl rotate-1 md:rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/images/clinic-interior.jpg"
                alt="Modern, bright Carter Dental Studio interior with contemporary equipment and calming atmosphere"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover scale-110 hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem] md:rounded-[4rem]" />
            </div>
            
            {/* Floating card */}
            <div 
              className="absolute -bottom-8 -left-8 glass-surface rounded-3xl shadow-2xl p-6 border-none hidden md:block animate-blob transition-transform duration-300 ease-out"
              style={{ transform: `translateY(${parallax(-0.15)}px)` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Heart className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg leading-tight tracking-tight">500+ Patients</p>
                  <p className="text-sm font-medium text-muted-foreground">Trusting our gentle care</p>
                </div>
              </div>
            </div>
            
            {/* Soft decorative shape behind image */}
            <div 
              className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-transform duration-700 ease-out" 
              style={{
                transform: prefersReducedMotion ? undefined : `scale(${1 + scrollY * 0.001})`,
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Trust Band below Hero */}
      <div className="mt-24 md:mt-32 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/50 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm tracking-tight">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
