'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prefersReducedMotion } from '@/lib/prefers-reduced-motion'

const SHOW_AFTER_PX = 380

export function LandingBackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    window.scrollTo({ top: 0, behavior })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [])

  if (!visible) return null

  return (
    <div className="fixed right-4 z-[45] md:bottom-8 md:right-6 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))]">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={scrollToTop}
        className="h-12 w-12 rounded-full border border-border/80 bg-card/95 shadow-lg backdrop-blur-md hover:bg-card"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" aria-hidden />
      </Button>
    </div>
  )
}
