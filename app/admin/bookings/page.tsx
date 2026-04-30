'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type { BookingRow } from '@/lib/mocks/admin'
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
import { Label } from '@/components/ui/label'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const PAGE_SIZE = 6
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

type ClientOption = { id: string; label: string }
type SessionTypeOption = { id: string; title: string; priceGbp: number }
type DatePreset = 'all' | 'today' | 'next_7_days' | 'next_30_days' | 'this_month' | 'custom'
type SortField = 'clientName' | 'treatmentType' | 'date' | 'price' | 'status'
type SortDirection = 'asc' | 'desc'

function startOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

function toDateInputValue(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toTimeInputValue(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0')
  const minutes = String(value.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export default function BookingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rows, setRows] = useState<BookingRow[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([])
  const [sessionTypeOptions, setSessionTypeOptions] = useState<SessionTypeOption[]>([])
  const [bookingUserId, setBookingUserId] = useState('')
  const [bookingSessionTypeId, setBookingSessionTypeId] = useState('')
  const [creatingBooking, setCreatingBooking] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [treatmentFilter, setTreatmentFilter] = useState('all')
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string>('')
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const treatmentOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.treatmentType))).sort((a, b) => a.localeCompare(b)),
    [rows]
  )
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
    []
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const now = new Date()
    const todayStart = startOfDay(now)
    const customStart = customStartDate ? startOfDay(new Date(customStartDate)) : null
    const customEnd = customEndDate ? endOfDay(new Date(customEndDate)) : null

    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (treatmentFilter !== 'all' && row.treatmentType !== treatmentFilter) return false

      const bookingDate = new Date(`${row.date}T12:00:00`)
      if (datePreset === 'today') {
        if (bookingDate < todayStart || bookingDate > endOfDay(todayStart)) return false
      } else if (datePreset === 'next_7_days') {
        const rangeEnd = endOfDay(new Date(todayStart.getTime() + 6 * 24 * 60 * 60 * 1000))
        if (bookingDate < todayStart || bookingDate > rangeEnd) return false
      } else if (datePreset === 'next_30_days') {
        const rangeEnd = endOfDay(new Date(todayStart.getTime() + 29 * 24 * 60 * 60 * 1000))
        if (bookingDate < todayStart || bookingDate > rangeEnd) return false
      } else if (datePreset === 'this_month') {
        const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1)
        const monthEnd = endOfDay(new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0))
        if (bookingDate < monthStart || bookingDate > monthEnd) return false
      } else if (datePreset === 'custom') {
        if (customStart && bookingDate < customStart) return false
        if (customEnd && bookingDate > customEnd) return false
      }

      if (!term) return true
      return row.clientName.toLowerCase().includes(term) || row.treatmentType.toLowerCase().includes(term)
    })
  }, [rows, search, statusFilter, treatmentFilter, datePreset, customStartDate, customEndDate])

  const sortedRows = useMemo(() => {
    const value = [...filtered]
    value.sort((a, b) => {
      let result = 0
      if (sortField === 'clientName') result = a.clientName.localeCompare(b.clientName)
      if (sortField === 'treatmentType') result = a.treatmentType.localeCompare(b.treatmentType)
      if (sortField === 'date') result = new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
      if (sortField === 'price') result = a.price - b.price
      if (sortField === 'status') result = a.status.localeCompare(b.status)
      return sortDirection === 'asc' ? result : -result
    })
    return value
  }, [filtered, sortField, sortDirection])

  const selected = sortedRows.find((row) => row.id === selectedBookingId) ?? null

  useEffect(() => {
    if (!selected && filtered.length > 0) {
      setSelectedBookingId(filtered[0].id)
    }
    if (filtered.length === 0) {
      setSelectedBookingId('')
      setMobileInspectorOpen(false)
    }
  }, [filtered, selected])

  const loadBookings = useCallback(async () => {
    const res = await fetch('/api/admin/bookings')
    const payload = (await res.json().catch(() => ({}))) as { bookings?: BookingRow[]; error?: string }
    if (!res.ok) {
      throw new Error(payload.error ?? 'Failed to load bookings')
    }
    setRows(payload.bookings ?? [])
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await loadBookings()
        if (!cancelled) setLoadError(null)
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load bookings')
      } finally {
        if (!cancelled) setLoadingBookings(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadBookings])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const supabase = createSupabaseClient()
      let { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, full_name, email')
        .in('role', ['user', 'client'])
        .order('created_at', { ascending: false })

      if (pErr) {
        const message = (pErr.message ?? '').toLowerCase()
        if (message.includes('column profiles.first_name does not exist') || message.includes('column profiles.last_name does not exist')) {
          const fallback = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('role', ['user', 'client'])
            .order('created_at', { ascending: false })
          profiles = fallback.data
          pErr = fallback.error
        }
      }

      if (pErr) {
        const message = (pErr.message ?? '').toLowerCase()
        if (message.includes('column profiles.email does not exist')) {
          const fallback = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('role', ['user', 'client'])
            .order('created_at', { ascending: false })
          profiles = fallback.data
          pErr = fallback.error
        }
      }

      if (pErr || cancelled) return

      const opts: ClientOption[] = (profiles ?? []).map((p) => {
        const r = p as {
          id: string
          first_name: string | null
          last_name: string | null
          full_name: string | null
          email: string | null
        }
        const parts = [r.first_name?.trim(), r.last_name?.trim()].filter(Boolean)
        const name = parts.length ? parts.join(' ') : r.full_name?.trim() || r.email?.trim() || 'Client'
        const label = r.email?.trim() ? `${name} (${r.email})` : name
        return { id: r.id, label }
      })
      setClientOptions(opts)

      let { data: types, error: tErr } = await supabase
        .from('session_types')
        .select('id, title, price_cents')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('title', { ascending: true })

      if (tErr) {
        const message = (tErr.message ?? '').toLowerCase()
        if (message.includes('column session_types.deleted_at does not exist')) {
          const fallback = await supabase
            .from('session_types')
            .select('id, title, price_cents')
            .eq('is_active', true)
            .order('title', { ascending: true })
          types = fallback.data
          tErr = fallback.error
        }
      }

      if (tErr || cancelled) return
      setSessionTypeOptions(
        (types ?? []).map((t) => ({
          id: t.id as string,
          title: t.title as string,
          priceGbp: Number(((t as { price_cents?: number | null }).price_cents ?? 0) / 100),
        })),
      )
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const clientId = searchParams.get('clientId')
    const clientName = searchParams.get('clientName')
    if (clientId) {
      setBookingUserId(clientId)
      setCreateDialogOpen(true)
      return
    }
    if (!clientName) return
    const match = clientOptions.find((c) => c.label.toLowerCase().includes(clientName.toLowerCase()))
    if (match) {
      setBookingUserId(match.id)
      setCreateDialogOpen(true)
    }
  }, [clientOptions, searchParams])

  useEffect(() => {
    if (!createDialogOpen) return
    if (!newDate.trim()) {
      setNewDate(toDateInputValue(new Date()))
    }
    if (!newTime.trim()) {
      const now = new Date()
      const rounded = new Date(now.getTime())
      rounded.setSeconds(0, 0)
      // Default to the next half-hour slot so the field is always valid.
      const minutes = rounded.getMinutes()
      rounded.setMinutes(minutes <= 30 ? 30 : 60)
      setNewTime(toTimeInputValue(rounded))
    }
  }, [createDialogOpen, newDate, newTime])

  useEffect(() => {
    if (!bookingSessionTypeId) return
    if (newPrice.trim() !== '') return
    const selectedType = sessionTypeOptions.find((option) => option.id === bookingSessionTypeId)
    if (!selectedType) return
    setNewPrice(selectedType.priceGbp.toFixed(2))
  }, [bookingSessionTypeId, sessionTypeOptions, newPrice])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const currentRows = sortedRows.slice(start, start + PAGE_SIZE)

  function runAction(message: string) {
    toast({ title: message })
  }

  async function updateStatus(id: string, status: BookingRow['status']) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const payload = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      toast({ title: 'Update failed', description: payload.error ?? 'Request failed' })
      return
    }
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
    toast({ title: `Booking marked ${status.replace('_', ' ')}` })
  }

  async function createBooking() {
    const selectedType = sessionTypeOptions.find((option) => option.id === bookingSessionTypeId)
    const trimmedPrice = newPrice.trim()
    const fallbackPrice = selectedType?.priceGbp ?? 0
    const price = trimmedPrice === '' ? fallbackPrice : Number(trimmedPrice)

    const missingFields: string[] = []
    if (!bookingUserId) missingFields.push('client')
    if (!bookingSessionTypeId) missingFields.push('treatment template')
    if (!newDate.trim()) missingFields.push('date')
    if (!newTime.trim()) missingFields.push('time')
    if (Number.isNaN(price)) missingFields.push('price')

    if (missingFields.length > 0) {
      const message = `Missing required fields: ${missingFields.join(', ')}.`
      setSaveFeedback({
        type: 'error',
        message,
      })
      toast({
        title: 'Missing booking details',
        description: message,
      })
      return
    }

    const startsAt = new Date(`${newDate.trim()}T${newTime.trim()}`)
    if (Number.isNaN(startsAt.getTime())) {
      setSaveFeedback({ type: 'error', message: 'Check the date and time fields.' })
      toast({ title: 'Invalid date or time', description: 'Check the date and time fields.' })
      return
    }

    setCreatingBooking(true)
    setSaveFeedback(null)
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: bookingUserId,
        sessionTypeId: bookingSessionTypeId,
        startsAt: startsAt.toISOString(),
        priceGbp: price,
      }),
    })
    const payload = (await res.json().catch(() => ({}))) as { error?: string; bookingId?: string }
    setCreatingBooking(false)

    if (!res.ok) {
      setSaveFeedback({ type: 'error', message: payload.error ?? 'Request failed' })
      toast({ title: 'Booking not saved', description: payload.error ?? 'Request failed' })
      return
    }

    setBookingUserId('')
    setBookingSessionTypeId('')
    setNewDate('')
    setNewTime('')
    setNewPrice('')
    setSaveFeedback({ type: 'success', message: 'Booking was saved successfully in Supabase (sessions + bookings).' })
    await loadBookings()
    if (payload.bookingId) setSelectedBookingId(payload.bookingId)
    toast({
      title: 'Input acknowledged',
      description: 'Booking was saved successfully in Supabase (sessions + bookings).',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">Operational table with quick actions and safeguarded mutations.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setDatePreset('today')
              setFiltersOpen(true)
              setPage(1)
            }}
          >
            Open today&apos;s bookings
          </Button>
          <Button className="rounded-full" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create booking
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Booking ledger</CardTitle>
            <CardDescription>
              Master feed with lifecycle management and relation-aware actions.
            </CardDescription>
            {loadError ? <p className="text-xs text-destructive">Error loading bookings: {loadError}</p> : null}
          </CardHeader>
          <CardContent className="space-y-4">
          {loadingBookings ? (
            <div className="rounded-lg border border-border/70 p-3 text-sm text-muted-foreground">Loading bookings…</div>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search client or treatment"
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => setFiltersOpen((prev) => !prev)} className="sm:w-auto">
              <SlidersHorizontal className="mr-2 size-4" />
              {filtersOpen ? 'Hide filters' : 'Filters'}
            </Button>
          </div>
          {filtersOpen ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                  value={statusFilter}
                  onValueChange={(value: StatusFilter) => {
                    setStatusFilter(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="no_show">No show</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={treatmentFilter}
                  onValueChange={(value) => {
                    setTreatmentFilter(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Treatment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All treatments</SelectItem>
                    {treatmentOptions.map((treatment) => (
                      <SelectItem key={treatment} value={treatment}>
                        {treatment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={datePreset}
                  onValueChange={(value: DatePreset) => {
                    setDatePreset(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="next_7_days">Next 7 days</SelectItem>
                    <SelectItem value="next_30_days">Next 30 days</SelectItem>
                    <SelectItem value="this_month">This month</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortField}
                  onValueChange={(value: SortField) => {
                    setSortField(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clientName">Sort: Client</SelectItem>
                    <SelectItem value="treatmentType">Sort: Treatment type</SelectItem>
                    <SelectItem value="date">Sort: Date</SelectItem>
                    <SelectItem value="price">Sort: Price</SelectItem>
                    <SelectItem value="status">Sort: Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                  value={sortDirection}
                  onValueChange={(value: SortDirection) => {
                    setSortDirection(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
                {datePreset === 'custom' ? (
                  <>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(event) => {
                        setCustomStartDate(event.target.value)
                        setPage(1)
                      }}
                    />
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(event) => {
                        setCustomEndDate(event.target.value)
                        setPage(1)
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCustomStartDate('')
                        setCustomEndDate('')
                        setPage(1)
                      }}
                    >
                      Clear custom dates
                    </Button>
                  </>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="space-y-3 md:hidden">
            {currentRows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-border/70 p-3"
                onClick={() => {
                  setSelectedBookingId(row.id)
                  setMobileInspectorOpen(true)
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{row.clientName}</p>
                  <Badge variant={row.status === 'confirmed' ? 'secondary' : 'outline'}>{row.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{row.treatmentType}</p>
                <p className="text-xs text-muted-foreground">
                  {row.date} at {row.time}
                </p>
                <p className="text-xs font-medium">{currencyFormatter.format(row.price)}</p>
              </div>
            ))}
          </div>

          <Dialog open={mobileInspectorOpen} onOpenChange={setMobileInspectorOpen}>
            <DialogContent className="glass-surface-elevated max-h-[85dvh] w-[calc(100%-1.5rem)] max-w-sm overflow-y-auto rounded-2xl border-white/35 p-4 md:hidden">
              <DialogHeader>
                <DialogTitle>Booking details</DialogTitle>
                <DialogDescription>Quick inspector for the selected client booking.</DialogDescription>
              </DialogHeader>
              {selected ? <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{selected.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p>{selected.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service template</p>
                  <p>{selected.treatmentType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p>{currencyFormatter.format(selected.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lifecycle status</p>
                  <Badge variant={selected.status === 'confirmed' ? 'secondary' : 'outline'}>
                    {selected.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p>
                    {selected.date} at {selected.time}
                  </p>
                </div>
              </div> : null}
            </DialogContent>
          </Dialog>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[1%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((row) => (
                    <TableRow key={row.id} onClick={() => setSelectedBookingId(row.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{row.clientName}</TableCell>
                    <TableCell>{row.treatmentType}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{currencyFormatter.format(row.price)}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'confirmed' ? 'secondary' : 'outline'}>
                        {row.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => updateStatus(row.id, 'confirmed')}>Confirm</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => runAction('Reschedule flow opened')}>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => updateStatus(row.id, 'no_show')}>
                            Mark no-show
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(event) => event.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                Cancel booking
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This records cancellation and preserves audit history.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep booking</AlertDialogCancel>
                                <AlertDialogAction onClick={() => updateStatus(row.id, 'cancelled')}>
                                  Confirm cancellation
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

        <Card className="glass-surface hidden xl:block">
          <CardHeader>
            <CardTitle>Detail inspector</CardTitle>
            <CardDescription>Relational snapshot for selected booking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {selected ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{selected.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p>{selected.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service template</p>
                  <p>{selected.treatmentType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p>{currencyFormatter.format(selected.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Financial status</p>
                  <Badge variant="outline">Pay in practice</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lifecycle status</p>
                  <Badge variant={selected.status === 'confirmed' ? 'secondary' : 'outline'}>
                    {selected.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p>
                    {selected.date} at {selected.time}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/admin/clients?search=${encodeURIComponent(selected.clientName)}`)}
                >
                  Open related records
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">Select a booking to inspect related data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open)
          if (!open) setSaveFeedback(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create booking</DialogTitle>
            <DialogDescription>
              Creates a calendar session and a booking for the selected client profile (sessions and bookings tables).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={bookingUserId || undefined} onValueChange={setBookingUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client profile" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Treatment (session type)</Label>
              <Select value={bookingSessionTypeId || undefined} onValueChange={setBookingSessionTypeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypeOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} />
              <Input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} />
            </div>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={newPrice}
              onChange={(event) => setNewPrice(event.target.value)}
              placeholder="Price (GBP)"
            />
            {saveFeedback ? (
              <Alert variant={saveFeedback.type === 'error' ? 'destructive' : 'default'}>
                <AlertTitle>{saveFeedback.type === 'success' ? 'Successfully saved' : 'Error'}</AlertTitle>
                <AlertDescription>{saveFeedback.message}</AlertDescription>
              </Alert>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={creatingBooking}>
              Cancel
            </Button>
            <Button onClick={() => void createBooking()} disabled={creatingBooking}>
              {creatingBooking ? 'Saving…' : 'Create booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
