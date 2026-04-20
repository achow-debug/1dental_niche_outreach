import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAvatarSignedUrl } from '@/lib/avatar'
import { ProfileEditor } from '@/app/profile/profile-editor'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Profile } from '@/lib/types/profile'

export const metadata = {
  title: 'Profile | Carter Dental Studio',
  description: 'View and edit your Carter Dental Studio profile.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/profile')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Profile missing</AlertTitle>
        <AlertDescription>
          No profile row found. Ensure the Supabase migration and <code className="rounded bg-muted px-1">handle_new_user</code>{' '}
          trigger are applied.
        </AlertDescription>
      </Alert>
    )
  }

  const signed = await getAvatarSignedUrl(supabase, profile.avatar_url)

  return (
    <ProfileEditor user={user} profile={profile as Profile} initialAvatarSignedUrl={signed} />
  )
}
