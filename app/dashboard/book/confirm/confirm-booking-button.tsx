'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type Props = {
  catalogSlug: string
  startsAt: string
  sessionId: string | null
  disabled: boolean
}

export function ConfirmBookingButton({ catalogSlug, startsAt, sessionId, disabled }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onConfirm() {
    if (disabled) return
    if (!sessionId && !startsAt) return
    setLoading(true)
    try {
      const body = sessionId
        ? { sessionId, catalogSlug }
        : { catalogSlug, startsAt }
      const res = await fetch('/api/dashboard/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast.error(data?.error ?? 'Booking failed')
        return
      }
      toast.success('Booking request submitted', {
        description: 'We will confirm your appointment shortly.',
      })
      router.push('/dashboard/bookings')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="cta"
      disabled={disabled || loading}
      className="motion-safe:transition-transform motion-safe:active:scale-[0.98]"
      onClick={() => void onConfirm()}
    >
      <CheckCircle2 className="size-4" />
      {loading ? 'Submitting…' : 'Confirm booking'}
    </Button>
  )
}
