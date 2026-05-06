'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'

import { CalendlyInlineEmbed } from '@/components/calendly/calendly-inline-embed'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { buildCalendlyPrefillFromLead } from '@/lib/calendly/build-prefill-from-lead'
import type { CalendlyEmbedRuntimeConfig } from '@/lib/calendly/embed-config'
import {
  emptyLeadForm,
  getLeadQuestionSteps,
  labelForOption,
  type LeadFormState,
  type LeadQuestionStep,
  type LeadSchedulingIntent,
} from '@/lib/calendly/lead-questions'
import type { CalendlyPrefill } from '@/lib/calendly/calendly-types'
import { cn } from '@/lib/utils'

function isValidEmail(email: string): boolean {
  const s = email.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function formatStepAnswer(form: LeadFormState, step: LeadQuestionStep | undefined): string {
  if (!step) return ''
  const v = form[step.field]
  if (!v?.trim()) return ''
  if (step.multiline) return v.trim()
  return labelForOption(step, v)
}

function buildAuditBusinessAnswers(form: LeadFormState, steps: LeadQuestionStep[]) {
  return {
    q1: formatStepAnswer(form, steps[0]),
    q2: formatStepAnswer(form, steps[1]),
    q3: formatStepAnswer(form, steps[2]),
  }
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  calendly: CalendlyEmbedRuntimeConfig
  intent: LeadSchedulingIntent
}

export function BookingLeadCalendlyModal({ open, onOpenChange, calendly, intent }: Props) {
  const questionSteps = useMemo(() => getLeadQuestionSteps(intent), [intent])
  const calendlyStep = 1 + questionSteps.length
  const totalSteps = calendlyStep + 1

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<LeadFormState>(emptyLeadForm)
  const [prefillSnapshot, setPrefillSnapshot] = useState<CalendlyPrefill | null>(null)
  const [embedNonce, setEmbedNonce] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { publicBookingUrl, embedUrl, embedWidgetEnabled } = calendly

  const reset = useCallback(() => {
    setStep(0)
    setForm(emptyLeadForm())
    setPrefillSnapshot(null)
    setSubmitting(false)
    setSubmitError(null)
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) reset()
      onOpenChange(next)
    },
    [onOpenChange, reset],
  )

  const validateCurrent = (): boolean => {
    if (step === 0) {
      return (
        Boolean(form.fullName.trim()) &&
        isValidEmail(form.email) &&
        form.gdprAccepted &&
        !form.honeypot.trim()
      )
    }
    if (step >= 1 && step <= questionSteps.length) {
      const q = questionSteps[step - 1]
      if (q.multiline) return true
      return Boolean(form[q.field]?.trim())
    }
    return true
  }

  const goNext = async () => {
    if (!validateCurrent()) return

    if (step === calendlyStep - 1) {
      if (intent === 'website_audit') {
        const business = buildAuditBusinessAnswers(form, questionSteps)
        if (!business.q1 || !business.q2 || !business.q3) {
          setSubmitError('Please answer all questions before continuing.')
          return
        }

        setSubmitting(true)
        setSubmitError(null)
        try {
          const privacyPolicyUrl = `${window.location.origin}/privacy`
          const res = await fetch('/api/leads/website-audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: form.fullName.trim(),
              email: form.email.trim(),
              business,
              consent: {
                gdpr: true as const,
                privacyPolicyUrl,
                submittedAt: new Date().toISOString(),
              },
              honeypot: form.honeypot,
            }),
          })
          const data = (await res.json().catch(() => ({}))) as { error?: string }
          if (!res.ok) {
            setSubmitError(data.error ?? 'Something went wrong. Please try again.')
            return
          }
        } catch {
          setSubmitError('Network error. Please check your connection and try again.')
          return
        } finally {
          setSubmitting(false)
        }
      }

      setPrefillSnapshot(buildCalendlyPrefillFromLead(form, questionSteps))
      setEmbedNonce((n) => n + 1)
      setStep(calendlyStep)
      return
    }

    if (step < calendlyStep) {
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (step === calendlyStep) {
      setPrefillSnapshot(null)
    }
    setSubmitError(null)
    setStep((s) => Math.max(0, s - 1))
  }

  const currentQuestion =
    step >= 1 && step <= questionSteps.length ? questionSteps[step - 1] : null
  const progressLabel = `Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`

  const showCalendlyWidget = Boolean(
    embedWidgetEnabled && embedUrl && publicBookingUrl && prefillSnapshot,
  )

  const step0Title =
    intent === 'website_audit' ? 'Book your website audit' : 'Before we open the calendar'
  const step0Description =
    intent === 'website_audit'
      ? 'Tell us about your goals, confirm consent, then answer three short questions before you pick a time.'
      : 'Share your details and a few quick answers so we can prepare for your call.'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          'z-[100] flex max-h-[min(92vh,920px)] flex-col gap-0 overflow-hidden p-0',
          step === calendlyStep ? 'w-[calc(100vw-1rem)] max-w-4xl' : 'max-w-lg',
        )}
      >
        <DialogHeader className="shrink-0 border-b border-border px-5 pb-4 pt-5 text-left sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {progressLabel}
          </p>
          <DialogTitle className="text-pretty pr-8">
            {step === 0
              ? step0Title
              : step === calendlyStep
                ? 'Pick a time'
                : currentQuestion?.headline}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {step === 0
              ? step0Description
              : step === calendlyStep
                ? 'Your name and email are filled in below. Complete any remaining questions in Calendly.'
                : (currentQuestion?.description ?? 'Choose one option to continue.')}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {step === 0 ? (
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
              <div className="space-y-2">
                <Label htmlFor="lead-full-name">Full name</Label>
                <Input
                  id="lead-full-name"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Jane Smith"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email">Work email</Label>
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
          ) : null}

          {currentQuestion && !currentQuestion.multiline ? (
            <RadioGroup
              value={form[currentQuestion.field] || undefined}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, [currentQuestion.field]: v }) as LeadFormState)
              }
              className="flex flex-col gap-2"
            >
              {currentQuestion.options?.map((opt) => {
                const id = `${String(currentQuestion.field)}-${opt.value}`
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors',
                      form[currentQuestion.field] === opt.value &&
                        'border-primary ring-1 ring-primary/30',
                    )}
                  >
                    <RadioGroupItem value={opt.value} id={id} className="mt-1" />
                    <Label htmlFor={id} className="cursor-pointer font-normal leading-snug">
                      {opt.label}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          ) : null}

          {currentQuestion?.multiline ? (
            <div className="space-y-2">
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="e.g. key pages, tech stack, or competitor sites you admire"
                rows={5}
                className="min-h-32 rounded-xl"
              />
            </div>
          ) : null}

          {submitError ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}

          {step === calendlyStep ? (
            <div className="space-y-4">
              {!publicBookingUrl ? (
                <p className="text-center text-sm text-muted-foreground">
                  Scheduling is not configured. Add{' '}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_CALENDLY_EVENT_URL</code> to
                  your environment.
                </p>
              ) : showCalendlyWidget && embedUrl && publicBookingUrl && prefillSnapshot ? (
                <CalendlyInlineEmbed
                  key={embedNonce}
                  embedUrl={embedUrl}
                  publicFallbackUrl={publicBookingUrl}
                  prefill={prefillSnapshot}
                  minHeightClassName="min-h-[560px] sm:min-h-[620px]"
                  showFooterLinks={false}
                  className="gap-3"
                />
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    The embedded calendar is unavailable (blocked or disabled). Open Calendly in a new
                    tab to finish booking — your name and email are still easy to paste from the
                    previous step.
                  </p>
                  <Button variant="cta" className="w-full sm:w-auto" asChild>
                    <Link href={publicBookingUrl} target="_blank" rel="noopener noreferrer">
                      Continue in Calendly
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {step < calendlyStep ? (
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
            <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0 || submitting}>
              Back
            </Button>
            <Button type="button" variant="cta" onClick={() => void goNext()} disabled={submitting}>
              {submitting ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
            <Button type="button" variant="ghost" onClick={goBack}>
              Back
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
