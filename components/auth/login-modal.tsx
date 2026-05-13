'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { sanitizeRedirectPath } from '@/lib/auth/safe-redirect'
import { trackEvent } from '@/lib/analytics'

export function LoginModal() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isOpen = (searchParams?.get('login') ?? '') === '1'
  const redirectTo = sanitizeRedirectPath(searchParams?.get('redirect') ?? null)
  const authError = searchParams?.get('error') ?? null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [trackedOpenForSession, setTrackedOpenForSession] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (!trackedOpenForSession) {
        trackEvent('login_modal_opened')
        setTrackedOpenForSession(true)
      }
    } else if (trackedOpenForSession) {
      setTrackedOpenForSession(false)
      setError(null)
      setForgotOpen(false)
      setPassword('')
      setForgotEmail('')
    }
  }, [isOpen, trackedOpenForSession])

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.delete('login')
    params.delete('redirect')
    params.delete('error')
    const search = params.toString()
    router.replace(`${pathname}${search ? `?${search}` : ''}`, { scroll: false })
  }, [pathname, router, searchParams])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) closeModal()
    },
    [closeModal],
  )

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    closeModal()
    router.push(redirectTo)
    router.refresh()
  }

  const handleForgotSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setForgotSubmitting(true)
    // Backend wiring is out of scope per the redesign plan — surface a friendly toast instead.
    setTimeout(() => {
      setForgotSubmitting(false)
      toast.success('Reset link coming soon', {
        description: 'Password resets are not wired up in this preview build.',
      })
    }, 400)
  }

  const onForgotClick = () => {
    trackEvent('forgot_password_clicked')
    setForgotOpen((open) => !open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="z-[100] flex max-w-md flex-col gap-0 overflow-hidden border-none bg-[var(--glass-bg-strong)] p-0 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-[var(--glass-bg-strong)]"
        style={{ borderColor: 'var(--glass-border)', borderWidth: 1, borderStyle: 'solid' }}
      >
        <DialogHeader className="shrink-0 border-b border-[var(--glass-border)] px-5 pb-4 pt-5 text-left sm:px-6">
          <DialogTitle className="pr-8">Log in</DialogTitle>
          <DialogDescription>
            Use the email and password for your Carter Dental Studio account.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {authError === 'auth' ? (
            <p className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              The sign-in link may have expired or already been used. Try your password, or open a fresh link from your
              email.
            </p>
          ) : null}
          {error ? (
            <p className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <form id="login-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourclinic.co.uk"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <button
                  type="button"
                  onClick={onForgotClick}
                  className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </form>

          {forgotOpen ? (
            <form
              onSubmit={handleForgotSubmit}
              className="mt-4 space-y-3 rounded-xl border border-[var(--glass-border)] bg-card/60 p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Reset your password</p>
                <p className="text-xs text-muted-foreground">
                  We’ll email you a secure reset link.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@yourclinic.co.uk"
                  className="rounded-xl"
                />
              </div>
              <Button type="submit" variant="outline" className="h-10 w-full rounded-xl" disabled={forgotSubmitting}>
                {forgotSubmitting ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--glass-border)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="submit"
            form="login-form"
            variant="cta"
            className="w-full sm:w-auto"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
