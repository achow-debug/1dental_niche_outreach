'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
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

const PAGE_SIZE = 6

export default function BookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>(BOOKINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'confirmed' | 'cancelled' | 'no_show'
  >('all')
  const [page, setPage] = useState(1)
  const [selectedBookingId, setSelectedBookingId] = useState<string>(BOOKINGS[0]?.id ?? '')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!term) return true
      return row.clientName.toLowerCase().includes(term) || row.treatmentType.toLowerCase().includes(term)
    })
  }, [rows, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const currentRows = filtered.slice(start, start + PAGE_SIZE)
  const selected = rows.find((row) => row.id === selectedBookingId) ?? null

  function runAction(message: string) {
    toast({ title: message, description: 'Mock action only. API wiring comes next.' })
  }

  function updateStatus(id: string, status: BookingRow['status']) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)))
    runAction(`Booking marked ${status.replace('_', ' ')}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">Operational table with quick actions and safeguarded mutations.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full">
            Open today&apos;s bookings
          </Button>
          <Button className="rounded-full">
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
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="relative sm:col-span-2">
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
            <Select
              value={statusFilter}
              onValueChange={(value: 'all' | 'pending' | 'confirmed' | 'cancelled' | 'no_show') => {
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
          </div>

          <div className="space-y-3 md:hidden">
            {currentRows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-border/70 p-3"
                onClick={() => setSelectedBookingId(row.id)}
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
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
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

        <Card className="glass-surface">
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
                <Button variant="outline" size="sm" className="w-full" onClick={() => runAction('Full relation graph opened')}>
                  Open related records
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">Select a booking to inspect related data.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
