"use client"

import { useEffect, useRef, useState } from "react"
import { MagneticCTAButton } from "@/components/ui/magnetic-cta-button"
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion"
import type { LeadSchedulingIntent } from "@/lib/leads/lead-questions"

interface MobileStickyCTAProps {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

const HIDE_THRESHOLD = 24

export function MobilestickyCTA({ onOpenSchedulingModal }: MobileStickyCTAProps) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion()
    lastY.current = typeof window !== "undefined" ? window.scrollY : 0

    let rafId: number | null = null

    const onScroll = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        const current = window.scrollY
        const delta = current - lastY.current

        if (current < 80) {
          setHidden(false)
        } else if (delta > HIDE_THRESHOLD) {
          setHidden(true)
        } else if (delta < -HIDE_THRESHOLD) {
          setHidden(false)
        }
        lastY.current = current
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const transitionClass = reducedMotionRef.current ? "" : "transition-transform duration-300 ease-out"
  const translateClass = hidden && !reducedMotionRef.current ? "translate-y-[120%]" : "translate-y-0"

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--glass-bg)] md:hidden ${transitionClass} ${translateClass}`}
      style={{
        paddingTop: '0.75rem',
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
      }}
      aria-hidden={hidden && !reducedMotionRef.current ? true : undefined}
    >
      <MagneticCTAButton
        type="button"
        onClick={() => onOpenSchedulingModal("website_audit")}
        variant="cta"
        className="h-12 w-full text-sm font-semibold shadow-lg shadow-primary/20"
      >
        Get my free website audit
      </MagneticCTAButton>
    </div>
  )
}
