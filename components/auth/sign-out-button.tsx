'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type Props = {
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  label?: string
}

export function SignOutButton({ variant = 'outline', className, label = 'Sign out' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setLoading(false)
    router.push('/')
    router.refresh()
  }

  return (
    <Button type="button" variant={variant} className={className} disabled={loading} onClick={handleSignOut}>
      {loading ? 'Signing out…' : label}
    </Button>
  )
}
