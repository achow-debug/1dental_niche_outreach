import { CheckCircle2 } from 'lucide-react'

const OUTCOME_CHIPS = [
  'Clear primary CTA above the fold',
  'Mobile-first layout for your patients',
  'Social proof and credentials where it counts',
] as const

export function DemoOutcomes() {
  return (
    <section
      id="demo"
      aria-labelledby="demo-outcomes-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          You&apos;re viewing a demo
        </span>
        <h2
          id="demo-outcomes-heading"
          className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          This is what your clinic&apos;s website could do
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Carter Dental Studio is a working example — conversion-focused layout, trust signals, and a
          booking path built for private practices. Standout Group builds the same calibre of site for UK
          clinics using your brand, team, and treatments.
        </p>
        <ul className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {OUTCOME_CHIPS.map((chip) => (
            <li
              key={chip}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-left text-sm font-medium text-foreground sm:text-center"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
