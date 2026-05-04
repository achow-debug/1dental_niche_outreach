export type LeadFormState = {
  fullName: string
  email: string
  goal: string
  traffic: string
  liveSite: string
  timeline: string
  notes: string
}

export const emptyLeadForm = (): LeadFormState => ({
  fullName: '',
  email: '',
  goal: '',
  traffic: '',
  liveSite: '',
  timeline: '',
  notes: '',
})

export type LeadQuestionStep = {
  /** Field on `LeadFormState` updated on this step */
  field: keyof Pick<LeadFormState, 'goal' | 'traffic' | 'liveSite' | 'timeline' | 'notes'>
  headline: string
  description?: string
  options?: { value: string; label: string }[]
  /** When true, render a textarea instead of radios */
  multiline?: boolean
}

/** Up to five qualification steps after name/email (before Calendly). */
export const LEAD_QUESTION_STEPS: LeadQuestionStep[] = [
  {
    field: 'goal',
    headline: 'What is the main outcome you want from this call?',
    description: 'Pick the closest match — we will tailor the conversation.',
    options: [
      { value: 'conversions', label: 'Improve conversions & UX' },
      { value: 'seo', label: 'SEO & organic visibility' },
      { value: 'performance', label: 'Performance, Core Web Vitals & tech health' },
      { value: 'roadmap', label: 'Roadmap for a redesign or rebuild' },
      { value: 'unsure', label: 'Not sure yet — want your recommendations' },
    ],
  },
  {
    field: 'traffic',
    headline: 'Rough monthly traffic to your website?',
    options: [
      { value: 'lt1k', label: 'Under 1,000 visits' },
      { value: '1k-10k', label: '1,000 – 10,000' },
      { value: '10k-100k', label: '10,000 – 100,000' },
      { value: 'gt100k', label: 'Over 100,000' },
      { value: 'na', label: 'Prefer not to say' },
    ],
  },
  {
    field: 'liveSite',
    headline: 'Do you have a live site today?',
    options: [
      { value: 'yes-public', label: 'Yes — it is public' },
      { value: 'staging', label: 'Only staging / coming soon' },
      { value: 'no', label: 'Not yet' },
    ],
  },
  {
    field: 'timeline',
    headline: 'When are you hoping to get started?',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: '1-3mo', label: 'In the next 1–3 months' },
      { value: '3mo-plus', label: 'In 3+ months' },
      { value: 'exploring', label: 'Just exploring options' },
    ],
  },
  {
    field: 'notes',
    headline: 'Anything specific you want us to look at first?',
    description: 'Optional — links, page types, or concerns (we will also see this in Calendly if you add a matching custom question there).',
    multiline: true,
  },
]

export function labelForOption(
  step: LeadQuestionStep | undefined,
  value: string,
): string {
  if (!step?.options) return value
  return step.options.find((o) => o.value === value)?.label ?? value
}
