import { Suspense } from 'react'
import { NotificationsPageBody } from '@/app/dashboard/notifications/notifications-page-body'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Notifications | Carter Dental Studio',
  description: 'Stay updated on bookings and your account.',
}

function NotificationsFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function DashboardNotificationsPage() {
  return (
    <Suspense fallback={<NotificationsFallback />}>
      <NotificationsPageBody />
    </Suspense>
  )
}
