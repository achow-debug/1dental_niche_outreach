"use client"

import { useState, useEffect, useRef, type CSSProperties } from "react"
import { MagneticCTAButton } from "@/components/ui/magnetic-cta-button"
import { BackgroundVideo } from "@/components/background-video"
import type { LeadSchedulingIntent } from "@/lib/leads/lead-questions"

interface HeroProps {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
  onLearnMoreClick: () => void
}

const HEADLINE = "Your dental site is costing you patients."
const SUBLINE =
  "Request a free audit of your clinic site — we show you exactly why you are losing patients and how to fix it."
const TRUST = "Trusted by 40+ UK private practices"

export function Hero({ onOpenSchedulingModal, onLearnMoreClick }: HeroProps) {
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

  const words = HEADLINE.split(" ")

  return (
    <section className="relative overflow-hidden hero-glow-bg pb-12 pt-28 sm:pt-32 md:pt-40 md:pb-20">
      <BackgroundVideo />

      <div
        className="relative z-10 mx-auto max-w-3xl px-5 text-center transition-transform duration-300 ease-out motion-reduce:transition-none sm:px-6"
        style={{ transform: `translateY(${parallax(0.06)}px)` }}
      >
        <h1 className="text-editorial text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="word-blur"
              style={{ "--word-delay": `${index * 40}ms` } as CSSProperties}
            >
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {SUBLINE}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticCTAButton
            type="button"
            onClick={() => onOpenSchedulingModal("website_audit")}
            variant="cta"
            className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl"
          >
            Get my free website audit
          </MagneticCTAButton>
          <button
            type="button"
            onClick={onLearnMoreClick}
            className="group flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            See how it works
            <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
          {TRUST}
        </p>
      </div>
    </section>
  )
}
