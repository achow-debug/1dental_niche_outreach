import type { NotificationItem } from '@/lib/mocks/admin'

export type UserNotificationRow = {
  id: string
  title: string
  body: string
  severity: 'info' | 'warning' | 'critical'
  read_at: string | null
  href: string | null
  created_at: string
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const diff = Date.now() - t
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export function mapUserNotificationRows(rows: UserNotificationRow[] | null | undefined): NotificationItem[] {
  if (!rows?.length) return []
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    severity: r.severity,
    read: r.read_at != null,
    href: r.href ?? '/dashboard/notifications',
    createdAt: formatRelative(r.created_at),
  }))
}
