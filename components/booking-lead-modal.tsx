'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

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
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'
import type { LeadSchedulingContext } from '@/lib/landing/book-cta'
import { trackEvent } from '@/lib/analytics'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  intent: LeadSchedulingIntent
  context?: LeadSchedulingContext
}

const SCAN_STEPS = [
  'Scanning your site…',
  'Checking mobile speed…',
  'Reviewing SEO…',
] as const

const SCAN_TOTAL_MS = 2000
const SCAN_STEP_MS = Math.floor(SCAN_TOTAL_MS / SCAN_STEPS.length)

const websiteUrlSchema = z
  .string()
  .trim()
  .min(1, 'Website URL is required.')
  .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
  .pipe(z.string().url('Enter a valid URL (e.g. https://yourclinic.co.uk).'))

const formSchema = z.object({
  biggestIssue: z.string().trim().max(500).optional(),
  websiteUrl: websiteUrlSchema,
  name: z.string().trim().min(1, 'Your name is required.').max(200),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.').max(320),
  practiceName: z.string().trim().max(200).optional(),
  businessType: z.string().trim().max(200).optional(),
  honeypot: z.string().max(200).optional(),
})

type FormValues = z.infer<typeof formSchema>

const emptyValues: FormValues = {
  biggestIssue: '',
  websiteUrl: '',
  name: '',
  email: '',
  practiceName: '',
  businessType: '',
  honeypot: '',
}

export function BookingLeadModal({ open, onOpenChange, intent, context }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [scanStep, setScanStep] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState('')
  const scanTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const lastTrackedOpenRef = useRef(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  })

  const clearScanTimers = useCallback(() => {
    for (const t of scanTimers.current) clearTimeout(t)
    scanTimers.current = []
  }, [])

  const reseed = useCallback(() => {
    clearScanTimers()
    setSubmitError(null)
    setScanStep(0)
    setIsScanning(false)
    setSuccess(false)
    setConfirmedEmail('')
    reset(emptyValues)
  }, [clearScanTimers, reset])

  useEffect(() => {
    if (open) {
      if (!lastTrackedOpenRef.current) {
        trackEvent('audit_modal_opened', {
          intent,
          bottleneckProvided: Boolean(context?.bottleneck),
        })
        lastTrackedOpenRef.current = true
      }
      // Pre-fill the biggest-issue field with whatever the visitor typed into
      // Quick Find so they don't have to retype it inside the modal.
      reset({ ...emptyValues, biggestIssue: context?.bottleneck ?? '' })
    } else {
      lastTrackedOpenRef.current = false
    }
  }, [open, intent, context, reset])

  useEffect(() => () => clearScanTimers(), [clearScanTimers])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) reseed()
      onOpenChange(next)
    },
    [onOpenChange, reseed],
  )

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    setIsScanning(false)

    const isAuditSubmit = intent === 'website_audit'
    const trimmedBusinessType = values.businessType?.trim() ?? ''
    const trimmedBiggestIssue = values.biggestIssue?.trim() ?? ''
    const trimmedPracticeName = values.practiceName?.trim() ?? ''

    if (isAuditSubmit) {
      let hasError = false
      if (!trimmedBusinessType) {
        setError('businessType', { type: 'manual', message: 'Business type is required.' })
        hasError = true
      }
      if (!trimmedBiggestIssue) {
        setError('biggestIssue', { type: 'manual', message: 'Tell us your biggest issue or goal.' })
        hasError = true
      }
      if (hasError) return
    } else if (!trimmedPracticeName) {
      setError('practiceName', { type: 'manual', message: 'Practice name is required.' })
      return
    }

    const privacyPolicyUrl = `${window.location.origin}/privacy`
    const baseBody = {
      name: values.name.trim(),
      email: values.email.trim(),
      websiteUrl: values.websiteUrl.trim(),
      consent: {
        gdpr: true as const,
        privacyPolicyUrl,
        submittedAt: new Date().toISOString(),
      },
      honeypot: values.honeypot ?? '',
    }
    const body = isAuditSubmit
      ? {
          ...baseBody,
          businessType: trimmedBusinessType,
          biggestIssue: trimmedBiggestIssue,
        }
      : {
          ...baseBody,
          practiceName: trimmedPracticeName,
        }

    try {
      const path =
        intent === 'website_audit' ? '/api/leads/website-audit' : '/api/leads/request-demo'
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

      // Reassuring 2-second scanning microinteraction before we reveal success.
      setIsScanning(true)
      setScanStep(0)
      clearScanTimers()
      SCAN_STEPS.forEach((_, idx) => {
        if (idx === 0) return
        const t = setTimeout(() => setScanStep(idx), idx * SCAN_STEP_MS)
        scanTimers.current.push(t)
      })
      const finishTimer = setTimeout(() => {
        setIsScanning(false)
        setConfirmedEmail(body.email)
        setSuccess(true)
        trackEvent('audit_submitted', { intent })
      }, SCAN_TOTAL_MS)
      scanTimers.current.push(finishTimer)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    }
  })

  const isAudit = intent === 'website_audit'
  const formTitle = isAudit
    ? 'Get your free website audit'
    : 'Where should we send your demo?'
  const formDescription = isAudit
    ? 'Here’s what you can let us know to get the best audit.'
    : 'Enter your details and we’ll follow up at this address.'
  const submitLabel = isAudit ? 'Get my free audit' : 'Get my demo'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="z-[100] flex max-h-[min(92vh,920px)] max-w-lg flex-col gap-0 overflow-hidden border-none bg-[var(--glass-bg-strong)] p-0 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-[var(--glass-bg-strong)]"
        style={{ borderColor: 'var(--glass-border)', borderWidth: 1, borderStyle: 'solid' }}
      >
        <DialogHeader className="shrink-0 border-b border-[var(--glass-border)] px-5 pb-4 pt-5 text-left sm:px-6">
          <DialogTitle className="text-pretty pr-8">
            {success ? 'Audit on its way' : formTitle}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {success
              ? `We’ll email your audit to ${confirmedEmail} within 2 business days.`
              : formDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {success ? null : isScanning ? (
            <div
              className="flex min-h-[260px] flex-col items-center justify-center gap-5 text-center"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary motion-reduce:animate-none" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">{SCAN_STEPS[scanStep]}</p>
                <p className="text-sm text-muted-foreground">Hang tight — finalising your audit.</p>
              </div>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    width: `${Math.min(100, ((scanStep + 1) / SCAN_STEPS.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <form id="audit-form" noValidate onSubmit={onSubmit} className="space-y-4">
              <div className="sr-only" aria-hidden="true">
                <Label htmlFor="lead-honeypot">Company website</Label>
                <Input
                  id="lead-honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audit-name">Your name</Label>
                <Input
                  id="audit-name"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className="rounded-xl"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  {...register('name')}
                />
                {errors.name ? (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="audit-email">Email</Label>
                <Input
                  id="audit-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@yourclinic.co.uk"
                  className="rounded-xl"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="audit-website-url">Website URL</Label>
                <Input
                  id="audit-website-url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder={isAudit ? 'e.g. standoutgroup.net' : 'https://yourclinic.co.uk'}
                  className="rounded-xl"
                  aria-invalid={errors.websiteUrl ? 'true' : 'false'}
                  {...register('websiteUrl')}
                />
                {errors.websiteUrl ? (
                  <p className="text-xs text-destructive">{errors.websiteUrl.message}</p>
                ) : null}
              </div>
              {isAudit ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="audit-business-type">Business type</Label>
                    <Input
                      id="audit-business-type"
                      autoComplete="organization"
                      placeholder="e.g. Dental Clinic"
                      className="rounded-xl"
                      aria-invalid={errors.businessType ? 'true' : 'false'}
                      {...register('businessType')}
                    />
                    {errors.businessType ? (
                      <p className="text-xs text-destructive">{errors.businessType.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audit-biggest-issue">Biggest issue or goal</Label>
                    <textarea
                      id="audit-biggest-issue"
                      rows={3}
                      maxLength={500}
                      placeholder="e.g. poor loading speed, lack of mobile optimisation"
                      className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm"
                      aria-invalid={errors.biggestIssue ? 'true' : 'false'}
                      {...register('biggestIssue')}
                    />
                    {errors.biggestIssue ? (
                      <p className="text-xs text-destructive">{errors.biggestIssue.message}</p>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="audit-practice">Practice name</Label>
                  <Input
                    id="audit-practice"
                    autoComplete="organization"
                    placeholder="Carter Dental Studio"
                    className="rounded-xl"
                    aria-invalid={errors.practiceName ? 'true' : 'false'}
                    {...register('practiceName')}
                  />
                  {errors.practiceName ? (
                    <p className="text-xs text-destructive">{errors.practiceName.message}</p>
                  ) : null}
                </div>
              )}
              <p className="pt-1 text-xs text-muted-foreground">
                By submitting, you agree to our{' '}
                <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
                  Privacy policy
                </Link>
                .
              </p>
            </form>
          )}

          {submitError ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--glass-border)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          {success ? (
            <Button type="button" variant="cta" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          ) : isScanning ? (
            <Button type="button" variant="cta" disabled className="w-full sm:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Preparing your audit…
            </Button>
          ) : (
            <Button
              type="submit"
              form="audit-form"
              variant="cta"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending…' : submitLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
