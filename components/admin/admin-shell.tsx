'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { CalendarCheck2, MenuSquare, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ADMIN_NAV, NOTIFICATIONS } from '@/lib/mocks/admin'
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
import { AdminAccountMenu, NotificationMenu } from '@/components/admin/admin-header-controls'

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '/admin/treatment-types': MenuSquare,
  '/admin/clients': Users,
  '/admin/bookings': CalendarCheck2,
}

type Props = {
  email: string
  fullName: string | null
  avatarUrl: string | null
  children: React.ReactNode
}

function toTitle(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function AdminShell({ email, fullName, avatarUrl, children }: Props) {
  const pathname = usePathname()

  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return [{ href: '/admin', label: 'Admin' }]

    const items = [{ href: '/admin', label: 'Admin' }]
    if (segments[0] !== 'admin') return items

    let currentPath = '/admin'
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
          <Link href="/admin" className="text-sm font-semibold text-foreground">
            Carter Dental Studio
          </Link>
          <span className="text-xs text-muted-foreground">Admin workspace</span>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_NAV.map((item) => {
                  const Icon = NAV_ICONS[item.href] ?? MenuSquare
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
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
            <Link href="/">Back to marketing site</Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hidden h-9 w-9 rounded-md border border-border/70 md:inline-flex" />
                <span className="text-sm font-semibold">Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <NotificationMenu notifications={NOTIFICATIONS} />
                <AdminAccountMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
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
        <SidebarTrigger className="fixed right-4 z-30 h-10 w-10 rounded-full border border-border/70 bg-background/95 shadow-sm md:hidden" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }} />
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
