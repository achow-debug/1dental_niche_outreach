'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('login', '1')
    const redirect = searchParams?.get('redirect')
    if (redirect) params.set('redirect', redirect)
    const error = searchParams?.get('error')
    if (error) params.set('error', error)
    router.replace(`/?${params.toString()}`)
  }, [router, searchParams])

  return (
    <p className="text-sm text-muted-foreground" aria-live="polite">
      Opening sign-in…
    </p>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <LoginRedirect />
    </Suspense>
  )
}
