'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { loadCalendlyScript } from '@/lib/calendly/load-script'
import type { CalendlyPrefill } from '@/lib/calendly/calendly-types'
import { cn } from '@/lib/utils'

type Props = {
  embedUrl: string
  prefill?: CalendlyPrefill
  className?: string
  children: React.ReactNode
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
}

/**
 * Opens Calendly’s native popup overlay after loading `widget.js` (lazy on first click).
 */
export function CalendlyPopupButton({
  embedUrl,
  prefill,
  className,
  children,
  variant = 'outline',
  size = 'default',
}: Props) {
  const [busy, setBusy] = useState(false)

  const handleClick = () => {
    void (async () => {
      setBusy(true)
      try {
        await loadCalendlyScript()
        window.Calendly?.initPopupWidget({
          url: embedUrl,
          ...(prefill && Object.keys(prefill).length > 0 ? { prefill } : {}),
        })
      } finally {
        setBusy(false)
      }
    })()
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={busy}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
