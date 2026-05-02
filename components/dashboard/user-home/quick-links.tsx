import Link from 'next/link'
import { CalendarCheck2, History, Mail, Sparkles, UserRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const linkClassName =
  'flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 px-3 py-3 text-sm font-medium text-foreground motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/30'

const LINKS = [
  { href: '/dashboard/book', label: 'Book appointment', icon: Sparkles },
  { href: '/dashboard/bookings', label: 'Booking history', icon: History },
  { href: '/dashboard/settings', label: 'Profile settings', icon: UserRound },
  { href: 'mailto:hello@carterdentalstudio.co.uk', label: 'Email support', icon: Mail, external: true },
] as const

export function QuickLinksGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CalendarCheck2 className="size-5 text-primary" />
          Quick links
        </CardTitle>
        <CardDescription>Jump to common tasks without hunting through menus.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LINKS.map(({ href, label, icon: Icon, ...rest }) => {
            const external = 'external' in rest && rest.external
            const inner = (
              <>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {label}
              </>
            )
            return (
              <li key={href}>
                {external ? (
                  <a href={href} className={linkClassName}>
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={linkClassName}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
