'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  intent: LeadSchedulingIntent
}

type FormState = {
  firstName: string
  lastName: string
  email: string
  sector: string
  teamSize: string
  gdprAccepted: boolean
  honeypot: string
}

const emptyForm = (): FormState => ({
  firstName: '',
  lastName: '',
  email: '',
  sector: '',
  teamSize: '',
  gdprAccepted: false,
  honeypot: '',
})

function isValidEmail(email: string): boolean {
  const s = email.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export function BookingLeadModal({ open, onOpenChange, intent }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState('')

  const reset = useCallback(() => {
    setForm(emptyForm())
    setSubmitting(false)
    setSubmitError(null)
    setSuccess(false)
    setConfirmedEmail('')
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) reset()
      onOpenChange(next)
    },
    [onOpenChange, reset],
  )

  const validate = (): boolean => {
    return (
      Boolean(form.firstName.trim()) &&
      Boolean(form.lastName.trim()) &&
      isValidEmail(form.email) &&
      Boolean(form.sector.trim()) &&
      Boolean(form.teamSize.trim()) &&
      form.gdprAccepted &&
      !form.honeypot.trim()
    )
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)
    const emailTrim = form.email.trim()

    const privacyPolicyUrl = `${window.location.origin}/privacy`
    const body = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: emailTrim,
      sector: form.sector.trim(),
      teamSize: form.teamSize.trim(),
      consent: {
        gdpr: true as const,
        privacyPolicyUrl,
        submittedAt: new Date().toISOString(),
      },
      honeypot: form.honeypot,
    }

    try {
      const path = intent === 'website_audit' ? '/api/leads/website-audit' : '/api/leads/request-demo'
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setSubmitError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setConfirmedEmail(emailTrim)
      setSuccess(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formTitle =
    intent === 'website_audit'
      ? 'Where should we send your website audit?'
      : 'Where should we send your demo?'

  const submitLabel = intent === 'website_audit' ? 'Get my audit' : 'Get my demo'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="z-[100] flex max-h-[min(92vh,920px)] max-w-lg flex-col gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="shrink-0 border-b border-border px-5 pb-4 pt-5 text-left sm:px-6">
          <DialogTitle className="text-pretty pr-8">
            {success ? 'Thank you' : formTitle}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {success
              ? intent === 'website_audit'
                ? `Your website audit will be sent to ${confirmedEmail}.`
                : `We'll send your demo details to ${confirmedEmail}.`
              : intent === 'website_audit'
                ? 'Enter your details and we’ll email your audit to you.'
                : 'Enter your details and we’ll follow up at this address.'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {success ? null : (
            <div className="space-y-4">
              <div className="sr-only" aria-hidden="true">
                <Label htmlFor="lead-company-website">Company website</Label>
                <Input
                  id="lead-company-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(e) => setForm((f) => ({ ...f, honeypot: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="lead-first-name">First name</Label>
                  <Input
                    id="lead-first-name"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="lead-last-name">Last name</Label>
                  <Input
                    id="lead-last-name"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email">Email address</Label>
                <Input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@company.com"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-sector">Sector</Label>
                <Input
                  id="lead-sector"
                  value={form.sector}
                  onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                  placeholder="Dental / Healthcare"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-team-size">Team Size</Label>
                <Input
                  id="lead-team-size"
                  value={form.teamSize}
                  onChange={(e) => setForm((f) => ({ ...f, teamSize: e.target.value }))}
                  placeholder="10"
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <Checkbox
                  id="lead-gdpr"
                  checked={form.gdprAccepted}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, gdprAccepted: v === true }))
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="lead-gdpr" className="cursor-pointer text-sm font-normal leading-snug">
                  I agree to the processing of my data for this request, as described in the{' '}
                  <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
                    Privacy policy
                  </Link>
                  . (Required)
                </Label>
              </div>
            </div>
          )}

          {submitError ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          {success ? (
            <Button type="button" variant="cta" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          ) : (
            <Button
              type="button"
              variant="cta"
              className="w-full sm:w-auto"
              onClick={() => void handleSubmit()}
              disabled={submitting}
            >
              {submitting ? 'Sending…' : submitLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
