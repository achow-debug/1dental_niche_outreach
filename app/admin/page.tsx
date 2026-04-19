import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignOutButton } from '@/components/auth/sign-out-button'

export const metadata = {
  title: 'Admin | Carter Dental Studio',
  description: 'Practice admin dashboard (mock).',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/not-authorized')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Placeholder home for staff and admin. Use this to confirm role-gated access after promoting an admin in
            Supabase.
          </p>
        </div>
        <SignOutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Signed-in user and profile row from `profiles`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary">{profile.role}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{profile.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Promote a user to <code className="rounded bg-muted px-1 py-0.5">admin</code> in Supabase (Table Editor or
            SQL) to reach this page. Standard users use <code className="rounded bg-muted px-1 py-0.5">/dashboard</code>{' '}
            and cannot open admin routes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next implementation steps</CardTitle>
          <CardDescription>From the merged backend plan.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Session categories, session types, calendar, bookings, and reporting will plug into this shell.</p>
          <Link href="/book" className="font-medium text-primary underline-offset-4 hover:underline">
            Public booking page
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
