'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'

import { CalendlyInlineEmbed } from '@/components/calendly/calendly-inline-embed'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { buildCalendlyPrefillFromLead } from '@/lib/calendly/build-prefill-from-lead'
import type { CalendlyEmbedRuntimeConfig } from '@/lib/calendly/embed-config'
import {
  emptyLeadForm,
  LEAD_QUESTION_STEPS,
  type LeadFormState,
} from '@/lib/calendly/lead-questions'
import type { CalendlyPrefill } from '@/lib/calendly/calendly-types'
import { cn } from '@/lib/utils'

const CALENDLY_STEP = 1 + LEAD_QUESTION_STEPS.length
const TOTAL_STEPS = CALENDLY_STEP + 1

function isValidEmail(email: string): boolean {
  const s = email.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  calendly: CalendlyEmbedRuntimeConfig
}

export function BookingLeadCalendlyModal({ open, onOpenChange, calendly }: Props) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<LeadFormState>(emptyLeadForm)
  const [prefillSnapshot, setPrefillSnapshot] = useState<CalendlyPrefill | null>(null)
  const [embedNonce, setEmbedNonce] = useState(0)

  const { publicBookingUrl, embedUrl, embedWidgetEnabled } = calendly

  const reset = useCallback(() => {
    setStep(0)
    setForm(emptyLeadForm())
    setPrefillSnapshot(null)
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
      return Boolean(form.fullName.trim()) && isValidEmail(form.email)
    }
    if (step >= 1 && step <= 5) {
      const q = LEAD_QUESTION_STEPS[step - 1]
      if (q.multiline) return true
      return Boolean(form[q.field]?.trim())
    }
    return true
  }

  const goNext = () => {
    if (!validateCurrent()) return
    if (step === 5) {
      setPrefillSnapshot(buildCalendlyPrefillFromLead(form))
      setEmbedNonce((n) => n + 1)
      setStep(6)
      return
    }
    if (step < CALENDLY_STEP) {
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (step === 6) {
      setPrefillSnapshot(null)
    }
    setStep((s) => Math.max(0, s - 1))
  }

  const currentQuestion = step >= 1 && step <= 5 ? LEAD_QUESTION_STEPS[step - 1] : null
  const progressLabel = `Step ${Math.min(step + 1, TOTAL_STEPS)} of ${TOTAL_STEPS}`

  const showCalendlyWidget = Boolean(
    embedWidgetEnabled && embedUrl && publicBookingUrl && prefillSnapshot,
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          'z-[100] flex max-h-[min(92vh,920px)] flex-col gap-0 overflow-hidden p-0',
          step === 6 ? 'w-[calc(100vw-1rem)] max-w-4xl' : 'max-w-lg',
        )}
      >
        <DialogHeader className="shrink-0 border-b border-border px-5 pb-4 pt-5 text-left sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {progressLabel}
          </p>
          <DialogTitle className="text-pretty pr-8">
            {step === 0
              ? 'Before we open the calendar'
              : step === 6
                ? 'Pick a time'
                : currentQuestion?.headline}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {step === 0
              ? 'Share your details and a few quick answers so we can prepare for your call.'
              : step === 6
                ? 'Your name and email are filled in below. Complete any remaining questions in Calendly.'
                : (currentQuestion?.description ?? 'Choose one option to continue.')}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {step === 0 ? (
            <div className="space-y-4">
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

          {step === 6 ? (
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

        {step < 6 ? (
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
            <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0}>
              Back
            </Button>
            <Button type="button" variant="cta" onClick={goNext}>
              Continue
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
