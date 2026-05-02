import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Step = {
  id: string
  title: string
  description: string
  done: boolean
  href: string
  cta: string
}

type Props = {
  steps: Step[]
  show: boolean
}

export function OnboardingLane({ steps, show }: Props) {
  if (!show) return null

  const doneCount = steps.filter((s) => s.done).length

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/[0.06] to-card">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Get set up</CardTitle>
        <CardDescription>
          {doneCount}/{steps.length} complete — finish these to get the most from your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                'flex gap-3 rounded-xl border border-border/70 bg-background/80 p-3 sm:p-4',
                step.done && 'border-primary/25 bg-primary/[0.03]',
              )}
            >
              <div className="mt-0.5 shrink-0">
                {step.done ? (
                  <CheckCircle2 className="size-5 text-primary" aria-hidden />
                ) : (
                  <Circle className="size-5 text-muted-foreground/60" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {!step.done ? (
                  <Link
                    href={step.href}
                    className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {step.cta}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
