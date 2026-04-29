'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { BOOKINGS, type BookingRow } from '@/lib/mocks/admin'
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const PAGE_SIZE = 6
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'no_show'
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

export default function BookingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rows, setRows] = useState<BookingRow[]>(BOOKINGS)
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
  const [selectedBookingId, setSelectedBookingId] = useState<string>(BOOKINGS[0]?.id ?? '')
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newTreatmentType, setNewTreatmentType] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newPrice, setNewPrice] = useState('')

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

  useEffect(() => {
    const clientName = searchParams.get('clientName')
    if (!clientName) return
    const matchedClient = rows.find((row) => row.clientName.toLowerCase().includes(clientName.toLowerCase()))
    if (matchedClient) {
      setSearch(matchedClient.clientName)
      setSelectedBookingId(matchedClient.id)
    }
  }, [rows, searchParams])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const currentRows = sortedRows.slice(start, start + PAGE_SIZE)

  function runAction(message: string) {
    toast({ title: message, description: 'Mock action only. API wiring comes next.' })
  }

  function updateStatus(id: string, status: BookingRow['status']) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
    runAction(`Booking marked ${status.replace('_', ' ')}`)
  }

  function createBooking() {
    const clientName = newClientName.trim()
    const treatmentType = newTreatmentType.trim()
    const date = newDate.trim()
    const time = newTime.trim()
    const price = Number(newPrice)

    if (!clientName || !treatmentType || !date || !time || Number.isNaN(price)) {
      toast({
        title: 'Missing booking details',
        description: 'Client, treatment, date, time, and price are required.',
      })
      return
    }

    const created: BookingRow = {
      id: `bk-${crypto.randomUUID().slice(0, 8)}`,
      clientName,
      treatmentType,
      date,
      time,
      price,
      status: 'pending',
    }

    setRows((prev) => [created, ...prev])
    setSelectedBookingId(created.id)
    setCreateDialogOpen(false)
    setNewClientName('')
    setNewTreatmentType('')
    setNewDate('')
    setNewTime('')
    setNewPrice('')
    toast({
      title: 'Booking created',
      description: 'New booking was added to the ledger.',
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
          </CardHeader>
          <CardContent className="space-y-4">
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

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create booking</DialogTitle>
            <DialogDescription>Add a booking to the operations ledger.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <Input value={newClientName} onChange={(event) => setNewClientName(event.target.value)} placeholder="Client name" />
            <Input value={newTreatmentType} onChange={(event) => setNewTreatmentType(event.target.value)} placeholder="Treatment type" />
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
              placeholder="Price"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createBooking}>Create booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
