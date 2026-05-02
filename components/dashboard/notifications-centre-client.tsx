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

export function NotificationsCentreClient({ items }: Props) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
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
    <div className="space-y-4">
      {unread > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full sm:w-auto"
            disabled={markingAll}
            onClick={() => void markAll()}
          >
            <CheckCheck className="size-4" />
            {markingAll ? 'Marking…' : 'Mark all as read'}
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-0.5',
                !item.read && 'border-l-[3px] border-l-primary',
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  {!item.read ? <span className="size-2 shrink-0 rounded-full bg-primary motion-safe:animate-pulse motion-reduce:animate-none" aria-label="Unread" /> : null}
                </div>
                <CardDescription>{item.createdAt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{item.body}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button asChild variant="secondary" size="sm" className="h-9 w-full sm:w-auto">
                    <Link href={item.href}>Open related</Link>
                  </Button>
                  {!item.read ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-full sm:w-auto"
                      disabled={busyId === item.id}
                      onClick={() => void markRead(item.id)}
                    >
                      {busyId === item.id ? 'Updating…' : 'Mark as read'}
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
