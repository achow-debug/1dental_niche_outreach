import Link from 'next/link'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Profile settings | Carter Dental Studio',
  description: 'Manage your account preferences.',
}

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Account preferences and profile details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile and photo</CardTitle>
          <CardDescription>Update your name, contact details, and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/profile">
              <User className="mr-2 size-4" />
              Open full profile editor
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Reminder and communication preferences will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Coming soon.</CardContent>
      </Card>
    </div>
  )
}
