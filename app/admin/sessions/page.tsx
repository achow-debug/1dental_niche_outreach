'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import type { ActiveService, ServiceCategory, ServiceTemplate } from '@/lib/mocks/admin'
import { loadServiceCatalog } from '@/lib/admin/service-catalog'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'

function addMinutesToDateTime(iso: string, minutes: number) {
  const start = new Date(iso)
  const end = new Date(start.getTime() + minutes * 60_000)
  return end.toISOString().slice(0, 16)
}

export default function AdminSessionsPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [services, setServices] = useState<ActiveService[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [newCategoryName, setNewCategoryName] = useState('')
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

  const durationPreview = useMemo(() => {
    const duration = Number(newServiceDuration) || 0
    if (!newServiceDate || !newServiceTime || duration <= 0) return null
    const start = `${newServiceDate}T${newServiceTime}`
    return addMinutesToDateTime(start, duration)
  }, [newServiceDate, newServiceTime, newServiceDuration])

  const reloadCatalog = useCallback(async () => {
    const supabase = createSupabaseClient()
    const { categories: c, templates: t, services: s } = await loadServiceCatalog(supabase)
    setCategories(c)
    setTemplates(t)
    setServices(s)
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await reloadCatalog()
        if (!cancelled) {
          setLoadError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load catalog')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [reloadCatalog])

  async function createCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/session-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Category not saved', description: payload.error ?? 'Request failed' })
        return
      }
      setNewCategoryName('')
      await reloadCatalog()
      toast({ title: 'Category created', description: 'Saved to session_categories in Supabase.' })
    } finally {
      setSaving(false)
    }
  }

  async function createTemplate() {
    const title = newTemplateTitle.trim()
    const categoryId = newTemplateCategoryId.trim()
    const durationMinutes = Number(newTemplateDuration) || 30
    const priceGbp = Number(newTemplatePrice)
    if (!title || !categoryId) {
      toast({ title: 'Missing fields', description: 'Title and category are required.' })
      return
    }
    if (!Number.isFinite(priceGbp) || priceGbp < 0) {
      toast({ title: 'Invalid price', description: 'Enter a valid base price.' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/session-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          title,
          durationMinutes,
          priceGbp,
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Template not saved', description: payload.error ?? 'Request failed' })
        return
      }
      setNewTemplateTitle('')
      setNewTemplateCategoryId('')
      await reloadCatalog()
      toast({ title: 'Template created', description: 'Saved to session_types in Supabase.' })
    } finally {
      setSaving(false)
    }
  }

  async function createServiceSlot() {
    if (!newServiceTemplateId || !newServiceDate || !newServiceTime) {
      toast({ title: 'Missing fields', description: 'Template, date, and time are required.' })
      return
    }
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
  }

  async function toggleCategoryActive(category: ServiceCategory) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !category.isActive }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Category not updated', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: 'Category updated' })
    } finally {
      setSaving(false)
    }
  }

  async function renameCategory(category: ServiceCategory) {
    const nextName = window.prompt('Category name', category.name)?.trim()
    if (!nextName || nextName === category.name) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nextName }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        toast({ title: 'Category rename failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: 'Category renamed' })
    } finally {
      setSaving(false)
    }
  }

  async function duplicateTemplate(templateId: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/session-types/${templateId}`, {
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
      toast({ title: 'Template duplicated' })
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
        toast({ title: 'Service status update failed', description: payload.error ?? 'Request failed' })
        return
      }
      await reloadCatalog()
      toast({ title: `Service marked ${status}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Catalog management</h1>
        <p className="text-sm text-muted-foreground">
          Categories, service templates, and active service scheduling in one admin workspace.
        </p>
        {loadError ? <p className="text-xs text-destructive">Could not load catalog: {loadError}</p> : null}
        {loading ? <p className="text-xs text-muted-foreground">Loading from Supabase…</p> : null}
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="templates">Service templates</TabsTrigger>
          <TabsTrigger value="active-services">Active services</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card className="glass-surface">
            <CardHeader>
              <CardTitle>Service categories</CardTitle>
              <CardDescription>Organise service families with full CRUD-ready controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="Add category name"
                />
                <Button disabled={saving || !newCategoryName.trim() || loading} onClick={() => void createCategory()}>
                  {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                  Create
                </Button>
              </div>
              <div className="grid gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-2 rounded-lg border border-border/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={category.isActive ? 'secondary' : 'outline'}>
                        {category.isActive ? 'Active' : 'Archived'}
                      </Badge>
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => void renameCategory(category)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => void toggleCategoryActive(category)}
                      >
                        {category.isActive ? 'Archive' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="glass-surface">
            <CardHeader>
              <CardTitle>Service templates</CardTitle>
              <CardDescription>Reusable service definitions with base pricing and subscriptions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                <Input value={newTemplateTitle} onChange={(event) => setNewTemplateTitle(event.target.value)} placeholder="Service title" />
                <Select value={newTemplateCategoryId} onValueChange={setNewTemplateCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input value={newTemplatePrice} onChange={(event) => setNewTemplatePrice(event.target.value)} type="number" min={0} placeholder="Base price" />
                <Input
                  value={newTemplateDuration}
                  onChange={(event) => setNewTemplateDuration(event.target.value)}
                  type="number"
                  min={5}
                  placeholder="Duration minutes"
                />
                <Select
                  value={newTemplateSubscription}
                  onValueChange={(value: 'none' | 'monthly' | 'quarterly') => setNewTemplateSubscription(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No subscription</SelectItem>
                    <SelectItem value="monthly">Monthly plan</SelectItem>
                    <SelectItem value="quarterly">Quarterly plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                disabled={saving || !newTemplateTitle || !newTemplateCategoryId || loading}
                onClick={() => void createTemplate()}
              >
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                Add template
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
                      {template.category} · GBP {template.basePrice} · {template.defaultDurationMinutes} min ·{' '}
                      {template.subscription === 'none' ? 'No subscription' : `${template.subscription} plan`}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => void duplicateTemplate(template.id)}>
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
                Date/time scheduling with duration calculation, price override, and one-click status toggles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service template</Label>
                  <Select value={newServiceTemplateId} onValueChange={setNewServiceTemplateId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select template" />
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
                  <Label>Clinician</Label>
                  <Input value={newServiceClinician} onChange={(event) => setNewServiceClinician(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={newServiceDate} onChange={(event) => setNewServiceDate(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={newServiceTime} onChange={(event) => setNewServiceTime(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input type="number" min={5} value={newServiceDuration} onChange={(event) => setNewServiceDuration(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Price override (optional)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newServicePriceOverride}
                    onChange={(event) => setNewServicePriceOverride(event.target.value)}
                    placeholder="Leave blank to use template price"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm">
                <p className="font-medium">Duration preview</p>
                <p className="text-muted-foreground">
                  {durationPreview
                    ? `Slot ends at ${durationPreview.replace('T', ' ')}`
                    : 'Select valid date, time, and duration to preview end time.'}
                </p>
              </div>

              <Button disabled={saving || !newServiceTemplateId || !newServiceDate || !newServiceTime || loading} onClick={() => void createServiceSlot()}>
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                Create service slot
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
                      {service.priceOverride != null ? `Price override: GBP ${service.priceOverride}` : 'Using template price'}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => void updateServiceStatus(service.id, 'cancelled')}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => void updateServiceStatus(service.id, 'completed')}>
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
    </div>
  )
}
