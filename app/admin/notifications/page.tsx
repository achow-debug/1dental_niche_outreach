import Link from 'next/link'
import { NOTIFICATIONS } from '@/lib/mocks/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminNotificationsPage() {
  const unread = NOTIFICATIONS.filter((item) => !item.read).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notification center</h1>
          <p className="text-sm text-muted-foreground">
            Mock realtime feed UI. Next step is wiring Supabase Realtime + notifications table.
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live feed</CardTitle>
          <CardDescription>
            Unread <Badge variant="secondary">{unread}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {NOTIFICATIONS.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{item.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={item.read ? 'outline' : 'secondary'}>{item.read ? 'Read' : 'Unread'}</Badge>
                  <Badge
                    variant={
                      item.severity === 'critical'
                        ? 'destructive'
                        : item.severity === 'warning'
                          ? 'outline'
                          : 'secondary'
                    }
                  >
                    {item.severity}
                  </Badge>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                <Link href={item.href} className="text-xs font-medium text-primary hover:underline">
                  Open related item
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
