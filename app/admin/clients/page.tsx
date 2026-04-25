'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import { CLIENTS, type ClientRow } from '@/lib/mocks/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const PAGE_SIZE = 5

export default function ClientsPage() {
  const [rows, setRows] = useState<ClientRow[]>(CLIENTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'bookings'>('name')
  const [page, setPage] = useState(1)
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const next = rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!term) return true
      return row.name.toLowerCase().includes(term) || row.email.toLowerCase().includes(term)
    })

    return next.sort((a, b) => {
      if (sortBy === 'bookings') return b.totalBookings - a.totalBookings
      return a.name.localeCompare(b.name)
    })
  }, [rows, search, statusFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const currentRows = filtered.slice(start, start + PAGE_SIZE)

  function runAction(message: string) {
    toast({ title: message, description: 'Mock action only. API wiring comes next.' })
  }

  function toggleSuspend(id: string) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: row.status === 'active' ? 'suspended' : 'active' } : row)),
    )
    runAction('Client status updated')
  }

  async function updateRole(id: string, role: ClientRow['role']) {
    setSavingRoleId(id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, role } : row)))
    setSavingRoleId(null)
    runAction(`Role updated to ${role}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage client records with contextual actions and safeguards.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full">
            Create booking for client
          </Button>
          <Button className="rounded-full">
            <Plus className="mr-2 size-4" />
            Add client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client table</CardTitle>
          <CardDescription>
            Searchable directory, engagement tracking, role management, and responsive fallback cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search name or email"
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value: 'all' | 'active' | 'suspended') => {
                  setStatusFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: 'name' | 'bookings') => setSortBy(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="bookings">Most bookings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {currentRows.map((row) => (
              <div key={row.id} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{row.name}</p>
                  <Badge variant={row.status === 'active' ? 'secondary' : 'outline'}>{row.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{row.email}</p>
                <p className="text-xs text-muted-foreground">{row.phone}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Role: {row.role} · Engagement: {row.engagementScore}%
                </p>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[1%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.totalBookings}</TableCell>
                    <TableCell>{row.engagementScore}%</TableCell>
                    <TableCell>
                      <Select value={row.role} onValueChange={(value: ClientRow['role']) => void updateRole(row.id, value)}>
                        <SelectTrigger className="w-[130px]" disabled={savingRoleId === row.id}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">user</SelectItem>
                          <SelectItem value="client">client</SelectItem>
                          <SelectItem value="admin">admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'active' ? 'secondary' : 'outline'}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => runAction('Client profile opened')}>Open profile</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => runAction('Create booking flow opened')}>
                            Create booking
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => runAction('Engagement timeline opened')}>
                            View engagement
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(event) => event.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                {row.status === 'active' ? 'Suspend' : 'Unsuspend'}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {row.status === 'active' ? 'Suspend client?' : 'Unsuspend client?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This change keeps all historical records and can be reversed later.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toggleSuspend(row.id)}>
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {currentRows.length} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
