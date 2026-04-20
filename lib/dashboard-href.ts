import type { ProfileRole } from '@/lib/types/profile'

/** Dashboard home for the app shell; `null` if no dashboard link applies. */
export function getDashboardHref(role: ProfileRole | null | undefined): string | null {
  if (!role) return null
  if (role === 'user' || role === 'client') return '/dashboard'
  if (role === 'admin' || role === 'staff') return '/admin'
  return null
}
