'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { type ClientRow } from '@/lib/mocks/admin'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const PAGE_SIZE = 5

type ProfileListItem = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  phone_prefix: string | null
  phone_number: string | null
  role: 'user' | 'client' | 'staff' | 'admin'
  status: 'active' | 'suspended' | 'banned' | 'pending_review'
}

function toClientRow(profile: ProfileListItem): ClientRow {
  const fullName = [profile.first_name?.trim(), profile.last_name?.trim()].filter(Boolean).join(' ')
  const fallbackPhone = [profile.phone_prefix?.trim(), profile.phone_number?.trim()].filter(Boolean).join(' ')

  return {
    id: profile.id,
    name: fullName || 'Unnamed user',
    email: profile.email?.trim() || 'No email on file',
    phone: profile.phone ?? (fallbackPhone || 'No phone on file'),
    status: profile.status === 'active' ? 'active' : 'suspended',
    role: profile.role === 'admin' ? 'admin' : profile.role === 'client' ? 'client' : 'user',
    totalBookings: 0,
    lastBooking: '',
    engagementScore: 0,
  }
}

export default function ClientsPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [rows, setRows] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | ClientRow['role']>('all')
  const [sortBy, setSortBy] = useState<'name' | 'bookings'>('name')
  const [page, setPage] = useState(1)
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null)
  const [activeRowId, setActiveRowId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [newClientFirstName, setNewClientFirstName] = useState('')
  const [newClientLastName, setNewClientLastName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')

  async function loadClients() {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, phone_prefix, phone_number, role, status')
      .in('role', ['user', 'client'])
      .order('created_at', { ascending: false })

    if (error) {
      setLoadError(error.message)
      return
    }

    setLoadError(null)
    const mapped = (data ?? []).map((item) => toClientRow(item as ProfileListItem))
    setRows(mapped)
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitialClients() {
      await loadClients()
      if (!cancelled) {
        setLoading(false)
      }
    }

    void loadInitialClients()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadCurrentUser() {
      const supabase = createSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!cancelled) {
        setCurrentUserId(user?.id ?? null)
      }
    }

    void loadCurrentUser()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const next = rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (roleFilter !== 'all' && row.role !== roleFilter) return false
      if (!term) return true
      return row.name.toLowerCase().includes(term) || row.email.toLowerCase().includes(term)
    })

    return next.sort((a, b) => {
      if (sortBy === 'bookings') return b.totalBookings - a.totalBookings
      return a.name.localeCompare(b.name)
    })
  }, [rows, search, statusFilter, roleFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const currentRows = filtered.slice(start, start + PAGE_SIZE)

  function runAction(message: string) {
    toast({ title: message })
  }

  async function addClient() {
    const firstName = newClientFirstName.trim()
    const lastName = newClientLastName.trim()
    const email = newClientEmail.trim().toLowerCase()
    const phone = newClientPhone.trim()
    const fullName = [firstName, lastName].filter(Boolean).join(' ')

    if (!firstName || !lastName || !email) {
      setSaveFeedback({ type: 'error', message: 'First name, last name, and email are required.' })
      toast({
        title: 'Missing required fields',
        description: 'First name, last name, and email are required.',
      })
      return
    }

    setCreatingClient(true)
    setSaveFeedback(null)
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        const errorMessage = payload.error ?? `Request failed with status ${response.status}`
        setSaveFeedback({ type: 'error', message: errorMessage })
        toast({
          title: 'Failed to add client',
          description: errorMessage,
        })
        return
      }

      setNewClientFirstName('')
      setNewClientLastName('')
      setNewClientEmail('')
      setNewClientPhone('')
      setSaveFeedback({ type: 'success', message: `${fullName} was saved successfully.` })
      await loadClients()
      setPage(1)
      setAddDialogOpen(false)
      toast({
        title: 'Input acknowledged',
        description: `${fullName} was saved successfully in Supabase (public.profiles).`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error while saving client.'
      setSaveFeedback({ type: 'error', message: errorMessage })
      toast({
        title: 'Failed to add client',
        description: errorMessage,
      })
    } finally {
      setCreatingClient(false)
    }
  }

  async function toggleSuspend(id: string) {
    const target = rows.find((row) => row.id === id)
    if (!target) return
    const nextStatus = target.status === 'active' ? 'suspended' : 'active'
    const supabase = createSupabaseClient()
    const { error } = await supabase.from('profiles').update({ status: nextStatus }).eq('id', id)

    if (error) {
      toast({
        title: 'Status update failed',
        description: error.message,
      })
      return
    }

    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: nextStatus } : row)))
    runAction('Client status updated')
  }

  function openViewModal(id: string) {
    setActiveRowId(id)
  }

  function closeViewModal() {
    setActiveRowId(null)
  }

  async function deleteClient(id: string) {
    if (id === currentUserId) {
      toast({
        title: 'Cannot delete your own profile',
        description: 'Use another admin account if this account must be removed.',
      })
      return
    }
    const supabase = createSupabaseClient()
    const { error } = await supabase.from('profiles').delete().eq('id', id)

    if (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
      })
      return
    }

    setRows((prev) => prev.filter((row) => row.id !== id))
    setActiveRowId(null)
    runAction('Client deleted')
  }

  async function updateRole(id: string, role: ClientRow['role']) {
    setSavingRoleId(id)
    const supabase = createSupabaseClient()
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) {
      setSavingRoleId(null)
      toast({
        title: 'Role update failed',
        description: error.message,
      })
      return
    }
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, role } : row)))
    setSavingRoleId(null)
    runAction(`Role updated to ${role}`)
  }

  const activeClient = activeRowId ? rows.find((row) => row.id === activeRowId) ?? null : null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage client records with contextual actions and safeguards.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              if (!activeClient) {
                toast({
                  title: 'Select a client first',
                  description: 'Open a client row, then create a booking for that client.',
                })
                return
              }
              router.push(`/admin/bookings?clientId=${encodeURIComponent(activeClient.id)}`)
            }}
          >
            Create booking for client
          </Button>
          <Button
            className="rounded-full"
            onClick={() => {
              setSaveFeedback(null)
              setAddDialogOpen(true)
            }}
          >
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
          {loadError ? <p className="text-xs text-destructive">Error fetching clients: {loadError}</p> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="rounded-lg border border-border/70 p-3 text-sm text-muted-foreground">Loading clients...</div>
          ) : null}
          <div className="grid gap-2 md:grid-cols-4">
            <div className="relative md:col-span-2">
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:col-span-2">
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
              <Select
                value={roleFilter}
                onValueChange={(value: 'all' | ClientRow['role']) => {
                  setRoleFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
                  <button
                key={row.id}
                type="button"
                className="w-full rounded-xl border border-border/70 p-4 text-left transition hover:bg-muted/30"
                onClick={() => openViewModal(row.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{row.name}</p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{row.email}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background">
                    <Eye className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant={row.status === 'active' ? 'secondary' : 'outline'}>{row.status}</Badge>
                  <Badge variant="outline">{row.role}</Badge>
                  {row.id === currentUserId ? <Badge variant="secondary">You</Badge> : null}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{row.phone}</p>
              </button>
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
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => openViewModal(row.id)}
                  >
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.totalBookings}</TableCell>
                    <TableCell>{row.engagementScore}%</TableCell>
                    <TableCell onClick={(event) => event.stopPropagation()}>
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
                      <div className="flex items-center gap-2">
                        <Badge variant={row.status === 'active' ? 'secondary' : 'outline'}>{row.status}</Badge>
                        {row.id === currentUserId ? <Badge variant="secondary">You</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${row.name}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          openViewModal(row.id)
                        }}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {currentRows.length} of {filtered.length} entries
            </span>
            <div className="flex flex-wrap items-center gap-2">
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

      {isMobile ? (
        <Sheet open={Boolean(activeClient)} onOpenChange={(open) => (!open ? closeViewModal() : null)}>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
            {activeClient ? (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {activeClient.name}
                    {activeClient.id === currentUserId ? <Badge variant="secondary">You</Badge> : null}
                  </SheetTitle>
                  <SheetDescription>View client details and run quick actions.</SheetDescription>
                </SheetHeader>
                <div className="space-y-3 px-4 pb-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="break-all">{activeClient.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p>{activeClient.phone}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="capitalize">{activeClient.role}</Badge>
                    <Badge variant={activeClient.status === 'active' ? 'secondary' : 'outline'} className="capitalize">
                      {activeClient.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 pt-1">
                    <Button className="w-full" variant="outline" onClick={() => runAction('Edit client flow opened')}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="ghost">
                          {activeClient.status === 'active' ? 'Suspend' : 'Unsuspend'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {activeClient.status === 'active' ? 'Suspend client?' : 'Unsuspend client?'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This change keeps all historical records and can be reversed later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => toggleSuspend(activeClient.id)}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="destructive" disabled={activeClient.id === currentUserId}>
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action removes the profile from the list. Continue only if you are sure.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteClient(activeClient.id)}>
                            Confirm delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </>
            ) : null}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={Boolean(activeClient)} onOpenChange={(open) => (!open ? closeViewModal() : null)}>
          <DialogContent className="sm:max-w-xl">
            {activeClient ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {activeClient.name}
                    {activeClient.id === currentUserId ? <Badge variant="secondary">You</Badge> : null}
                  </DialogTitle>
                  <DialogDescription>View client details and run quick actions.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p>{activeClient.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p>{activeClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="capitalize">{activeClient.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="capitalize">{activeClient.status}</p>
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Button variant="outline" onClick={() => runAction('Edit client flow opened')}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={activeClient.id === currentUserId}>
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action removes the profile from the list. Continue only if you are sure.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteClient(activeClient.id)}>
                            Confirm delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost">{activeClient.status === 'active' ? 'Suspend' : 'Unsuspend'}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {activeClient.status === 'active' ? 'Suspend client?' : 'Unsuspend client?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This change keeps all historical records and can be reversed later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toggleSuspend(activeClient.id)}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open)
          if (!open) setSaveFeedback(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add client</DialogTitle>
            <DialogDescription>Create a client profile and save it to Supabase.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <Input
              value={newClientFirstName}
              onChange={(event) => setNewClientFirstName(event.target.value)}
              placeholder="First name"
            />
            <Input
              value={newClientLastName}
              onChange={(event) => setNewClientLastName(event.target.value)}
              placeholder="Last name"
            />
            <Input
              type="email"
              value={newClientEmail}
              onChange={(event) => setNewClientEmail(event.target.value)}
              placeholder="Email"
            />
            <Input
              value={newClientPhone}
              onChange={(event) => setNewClientPhone(event.target.value)}
              placeholder="Phone (optional)"
            />
            {saveFeedback ? (
              <Alert variant={saveFeedback.type === 'error' ? 'destructive' : 'default'}>
                <AlertTitle>{saveFeedback.type === 'success' ? 'Successfully saved' : 'Error'}</AlertTitle>
                <AlertDescription>{saveFeedback.message}</AlertDescription>
              </Alert>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={creatingClient}>
              Cancel
            </Button>
            <Button onClick={() => void addClient()} disabled={creatingClient}>
              {creatingClient ? 'Saving...' : 'Save client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
