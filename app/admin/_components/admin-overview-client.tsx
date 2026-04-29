'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarClock, CircleAlert, CircleCheckBig, CircleHelp, Users } from 'lucide-react'
import { BOOKINGS, CLIENTS, NOTIFICATIONS, OVERVIEW_QUICK_ACTIONS, RECENT_ACTIVITY } from '@/lib/mocks/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type ActivityFilter = 'all' | 'user' | 'admin'

export default function AdminOverviewClient() {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all')

  const latestBookingDate = BOOKINGS.reduce((latest, booking) => (booking.date > latest ? booking.date : latest), BOOKINGS[0]?.date ?? '')
  const bookingsToday = BOOKINGS.filter((booking) => booking.date === latestBookingDate)
  const confirmedCount = BOOKINGS.filter((booking) => booking.status === 'confirmed').length
  const activeClients = CLIENTS.filter((client) => client.status === 'active').length
  const inactiveClients = CLIENTS.length - activeClients
  const noShowCount = BOOKINGS.filter((booking) => booking.status === 'no_show').length
  const unreadNotifications = NOTIFICATIONS.filter((item) => !item.read).length
  const infoNotifications = NOTIFICATIONS.filter((item) => item.severity === 'info').length
  const warningNotifications = NOTIFICATIONS.filter((item) => item.severity === 'warning').length
  const criticalNotifications = NOTIFICATIONS.filter((item) => item.severity === 'critical').length
  const latestNotificationTime = NOTIFICATIONS[0]?.createdAt ?? 'No events'
  const confirmedRate = BOOKINGS.length > 0 ? Math.round((confirmedCount / BOOKINGS.length) * 100) : 0
  const activeClientRate = CLIENTS.length > 0 ? Math.round((activeClients / CLIENTS.length) * 100) : 0

  const metrics = [
    {
      label: 'Bookings today',
      value: String(bookingsToday.length),
      icon: CalendarClock,
      delta: latestBookingDate ? `${latestBookingDate} schedule` : 'No bookings yet',
      accent: 'text-primary',
      helper: 'Updates from the latest booking day in the dataset and refreshes whenever booking rows change.',
    },
    {
      label: 'Confirmed rate',
      value: `${confirmedRate}%`,
      icon: CircleCheckBig,
      delta: `${confirmedCount} of ${BOOKINGS.length} confirmed`,
      accent: 'text-primary',
      helper: 'Percentage of all bookings currently marked confirmed.',
    },
    {
      label: 'Active clients',
      value: `${activeClients}/${CLIENTS.length}`,
      icon: Users,
      delta: `${activeClientRate}% active, ${inactiveClients} inactive`,
      accent: 'text-primary',
      helper: 'Calculated from client status. Any status change immediately updates this KPI.',
    },
    {
      label: 'No-show alerts',
      value: String(noShowCount),
      icon: CircleAlert,
      delta: noShowCount > 0 ? 'Needs follow-up workflow' : 'No no-shows today',
      accent: 'text-primary',
      helper: 'Count of bookings currently in no-show state.',
    },
  ] as const

  const filteredActivity = useMemo(
    () => RECENT_ACTIVITY.filter((item) => activityFilter === 'all' || item.actorType === activityFilter),
    [activityFilter]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Admin overview</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Operational dashboard with live mock KPIs, quick actions, and notification intelligence.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {OVERVIEW_QUICK_ACTIONS.map((action, index) => (
            <Button key={action.href} asChild size="sm" variant={index === 2 ? 'cta' : 'outline'} className="rounded-full fluid-action">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="glass-surface-elevated interactive-card-lift border-border/60">
            <CardHeader className="space-y-1 pb-2">
              <div className="flex items-center gap-2">
                <CardDescription>{metric.label}</CardDescription>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground transition hover:text-foreground" aria-label={`About ${metric.label}`}>
                      <CircleHelp className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6} className="max-w-64 text-xs">
                    {metric.helper}
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
              <span>{metric.delta}</span>
              <metric.icon className={`size-4 ${metric.accent}`} />
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-surface-elevated">
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
                className="fluid-link flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 transition hover:border-primary/40 hover:bg-accent/30"
              >
                <span>{item.label}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-surface-elevated">
          <CardHeader>
            <CardTitle>Contextual quick actions</CardTitle>
            <CardDescription>Common operations with clear safeguard boundaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Treatment types</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/treatment-types">Create type</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/treatment-types">Duplicate template</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/treatment-types">Archive/restore</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Clients</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/clients">Add client</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/clients">Open profile</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/clients">Suspend/unsuspend</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Bookings</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/bookings">Confirm</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/bookings">Reschedule</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="fluid-action">
                  <Link href="/admin/bookings">Mark no-show</Link>
                </Button>
                <Button asChild size="sm" variant="destructive" className="fluid-action">
                  <Link href="/admin/bookings">Cancel booking</Link>
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Destructive operations remain confirmation-gated inside each module.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-surface-elevated">
          <CardHeader>
            <CardTitle>Notification center status</CardTitle>
            <CardDescription>Live snapshot of current unread and severity distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Unread {unreadNotifications}</Badge>
              <Badge variant="outline">Info {infoNotifications}</Badge>
              <Badge variant="outline">Warning {warningNotifications}</Badge>
              <Badge variant="destructive">Critical {criticalNotifications}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild size="sm" variant="outline" className="fluid-action">
                <Link href="/admin/notifications">Open notification center</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="fluid-action">
                <Link href="/admin/bookings">Open booking alerts</Link>
              </Button>
            </div>
            <p className="text-xs">
              Latest event: {latestNotificationTime}. Realtime backend wiring can now plug into this summary block.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-surface-elevated">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Unified stream across client and admin actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(['all', 'user', 'admin'] as const).map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={activityFilter === value ? 'secondary' : 'outline'}
                  className="fluid-action capitalize"
                  onClick={() => setActivityFilter(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              {filteredActivity.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/70 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.actorName}</p>
                    <Badge variant={item.actorType === 'admin' ? 'secondary' : 'outline'}>{item.actorType}</Badge>
                  </div>
                  <p className="text-muted-foreground">{item.action}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.target}</span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              ))}
              {filteredActivity.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity for this filter.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
