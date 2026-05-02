import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { MissingProfileField } from '@/lib/dashboard/profile-completeness'

type Props = {
  percent: number
  missing: MissingProfileField[]
}

export function ProfileCompletenessCard({ percent, missing }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <UserRound className="size-5 text-primary" />
          Profile completeness
        </CardTitle>
        <CardDescription>Helps us reach you quickly if your appointment changes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold tabular-nums text-foreground">{percent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary motion-safe:transition-all motion-safe:duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        {missing.length > 0 ? (
          <ul className="space-y-2">
            {missing.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{m.label}</span>
                <Link href={m.href} className="shrink-0 font-medium text-primary hover:underline">
                  Add
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Profile looks complete. You can still update details anytime.</p>
        )}
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/profile">Open profile editor</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
