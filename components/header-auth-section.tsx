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
  variant: 'desktop' | 'mobile'
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
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Log in
        </Link>
      )
    }
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="block text-center text-sm font-medium text-muted-foreground hover:text-primary py-2"
      >
        Log in
      </Link>
    )
  }

  if (variant === 'mobile') {
    return (
      <div className="space-y-3 pt-2 border-t border-border/50 mt-2">
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-10 w-10">
            {signedUrl ? <AvatarImage src={signedUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">{initial}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground truncate">{email}</span>
        </div>
        {dashboardHref ? (
          <Link
            href={dashboardHref}
            onClick={onNavigate}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-lg font-medium py-2"
          >
            <LayoutDashboard className="size-5" />
            Dashboard
          </Link>
        ) : null}
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-lg font-medium py-2"
        >
          <User className="size-5" />
          Profile
        </Link>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
          className="w-full text-left text-lg font-medium text-muted-foreground hover:text-primary py-2 disabled:opacity-60"
        >
          {signingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    )
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
            <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">{initial}</AvatarFallback>
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
