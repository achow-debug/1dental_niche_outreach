'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getDashboardHref } from '@/lib/dashboard-href'
import { getAvatarSignedUrl } from '@/lib/avatar'
import { getProfileInitialLetter } from '@/lib/profile-initial'
import type { ProfileRole } from '@/lib/types/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
  variant: 'desktop' | 'mobile-drawer' | 'mobile-toolbar'
  onNavigate?: () => void
}

export function HeaderAuthSection({ variant, onNavigate }: Props) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [role, setRole] = useState<ProfileRole | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)

  const refreshSession = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setUserId(null)
      setEmail(null)
      setFullName(null)
      setRole(null)
      setSignedUrl(null)
      return
    }
    setUserId(user.id)
    setEmail(user.email ?? null)
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, full_name, role')
      .eq('id', user.id)
      .maybeSingle()
    setFullName(profile?.full_name ?? null)
    setRole((profile?.role as ProfileRole) ?? null)
    const path = profile?.avatar_url?.trim() || null
    const url = await getAvatarSignedUrl(supabase, path)
    setSignedUrl(url)
  }, [])

  useEffect(() => {
    void refreshSession()
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshSession()
    })
    return () => subscription.unsubscribe()
  }, [refreshSession])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setSigningOut(false)
    onNavigate?.()
    router.push('/')
    router.refresh()
  }

  const initial = getProfileInitialLetter(fullName, email)
  const dashboardHref = getDashboardHref(role)

  if (!userId) {
    if (variant === 'desktop') {
      return (
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Log in
        </Link>
      )
    }
    if (variant === 'mobile-toolbar') {
      return null
    }
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="block py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Log in
      </Link>
    )
  }

  /** Compact avatar in the header bar: opens account links without opening the site nav drawer. */
  if (variant === 'mobile-toolbar') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 shrink-0 rounded-full p-0 ring-2 ring-border/60 transition-colors hover:bg-secondary/50 hover:ring-primary/40"
            aria-label="Account menu"
          >
            <Avatar className="h-9 w-9">
              {signedUrl ? <AvatarImage src={signedUrl} alt="" /> : null}
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">{initial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={8}
          collisionPadding={12}
          className="w-[min(calc(100vw-1.5rem),18rem)] rounded-xl"
        >
          <div className="border-b border-border/80 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">{fullName || 'Your account'}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          {dashboardHref ? (
            <DropdownMenuItem asChild className="min-h-11 cursor-pointer text-[15px] sm:text-sm">
              <Link href={dashboardHref} onClick={onNavigate}>
                <LayoutDashboard className="mr-2 size-4 shrink-0" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem asChild className="min-h-11 cursor-pointer text-[15px] sm:text-sm">
            <Link href="/profile" onClick={onNavigate}>
              <User className="mr-2 size-4 shrink-0" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="min-h-11 cursor-pointer text-[15px] text-destructive focus:text-destructive sm:text-sm"
            disabled={signingOut}
            onSelect={(e) => {
              e.preventDefault()
              void handleSignOut()
            }}
          >
            {signingOut ? 'Logging out…' : 'Log out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  /** Inside the hamburger panel: site links only; signed-in users use the header avatar instead. */
  if (variant === 'mobile-drawer') {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 shrink-0 rounded-full p-0 ring-2 ring-border/60 hover:ring-primary/40"
          aria-label="Account menu"
        >
          <Avatar className="h-10 w-10">
            {signedUrl ? <AvatarImage src={signedUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {dashboardHref ? (
          <DropdownMenuItem asChild>
            <Link href={dashboardHref} className="cursor-pointer">
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={signingOut}
          onSelect={(e) => {
            e.preventDefault()
            void handleSignOut()
          }}
          className="cursor-pointer"
        >
          {signingOut ? 'Logging out…' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
