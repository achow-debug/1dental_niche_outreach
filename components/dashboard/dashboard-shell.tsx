'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import type { NotificationItem } from '@/lib/mocks/admin'
import { DASHBOARD_NAV, isDashboardNavActive } from '@/lib/dashboard/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { DashboardAccountMenu, DashboardNotificationMenu } from '@/components/dashboard/dashboard-header-controls'

type Props = {
  email: string
  fullName: string | null
  avatarUrl: string | null
  notifications: NotificationItem[]
  children: React.ReactNode
}

function toTitle(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function DashboardShell({ email, fullName, avatarUrl, notifications, children }: Props) {
  const pathname = usePathname()

  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0 || segments[0] !== 'dashboard') {
      return [{ href: '/dashboard', label: 'Dashboard' }]
    }

    const items = [{ href: '/dashboard', label: 'Dashboard' }]
    let currentPath = '/dashboard'
    for (const segment of segments.slice(1)) {
      currentPath += `/${segment}`
      items.push({ href: currentPath, label: toTitle(segment) })
    }
    return items
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar className="border-r border-border/70" collapsible="offcanvas">
        <SidebarHeader className="px-4 py-4">
          <Link href="/dashboard" className="text-sm font-semibold text-foreground">
            Carter Dental Studio
          </Link>
          <span className="text-xs text-muted-foreground">My account</span>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {DASHBOARD_NAV.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isDashboardNavActive(pathname, item.href)}>
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/">Back to landing page</Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="inline-flex h-9 w-9 shrink-0 rounded-lg border border-border/50 bg-background/65 text-foreground shadow-sm backdrop-blur-md transition hover:bg-background/80 motion-safe:active:scale-[0.98]" />
                <span className="truncate text-sm font-semibold">Dashboard</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <DashboardNotificationMenu notifications={notifications} />
                <DashboardAccountMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
              </div>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                  const last = index === crumbs.length - 1
                  return (
                    <div key={crumb.href} className="flex items-center gap-1.5">
                      <BreadcrumbItem>
                        {last ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!last ? <BreadcrumbSeparator /> : null}
                    </div>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <SidebarTrigger
          className="fixed right-3 z-[26] flex h-11 w-11 rounded-full border border-border/45 bg-background/55 text-foreground shadow-md backdrop-blur-md transition hover:bg-background/72 motion-safe:active:scale-95 md:hidden"
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          aria-label="Open navigation menu"
        />
        <main className="px-4 py-6 pb-24 sm:px-6 md:pb-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
