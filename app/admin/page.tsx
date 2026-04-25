import Link from 'next/link'
import { ArrowRight, CalendarClock, CircleCheckBig, Users } from 'lucide-react'
import { OVERVIEW_QUICK_ACTIONS } from '@/lib/mocks/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Admin | Carter Dental Studio',
  description: 'Practice admin dashboard overview (mock).',
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Admin overview</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Mobile-first admin workspace with mock data while design is finalized.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {OVERVIEW_QUICK_ACTIONS.map((action) => (
            <Button key={action.href} asChild size="sm" variant="outline" className="rounded-full">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Bookings today', value: '28', icon: CalendarClock, delta: '+6% vs yesterday' },
          { label: 'Confirmed rate', value: '92%', icon: CircleCheckBig, delta: '+3.2% this week' },
          { label: 'Active clients', value: '184', icon: Users, delta: '+11 this month' },
          { label: 'No-show alerts', value: '4', icon: CalendarClock, delta: 'Needs follow-up' },
        ].map((metric) => (
          <Card key={metric.label} className="glass-surface border-border/60">
            <CardHeader className="space-y-1 pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
              <span>{metric.delta}</span>
              <metric.icon className="size-4 text-primary" />
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
            <CardDescription>Jump to common admin modules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { href: '/admin/treatment-types', label: 'Treatment type management' },
              { href: '/admin/clients', label: 'Client records and actions' },
              { href: '/admin/bookings', label: 'Booking operations board' },
              { href: '/admin/notifications', label: 'Notification center' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 transition hover:border-primary/40 hover:bg-accent/30"
              >
                <span>{item.label}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contextual quick actions</CardTitle>
            <CardDescription>Actions adapt by module with destructive safeguards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <Badge variant="secondary" className="mr-2">
                Treatment types
              </Badge>
              Create, duplicate, archive, restore.
            </p>
            <p>
              <Badge variant="secondary" className="mr-2">
                Clients
              </Badge>
              Add client, open profile, suspend/unsuspend.
            </p>
            <p>
              <Badge variant="secondary" className="mr-2">
                Bookings
              </Badge>
              Confirm, reschedule, cancel, mark no-show, restore.
            </p>
            <p className="pt-2 text-xs">
              All destructive actions use confirmation dialogs and toast feedback in implementation.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Realtime notification center status</CardTitle>
          <CardDescription>UI is wired with mock events and realtime-ready placeholders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Bell + unread badge</Badge>
            <Badge variant="outline">Notification list page</Badge>
            <Badge variant="outline">Deep links</Badge>
            <Badge variant="outline">Severity labels</Badge>
          </div>
          <p className="text-xs">
            Backend step next: add `notifications` table + RLS + trusted event pipeline + Supabase Realtime channels.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
