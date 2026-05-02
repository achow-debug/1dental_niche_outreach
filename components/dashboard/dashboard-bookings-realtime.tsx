'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string
}

/**
 * Refreshes server-rendered dashboard data when this user’s bookings change (Supabase Realtime).
 */
export function DashboardBookingsRealtime({ userId }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`bookings-user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          router.refresh()
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          // Realtime may be disabled on the project; booking flow still works via refresh.
        }
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [userId, router])

  return null
}
