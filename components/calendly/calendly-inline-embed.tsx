'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { loadCalendlyScript } from '@/lib/calendly/load-script'
import type { CalendlyPrefill } from '@/lib/calendly/calendly-types'
import { cn } from '@/lib/utils'

type Props = {
  embedUrl: string
  publicFallbackUrl: string
  prefill?: CalendlyPrefill
  className?: string
  minHeightClassName?: string
  /** When false, hide the secondary “new tab” line (e.g. compact modal). */
  showFooterLinks?: boolean
}

export function CalendlyInlineEmbed({
  embedUrl,
  publicFallbackUrl,
  prefill,
  className,
  minHeightClassName = 'min-h-[700px]',
  showFooterLinks = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const prefillKey = useMemo(() => JSON.stringify(prefill ?? {}), [prefill])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !embedUrl) return undefined

    let cancelled = false
    setError(null)
    el.innerHTML = ''

    void (async () => {
      try {
        await loadCalendlyScript()
        if (cancelled || !containerRef.current) return
        window.Calendly?.initInlineWidget({
          url: embedUrl,
          parentElement: containerRef.current,
          ...(prefill && Object.keys(prefill).length > 0 ? { prefill } : {}),
        })
      } catch {
        if (!cancelled) setError('The booking calendar could not load.')
      }
    })()

    return () => {
      cancelled = true
      el.innerHTML = ''
    }
  }, [embedUrl, prefillKey])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        ref={containerRef}
        className={cn(
          'w-full overflow-hidden rounded-2xl border border-border bg-card',
          minHeightClassName,
        )}
        aria-live="polite"
      />
      {error ? (
        <div className="rounded-2xl border border-border bg-muted/40 px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="cta" className="mt-4" asChild>
            <Link href={publicFallbackUrl} target="_blank" rel="noopener noreferrer">
              Open booking in a new tab
            </Link>
          </Button>
        </div>
      ) : null}
      {showFooterLinks ? (
        <p className="text-center text-xs text-muted-foreground">
          Prefer a new window?{' '}
          <Link
            href={publicFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open Calendly in a new tab
          </Link>
        </p>
      ) : null}
    </div>
  )
}
