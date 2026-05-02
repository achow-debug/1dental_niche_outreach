import type { ComponentType } from 'react'
import {
  Bell,
  CalendarCheck2,
  LayoutDashboard,
  Settings,
  Sparkles,
} from 'lucide-react'

export type DashboardNavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'My bookings', icon: CalendarCheck2 },
  { href: '/dashboard/book', label: 'Book treatment', icon: Sparkles },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Profile settings', icon: Settings },
]

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}
