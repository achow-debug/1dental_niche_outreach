'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import type { NotificationItem } from '@/lib/mocks/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Props = {
  items: NotificationItem[]
}

export function NotificationsPreview({ items }: Props) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const preview = items.slice(0, 4)
  const unread = items.filter((n) => !n.read).length

  async function markRead(id: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/dashboard/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      })
      if (res.ok) router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function markAll() {
    setMarkingAll(true)
    try {
      const res = await fetch('/api/dashboard/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      })
      if (res.ok) router.refresh()
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base sm:text-lg">Activity & notifications</CardTitle>
          <CardDescription>
            {unread > 0 ? `${unread} unread — tap an item to open or mark read.` : 'You are up to date.'}
          </CardDescription>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {unread > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-full sm:w-auto"
              disabled={markingAll}
              onClick={() => void markAll()}
            >
              <CheckCheck className="size-4" />
              {markingAll ? 'Updating…' : 'Mark all read'}
            </Button>
          ) : null}
          <Button asChild variant="secondary" size="sm" className="h-9 w-full sm:w-auto">
            <Link href="/dashboard/notifications">Notification centre</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {preview.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <ul className="space-y-2">
            {preview.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'rounded-xl border border-border/80 bg-muted/20 p-3 motion-safe:transition-colors motion-safe:hover:bg-muted/40',
                  !item.read && 'border-l-[3px] border-l-primary border-border/80 bg-primary/[0.04]',
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <Link href={item.href} className="min-w-0 flex-1 group">
                    <p className="font-medium text-foreground group-hover:underline">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/90">{item.createdAt}</p>
                  </Link>
                  {!item.read ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 self-start text-xs"
                      disabled={busyId === item.id}
                      onClick={() => void markRead(item.id)}
                    >
                      {busyId === item.id ? '…' : 'Mark read'}
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
