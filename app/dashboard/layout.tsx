import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAvatarSignedUrl } from '@/lib/avatar'
import { loadDashboardNotifications } from '@/lib/dashboard/load-user-notifications-server'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { DashboardBookingsRealtime } from '@/components/dashboard/dashboard-bookings-realtime'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role === 'admin' || profile?.role === 'staff') {
    redirect('/admin')
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
      </div>
    )
  }

  const avatarSigned = await getAvatarSignedUrl(supabase, profile.avatar_url)
  const notifications = await loadDashboardNotifications()

  return (
    <DashboardShell
      email={user.email ?? 'Unknown user'}
      fullName={profile.full_name}
      avatarUrl={avatarSigned}
      notifications={notifications}
    >
      <DashboardBookingsRealtime userId={user.id} />
      {children}
    </DashboardShell>
  )
}
