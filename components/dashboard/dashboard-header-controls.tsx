'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bell, CalendarCheck2, LogOut, Settings, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getProfileInitialLetter } from '@/lib/profile-initial'
import type { NotificationItem } from '@/lib/mocks/admin'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type AccountMenuProps = {
  email: string
  fullName: string | null
  avatarUrl: string | null
}

function AvatarTrigger({ email, fullName, avatarUrl }: AccountMenuProps) {
  const initial = getProfileInitialLetter(fullName, email)
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-10 shrink-0 gap-2 rounded-full px-2 ring-1 ring-border/70 transition hover:ring-primary/40 motion-safe:active:scale-95 motion-safe:duration-150"
      aria-label="Account menu"
    >
      <Avatar className="h-8 w-8">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initial}</AvatarFallback>
      </Avatar>
      <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline">{fullName || email}</span>
    </Button>
  )
}

export function DashboardAccountMenu({ email, fullName, avatarUrl }: AccountMenuProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const initial = getProfileInitialLetter(fullName, email)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setSigningOut(false)
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarTrigger email={email} fullName={fullName} avatarUrl={avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="w-[min(calc(100vw-1.5rem),20rem)] rounded-xl p-0 shadow-lg"
      >
        <div className="flex items-center gap-3 border-b border-border/80 px-3 py-3 sm:px-4">
          <Avatar className="h-11 w-11 shrink-0">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{fullName || 'Your account'}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="p-1.5">
          <DropdownMenuItem asChild className="min-h-11 cursor-pointer rounded-lg px-3 py-2.5 text-[15px] sm:text-sm">
            <Link href="/dashboard/bookings">
              <CalendarCheck2 className="mr-2 size-4 shrink-0" />
              My bookings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="min-h-11 cursor-pointer rounded-lg px-3 py-2.5 text-[15px] sm:text-sm">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 size-4 shrink-0" />
              Profile settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="min-h-11 cursor-pointer rounded-lg px-3 py-2.5 text-[15px] sm:text-sm">
            <Link href="/dashboard/profile">
              <User className="mr-2 size-4 shrink-0" />
              My profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            className="min-h-11 cursor-pointer rounded-lg px-3 py-2.5 text-[15px] text-destructive focus:text-destructive sm:text-sm"
            disabled={signingOut}
            onSelect={(event) => {
              event.preventDefault()
              void handleSignOut()
            }}
          >
            <LogOut className="mr-2 size-4 shrink-0" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type NotificationMenuProps = {
  notifications: NotificationItem[]
}

function sortSmartNotifications(items: NotificationItem[]): NotificationItem[] {
  const rank: Record<NotificationItem['severity'], number> = { critical: 0, warning: 1, info: 2 }
  return [...items].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1
    return rank[a.severity] - rank[b.severity]
  })
}

function severityBorderClass(severity: NotificationItem['severity']) {
  if (severity === 'critical') return 'border-l-destructive'
  if (severity === 'warning') return 'border-l-amber-500'
  return 'border-l-primary/70'
}

export function DashboardNotificationMenu({ notifications }: NotificationMenuProps) {
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])
  const sorted = useMemo(() => sortSmartNotifications(notifications), [notifications])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative shrink-0 rounded-full ring-1 ring-border/70 transition hover:ring-primary/40 motion-safe:active:scale-95 motion-safe:duration-150"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        alignOffset={0}
        avoidCollisions
        collisionPadding={12}
        className="w-[min(calc(100vw-1.25rem),22rem)] max-w-[calc(100vw-1.25rem)] overflow-hidden rounded-xl border border-border p-0 shadow-lg data-[side=bottom]:origin-top-right"
      >
        <div className="flex items-start justify-between gap-2 border-b border-border/80 bg-muted/40 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-foreground">Notifications</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Most recent updates first.</p>
          </div>
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            {unreadCount > 0 ? `${unreadCount > 9 ? '9+' : unreadCount} new` : 'All caught up'}
          </Badge>
        </div>

        <div className="max-h-[min(52vh,20rem)] overflow-y-auto overscroll-contain py-1">
          {sorted.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="flex flex-col gap-0.5 px-1.5 py-1">
              {sorted.map((item) => (
                <li key={item.id}>
                  <DropdownMenuItem asChild className="cursor-pointer p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex w-full flex-col gap-1 rounded-lg border border-y border-r border-transparent py-2.5 pr-2 pl-3 text-left transition-colors motion-safe:duration-200 motion-safe:hover:bg-muted/70 border-l-[3px]',
                        severityBorderClass(item.severity),
                        !item.read && 'bg-primary/[0.06]',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-snug text-foreground">{item.title}</span>
                        {!item.read ? (
                          <span
                            className="mt-1 size-2 shrink-0 rounded-full bg-primary motion-safe:animate-pulse motion-reduce:animate-none"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                      <span className="text-xs leading-relaxed text-muted-foreground">{item.body}</span>
                      <span className="text-[11px] text-muted-foreground/90">{item.createdAt}</span>
                    </Link>
                  </DropdownMenuItem>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border/80 bg-background/95 p-2">
          <Button variant="outline" className="h-11 w-full rounded-lg text-sm" asChild>
            <Link href="/dashboard/notifications">Open notification centre</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
