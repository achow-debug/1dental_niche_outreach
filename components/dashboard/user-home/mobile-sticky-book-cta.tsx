'use client'

import Link from 'next/link'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  primaryCtaLabel: string
}

export function MobileStickyBookCta({ primaryCtaLabel }: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[24] md:hidden">
      <div className="pointer-events-auto border-t border-border/80 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2 pr-12">
          <Button asChild variant="cta" className="h-12 min-h-12 flex-1 gap-2 text-base shadow-sm">
            <Link href="/dashboard/book">
              <CalendarPlus className="size-5 shrink-0" />
              <span className="truncate">{primaryCtaLabel}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
