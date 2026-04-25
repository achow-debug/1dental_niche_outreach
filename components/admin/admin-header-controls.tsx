'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bell, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getProfileInitialLetter } from '@/lib/profile-initial'
import type { NotificationItem } from '@/lib/mocks/admin'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type AccountMenuProps = {
  email: string
  fullName: string | null
  avatarUrl: string | null
}

export function AdminAccountMenu({ email, fullName, avatarUrl }: AccountMenuProps) {
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
        <Button
          variant="ghost"
          className="h-10 min-w-0 max-w-[13rem] gap-2 rounded-full px-2 ring-1 ring-border/70 transition hover:ring-primary/40"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initial}</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium">{fullName || email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={signingOut}
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
        >
          <LogOut className="mr-2 size-4" />
          {signingOut ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type NotificationMenuProps = {
  notifications: NotificationItem[]
}

export function NotificationMenu({ notifications }: NotificationMenuProps) {
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full ring-1 ring-border/70 hover:ring-primary/40">
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[20rem]">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium">Notifications</span>
          <Badge variant="secondary">{unreadCount} unread</Badge>
        </div>
        <DropdownMenuSeparator />
        {notifications.slice(0, 4).map((item) => (
          <DropdownMenuItem key={item.id} asChild className="cursor-pointer">
            <Link href={item.href} className="flex flex-col items-start gap-1 py-2">
              <span className="text-sm font-medium leading-none">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.body}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer justify-center text-primary">
          <Link href="/admin/notifications">Open notification center</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
