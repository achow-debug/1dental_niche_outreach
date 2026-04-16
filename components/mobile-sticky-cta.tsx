"use client"

import { Button } from "@/components/ui/button"

interface MobileStickyCTAProps {
  onBookClick: () => void
}

export function MobilestickyCTA({ onBookClick }: MobileStickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border p-4 safe-area-pb">
      <Button 
        onClick={onBookClick}
        variant="cta"
        className="h-12 w-full font-medium shadow-lg"
      >
        Book a visit
      </Button>
    </div>
  )
}
