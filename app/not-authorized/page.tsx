import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Not authorized | Carter Dental Studio',
  description: 'You do not have access to that area.',
}

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Not authorized</CardTitle>
          <CardDescription>
            That area is only for practice staff. Patient accounts cannot open the admin console.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="cta">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
