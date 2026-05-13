'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useMagneticHover } from '@/hooks/use-magnetic-hover'
import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<typeof Button>

type MagneticCTAButtonProps = ButtonProps & {
  /** Maximum pointer pull in pixels (Task 15 default: 6). */
  magneticStrength?: number
}

/** Primary CTA with magnetic pointer pull + spring lift. */
export const MagneticCTAButton = React.forwardRef<HTMLButtonElement, MagneticCTAButtonProps>(
  ({ magneticStrength = 6, className, ...props }, forwardedRef) => {
    const { ref: magneticRef } = useMagneticHover<HTMLButtonElement>({ strength: magneticStrength })

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        magneticRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef, magneticRef],
    )

    return <Button ref={setRefs} className={cn('magnetic-btn', className)} {...props} />
  },
)
MagneticCTAButton.displayName = 'MagneticCTAButton'
