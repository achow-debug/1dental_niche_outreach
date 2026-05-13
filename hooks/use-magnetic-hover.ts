'use client'

import { useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/prefers-reduced-motion'

type MagneticOptions = {
  /** Maximum pull distance in pixels (default 6). */
  strength?: number
}

/**
 * Magnetic pointer pull for primary CTAs (Task 15).
 * Disabled automatically when the user prefers reduced motion or on touch-primary devices.
 */
export function useMagneticHover<T extends HTMLElement = HTMLButtonElement>(
  options: MagneticOptions = {},
) {
  const { strength = 6 } = options
  const ref = useRef<T | null>(null)
  const frame = useRef<number | null>(null)

  const reset = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.removeProperty('--magnetic-x')
    el.style.removeProperty('--magnetic-y')
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (prefersReducedMotion()) return
    if (window.matchMedia?.('(hover: none)').matches) return

    const handleMove = (event: PointerEvent) => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        const rect = el.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        const radius = Math.max(rect.width, rect.height) / 2
        const normX = Math.max(-1, Math.min(1, dx / radius))
        const normY = Math.max(-1, Math.min(1, dy / radius))
        el.style.setProperty('--magnetic-x', `${normX * strength}px`)
        el.style.setProperty('--magnetic-y', `${normY * strength}px`)
      })
    }

    const handleLeave = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
      el.style.removeProperty('--magnetic-x')
      el.style.removeProperty('--magnetic-y')
    }

    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerleave', handleLeave)
    el.addEventListener('pointerdown', handleLeave)
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      el.removeEventListener('pointermove', handleMove)
      el.removeEventListener('pointerleave', handleLeave)
      el.removeEventListener('pointerdown', handleLeave)
    }
  }, [strength])

  return { ref, reset }
}
