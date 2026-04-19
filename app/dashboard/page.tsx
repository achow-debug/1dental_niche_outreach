import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SignOutButton } from '@/components/auth/sign-out-button'

export const metadata = {
  title: 'Dashboard | Carter Dental Studio',
  description: 'Your Carter Dental Studio account.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Profile missing</AlertTitle>
        <AlertDescription>
          No profile row found. Run the Supabase migration and ensure the <code>handle_new_user</code> trigger is
          installed.
        </AlertDescription>
      </Alert>
    )
  }

  if (profile.role === 'admin' || profile.role === 'staff') {
    redirect('/admin')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Placeholder for patient-facing tools. Accounts with role <code className="rounded bg-muted px-1 py-0.5">user</code> or{' '}
            <code className="rounded bg-muted px-1 py-0.5">client</code> land here after sign-in.
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
            After bookings go live, this role can move from <code className="rounded bg-muted px-1 py-0.5">user</code> to{' '}
            <code className="rounded bg-muted px-1 py-0.5">client</code> automatically.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smoke tests</CardTitle>
          <CardDescription>Quick checks for this milestone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>Sign up a new user and land here with role `user`.</li>
            <li>Promote a user to `admin` in Supabase and confirm `/admin` works while `/dashboard` redirects to `/admin`.</li>
            <li>Sign out and sign back in via `/login`.</li>
          </ul>
          <Link href="/book" className="font-medium text-primary underline-offset-4 hover:underline">
            Go to booking (public)
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
