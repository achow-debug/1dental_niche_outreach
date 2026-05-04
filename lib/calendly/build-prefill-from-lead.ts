import type { LeadFormState } from '@/lib/calendly/lead-questions'
import { LEAD_QUESTION_STEPS, labelForOption } from '@/lib/calendly/lead-questions'
import type { CalendlyPrefill } from '@/lib/calendly/calendly-types'

function readSummaryQuestionId(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_CALENDLY_SUMMARY_CUSTOM_QUESTION_ID?.trim()
  if (!raw) return undefined
  return raw
}

function splitName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

/** Human-readable block for hosts (and optional Calendly custom question). */
export function formatLeadSummary(lead: LeadFormState): string {
  const lines: string[] = ['--- From website lead form ---']
  LEAD_QUESTION_STEPS.forEach((step, i) => {
    const value = lead[step.field]
    if (!value?.trim()) return
    if (step.multiline) {
      lines.push(`${step.headline}: ${value.trim()}`)
      return
    }
    const label = labelForOption(step, value)
    lines.push(`${i + 1}. ${step.headline}: ${label}`)
  })
  return lines.join('\n')
}

/**
 * Prefills Calendly with name/email (always). Optionally maps a single “summary” custom invitee
 * question in Calendly: set `NEXT_PUBLIC_CALENDLY_SUMMARY_CUSTOM_QUESTION_ID` to that question’s
 * UUID from the embed inspector / Calendly docs so this text appears in the widget.
 */
export function buildCalendlyPrefillFromLead(lead: LeadFormState): CalendlyPrefill {
  const name = lead.fullName.trim()
  const email = lead.email.trim()
  const { firstName, lastName } = splitName(name)

  const prefill: CalendlyPrefill = {
    name,
    email,
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
  }

  const summaryId = readSummaryQuestionId()
  if (summaryId) {
    const summary = formatLeadSummary(lead)
    prefill.customAnswers = { [summaryId]: summary }
  }

  return prefill
}
