'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, MoreHorizontal, Plus, Search } from 'lucide-react'
import { loadServiceCatalog } from '@/lib/admin/service-catalog'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type { ActiveService, ServiceCategory, ServiceTemplate, TreatmentTypeRow } from '@/lib/mocks/admin'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const PAGE_SIZE = 5

function addMinutesToDateTime(iso: string, minutes: number) {
  const start = new Date(iso)
  const end = new Date(start.getTime() + minutes * 60_000)
  return end.toISOString().slice(0, 16)
}

export default function TreatmentTypesPage() {
  const [rows, setRows] = useState<TreatmentTypeRow[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [services, setServices] = useState<ActiveService[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'updated'>('updated')
  const [page, setPage] = useState(1)
  const [saving, setSaving] = useState(false)
  const [openCreateType, setOpenCreateType] = useState(false)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)

  const [typeName, setTypeName] = useState('')
  const [typeCategory, setTypeCategory] = useState('')
  const [typeDuration, setTypeDuration] = useState('30')
  const [typePrice, setTypePrice] = useState('95')
  const [typeSubscription, setTypeSubscription] = useState<'none' | 'monthly' | 'quarterly'>('none')

  const [newTemplateTitle, setNewTemplateTitle] = useState('')
  const [newTemplateCategoryId, setNewTemplateCategoryId] = useState('')
  const [newTemplatePrice, setNewTemplatePrice] = useState('95')
  const [newTemplateDuration, setNewTemplateDuration] = useState('30')
  const [newTemplateSubscription, setNewTemplateSubscription] = useState<'none' | 'monthly' | 'quarterly'>('none')

  const [newServiceTemplateId, setNewServiceTemplateId] = useState('')
  const [newServiceDate, setNewServiceDate] = useState('2026-04-27')
  const [newServiceTime, setNewServiceTime] = useState('09:00')
  const [newServiceClinician, setNewServiceClinician] = useState('Dr. Lin')
  const [newServiceDuration, setNewServiceDuration] = useState('30')
  const [newServicePriceOverride, setNewServicePriceOverride] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const next = rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!term) return true
      return row.name.toLowerCase().includes(term) || row.category.toLowerCase().includes(term)
    })

    return next.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  }, [rows, search, statusFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const currentRows = filtered.slice(start, start + PAGE_SIZE)

  const durationPreview = useMemo(() => {
    const duration = Number(newServiceDuration) || 0
    if (!newServiceDate || !newServiceTime || duration <= 0) return null
    const startIso = `${newServiceDate}T${newServiceTime}`
    return addMinutesToDateTime(startIso, duration)
  }, [newServiceDate, newServiceTime, newServiceDuration])

  const reloadCatalog = useCallback(async () => {
    const supabase = createSupabaseClient()
    const { categories: c, templates: t, services: s, treatmentTypeRows } = await loadServiceCatalog(supabase)
    setCategories(c)
    setTemplates(t)
    setServices(s)
    setRows(treatmentTypeRows)
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await reloadCatalog()
        if (!cancelled) setCatalogError(null)
      } catch (e) {
        if (!cancelled) setCatalogError(e instanceof Error ? e.message : 'Failed to load catalog')
      } finally {
        if (!cancelled) setCatalogLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [reloadCatalog])

  const editingType = useMemo(() => rows.find((row) => row.id === editingTypeId) ?? null, [rows, editingTypeId])

  function resetTypeForm() {
    setTypeName('')
    setTypeCategory('')
    setTypeDuration('30')
    setTypePrice('95')
    setTypeSubscription('none')
  }

  async function createTreatmentType() {
    const title = typeName.trim()
    const catName = typeCategory.trim()
    const durationMinutes = Number(typeDuration) || 30
    const priceGbp = Number(typePrice)
    if (!title || !catName) {
      toast({ title: 'Missing fields', description: 'Name and category are required.' })
      return
    }
    if (!Number.isFinite(priceGbp) || priceGbp < 0) {
      toast({ title: 'Invalid price', description: 'Enter a valid price.' })
      return
    }
    const cat = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase())
    if (!cat) {
      toast({
        title: 'Unknown category',
        description: 'Use a category name that exists in Supabase (see reusable templates tab), or create one under Catalog management (/admin/sessions).',
      })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/session-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: cat.id,
          title,
          durationMinutes,
          priceGbp,
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Not saved', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      setOpenCreateType(false)
      resetTypeForm()
      toast({ title: 'Treatment type created', description: 'Saved to session_types in Supabase.' })
    } finally {
      setSaving(false)
    }
  }

  function startEdit(row: TreatmentTypeRow) {
    setEditingTypeId(row.id)
    setTypeName(row.name)
    setTypeCategory(row.category)
    setTypeDuration(String(row.durationMinutes))
    setTypePrice(String(row.price))
    setTypeSubscription('none')
  }

  async function saveEdit() {
    if (!editingTypeId) return
    const cat = categories.find((c) => c.name.toLowerCase() === typeCategory.trim().toLowerCase())
    if (!cat) {
      toast({ title: 'Unknown category', description: 'Pick a category that exists.' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-types/${editingTypeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: typeName.trim(),
          categoryId: cat.id,
          durationMinutes: Number(typeDuration) || 30,
          priceGbp: Number(typePrice) || 0,
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Update failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      setEditingTypeId(null)
      resetTypeForm()
      toast({ title: 'Treatment type updated' })
    } finally {
      setSaving(false)
    }
  }

  async function archiveRow(id: string, isActive: boolean) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Status update failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: 'Treatment type status updated' })
    } finally {
      setSaving(false)
    }
  }

  async function duplicateType(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Duplicate failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: 'Treatment type duplicated' })
    } finally {
      setSaving(false)
    }
  }

  async function toggleTemplateActive(templateId: string, isActive: boolean) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-types/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Template update failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: 'Template updated' })
    } finally {
      setSaving(false)
    }
  }

  async function duplicateTemplate(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Template duplicate failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: 'Template duplicated' })
    } finally {
      setSaving(false)
    }
  }

  async function updateServiceStatus(id: string, status: ActiveService['status']) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/practice-sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Slot update failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: `Slot marked ${status}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services (Treatment Types)</h1>
          <p className="text-sm text-muted-foreground">
            Merged catalog + treatment types workspace with clear form settings and working actions.
          </p>
          {catalogError ? <p className="text-xs text-destructive">Could not load catalog: {catalogError}</p> : null}
          {catalogLoading ? <p className="text-xs text-muted-foreground">Loading catalog from Supabase…</p> : null}
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setOpenCreateType(true)}>
          <Plus className="mr-2 size-4" />
          New treatment type
        </Button>
      </div>

      <Tabs defaultValue="treatment-types" className="space-y-4">
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="treatment-types">Treatment types</TabsTrigger>
          <TabsTrigger value="service-templates">Reusable service templates</TabsTrigger>
          <TabsTrigger value="active-services">Active services scheduler</TabsTrigger>
        </TabsList>

        <TabsContent value="treatment-types">
          <Card>
            <CardHeader>
              <CardTitle>Treatment type library</CardTitle>
              <CardDescription>Manage treatment types that power templates and slot scheduling.</CardDescription>
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
                    placeholder="Search treatment type or category"
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value: 'all' | 'active' | 'archived') => {
                      setStatusFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'updated') => setSortBy(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Recently updated</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 md:hidden">
                {currentRows.map((row) => (
                  <div key={row.id} className="rounded-lg border border-border/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{row.name}</p>
                      <Badge variant={row.status === 'active' ? 'secondary' : 'outline'}>{row.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{row.category}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {row.durationMinutes} min · GBP {row.price}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => void archiveRow(row.id, row.status === 'active')}>
                        {row.status === 'active' ? 'Archive' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[1%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.durationMinutes} min</TableCell>
                        <TableCell>GBP {row.price}</TableCell>
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
                              <DropdownMenuItem onSelect={() => startEdit(row)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => void duplicateType(row.id)}>
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(event) => event.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    {row.status === 'active' ? 'Archive' : 'Restore'}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {row.status === 'active' ? 'Archive treatment type?' : 'Restore treatment type?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action is reversible and preserves booking history references.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => void archiveRow(row.id, row.status === 'active')}>
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs">
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
        </TabsContent>

        <TabsContent value="service-templates">
          <Card className="glass-surface">
            <CardHeader>
              <CardTitle>Reusable service templates</CardTitle>
              <CardDescription>
                Define reusable services with explicit settings so admins know exactly what they configure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 rounded-lg border border-border/70 p-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="template-title">Template name</Label>
                  <Input
                    id="template-title"
                    value={newTemplateTitle}
                    onChange={(event) => setNewTemplateTitle(event.target.value)}
                    placeholder="e.g. Invisalign consultation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-category">Service category</Label>
                  <Select value={newTemplateCategoryId} onValueChange={setNewTemplateCategoryId}>
                    <SelectTrigger id="template-category" className="w-full">
                      <SelectValue placeholder="Select category for this template" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-price">Base price (GBP)</Label>
                  <Input
                    id="template-price"
                    value={newTemplatePrice}
                    onChange={(event) => setNewTemplatePrice(event.target.value)}
                    type="number"
                    min={0}
                    placeholder="Price used by default for new slots"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-duration">Default duration (minutes)</Label>
                  <Input
                    id="template-duration"
                    value={newTemplateDuration}
                    onChange={(event) => setNewTemplateDuration(event.target.value)}
                    type="number"
                    min={5}
                    placeholder="Used to calculate default end time"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="template-subscription">Subscription model</Label>
                  <Select
                    value={newTemplateSubscription}
                    onValueChange={(value: 'none' | 'monthly' | 'quarterly') => setNewTemplateSubscription(value)}
                  >
                    <SelectTrigger id="template-subscription" className="w-full">
                      <SelectValue placeholder="How this template behaves for recurring plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No subscription (one-off service)</SelectItem>
                      <SelectItem value="monthly">Monthly subscription service</SelectItem>
                      <SelectItem value="quarterly">Quarterly subscription service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                disabled={saving || catalogLoading || !newTemplateTitle.trim() || !newTemplateCategoryId}
                onClick={() =>
                  void (async () => {
                    const title = newTemplateTitle.trim()
                    const categoryId = newTemplateCategoryId.trim()
                    const durationMinutes = Number(newTemplateDuration) || 30
                    const priceGbp = Number(newTemplatePrice)
                    if (!title || !categoryId) return
                    if (!Number.isFinite(priceGbp) || priceGbp < 0) {
                      toast({ title: 'Invalid price', description: 'Enter a valid base price.' })
                      return
                    }
                    setSaving(true)
                    try {
                      const res = await fetch('/api/admin/session-types', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ categoryId, title, durationMinutes, priceGbp }),
                      })
                      const payload = (await res.json().catch(() => ({}))) as { error?: string }
                      if (!res.ok) {
                        toast({ title: 'Template not saved', description: payload.error ?? 'Request failed' })
                        return
                      }
                      setNewTemplateTitle('')
                      setNewTemplateCategoryId('')
                      await reloadCatalog()
                      toast({ title: 'Service template created', description: 'Saved to session_types in Supabase.' })
                    } finally {
                      setSaving(false)
                    }
                  })()
                }
              >
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                Create reusable template
              </Button>

              <div className="grid gap-3">
                {templates.map((template) => (
                  <div key={template.id} className="rounded-lg border border-border/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{template.title}</p>
                      <Badge variant={template.isActive ? 'secondary' : 'outline'}>
                        {template.isActive ? 'Active' : 'Archived'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Category: {template.category} · Base: GBP {template.basePrice} · Default duration:{' '}
                      {template.defaultDurationMinutes} min · Subscription:{' '}
                      {template.subscription === 'none' ? 'None' : template.subscription}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => void duplicateTemplate(template.id)}
                      >
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => void toggleTemplateActive(template.id, template.isActive)}
                      >
                        {template.isActive ? 'Archive' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-services">
          <Card className="glass-surface">
            <CardHeader>
              <CardTitle>Active services scheduler</CardTitle>
              <CardDescription>
                Create specific slots with date/time pickers, duration previews, and optional custom slot pricing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 rounded-lg border border-border/70 p-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Template for this slot</Label>
                  <Select value={newServiceTemplateId} onValueChange={setNewServiceTemplateId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose which reusable template this slot uses" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter((template) => template.isActive)
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned clinician</Label>
                  <Input value={newServiceClinician} onChange={(event) => setNewServiceClinician(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={newServiceDate} onChange={(event) => setNewServiceDate(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Start time</Label>
                  <Input type="time" value={newServiceTime} onChange={(event) => setNewServiceTime(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min={5}
                    value={newServiceDuration}
                    onChange={(event) => setNewServiceDuration(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custom slot price override (optional)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newServicePriceOverride}
                    onChange={(event) => setNewServicePriceOverride(event.target.value)}
                    placeholder="Leave empty to use template base price"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm">
                <p className="font-medium">Live duration calculation</p>
                <p className="text-muted-foreground">
                  {durationPreview
                    ? `This slot will end at ${durationPreview.replace('T', ' ')}`
                    : 'Choose date, time, and duration to preview end time.'}
                </p>
              </div>

              <Button
                disabled={saving || catalogLoading || !newServiceTemplateId || !newServiceDate || !newServiceTime}
                onClick={() =>
                  void (async () => {
                    const template = templates.find((item) => item.id === newServiceTemplateId)
                    if (!template) return
                    const start = new Date(`${newServiceDate}T${newServiceTime}`)
                    const duration = Number(newServiceDuration) || template.defaultDurationMinutes
                    const end = new Date(start.getTime() + duration * 60_000)
                    const priceTrim = newServicePriceOverride.trim()
                    const priceOverrideGbp = priceTrim === '' ? null : Number(priceTrim)
                    setSaving(true)
                    try {
                      const res = await fetch('/api/admin/practice-sessions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          sessionTypeId: newServiceTemplateId,
                          startsAt: start.toISOString(),
                          endsAt: end.toISOString(),
                          priceOverrideGbp: priceOverrideGbp != null && !Number.isNaN(priceOverrideGbp) ? priceOverrideGbp : null,
                          locationLabel: newServiceClinician.trim() || null,
                        }),
                      })
                      const payload = (await res.json().catch(() => ({}))) as { error?: string }
                      if (!res.ok) {
                        toast({ title: 'Slot not saved', description: payload.error ?? 'Request failed' })
                        return
                      }
                      await reloadCatalog()
                      toast({ title: 'Service slot created', description: 'Saved to sessions in Supabase.' })
                    } finally {
                      setSaving(false)
                    }
                  })()
                }
              >
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                Create slot
              </Button>

              <div className="grid gap-3">
                {services.map((service) => (
                  <div key={service.id} className="rounded-lg border border-border/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{service.templateTitle}</p>
                      <Badge variant={service.status === 'scheduled' ? 'secondary' : 'outline'}>{service.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {service.clinician} · {service.startsAt.replace('T', ' ')} to {service.endsAt.replace('T', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.priceOverride ? `Custom slot price: GBP ${service.priceOverride}` : 'Using template base price'}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => void updateServiceStatus(service.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => void updateServiceStatus(service.id, 'completed')}
                      >
                        Attend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={openCreateType} onOpenChange={setOpenCreateType}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create treatment type</DialogTitle>
            <DialogDescription>Define the core details used for this service type.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="type-name">Treatment name</Label>
              <Input id="type-name" value={typeName} onChange={(event) => setTypeName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type-category">Category</Label>
              <Input id="type-category" value={typeCategory} onChange={(event) => setTypeCategory(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="type-duration">Duration (minutes)</Label>
                <Input
                  id="type-duration"
                  type="number"
                  min={5}
                  value={typeDuration}
                  onChange={(event) => setTypeDuration(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type-price">Base price (GBP)</Label>
                <Input
                  id="type-price"
                  type="number"
                  min={0}
                  value={typePrice}
                  onChange={(event) => setTypePrice(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subscription type</Label>
              <Select value={typeSubscription} onValueChange={(value: 'none' | 'monthly' | 'quarterly') => setTypeSubscription(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No subscription</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateType(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving || !typeName.trim() || !typeCategory.trim()}
              onClick={createTreatmentType}
            >
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Save treatment type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingType)} onOpenChange={(open) => (!open ? setEditingTypeId(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit treatment type</DialogTitle>
            <DialogDescription>Update this treatment type configuration.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-type-name">Treatment name</Label>
              <Input id="edit-type-name" value={typeName} onChange={(event) => setTypeName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type-category">Category</Label>
              <Input id="edit-type-category" value={typeCategory} onChange={(event) => setTypeCategory(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type-duration">Duration (minutes)</Label>
                <Input
                  id="edit-type-duration"
                  type="number"
                  min={5}
                  value={typeDuration}
                  onChange={(event) => setTypeDuration(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type-price">Base price (GBP)</Label>
                <Input
                  id="edit-type-price"
                  type="number"
                  min={0}
                  value={typePrice}
                  onChange={(event) => setTypePrice(event.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTypeId(null)}>
              Cancel
            </Button>
            <Button disabled={saving || !typeName.trim() || !typeCategory.trim()} onClick={saveEdit}>
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
