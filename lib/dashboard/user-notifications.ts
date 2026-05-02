import type { NotificationItem } from '@/lib/mocks/admin'

/** User-facing notifications (mock until backend feed exists). */
export const USER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'u-ntf-1',
    title: 'Appointment confirmed',
    body: 'Your hygiene visit on Tuesday at 09:30 is confirmed.',
    severity: 'info',
    read: false,
    href: '/dashboard/bookings',
    createdAt: '2h ago',
  },
  {
    id: 'u-ntf-2',
    title: 'Reminder',
    body: 'Complete your profile so we can reach you if plans change.',
    severity: 'warning',
    read: false,
    href: '/dashboard/settings',
    createdAt: 'Yesterday',
  },
  {
    id: 'u-ntf-3',
    title: 'Booking window opened',
    body: 'New slots are available for whitening consultations.',
    severity: 'info',
    read: true,
    href: '/dashboard/book',
    createdAt: '3d ago',
  },
]
