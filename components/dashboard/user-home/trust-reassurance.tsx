import { HeartHandshake, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function TrustReassuranceCard() {
  return (
    <Card className="border-emerald-600/15 bg-gradient-to-br from-emerald-500/[0.06] via-card to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
          What happens next
        </CardTitle>
        <CardDescription>Private, calm care — you stay in control of every step.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          After you request a time, our team confirms availability and follows up if anything needs adjusting. You will
          see updates here and in your email.
        </p>
        <div className="flex gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
          <HeartHandshake className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="font-medium text-foreground">Need help?</p>
            <p className="mt-1 text-muted-foreground">
              Email hello@carterdentalstudio.co.uk — we aim to reply quickly during studio hours.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
