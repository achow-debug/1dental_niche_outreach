import { Badge } from '@/components/ui/badge'
import { NotificationsCentreClient } from '@/components/dashboard/notifications-centre-client'
import { loadDashboardNotifications } from '@/lib/dashboard/load-user-notifications-server'

export async function NotificationsPageBody() {
  const items = await loadDashboardNotifications()
  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Booking updates and reminders in one place.</p>
        </div>
        <Badge variant="secondary" className="tabular-nums">
          {unread} unread
        </Badge>
      </div>
      <NotificationsCentreClient items={items} />
    </div>
  )
}
