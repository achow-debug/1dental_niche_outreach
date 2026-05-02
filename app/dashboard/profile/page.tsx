import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const metadata = {
  title: 'My profile | Carter Dental Studio',
  description: 'Your account overview.',
}

export default async function DashboardProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/profile')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Profile missing</AlertTitle>
        <AlertDescription>Complete sign-up or contact support.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your account. Edit full details in the profile editor.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{profile.full_name || 'Your name'}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{profile.role}</Badge>
            <Badge variant="outline">{profile.status}</Badge>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/profile">
                <Settings className="mr-2 size-4" />
                Edit profile
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">Profile settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
