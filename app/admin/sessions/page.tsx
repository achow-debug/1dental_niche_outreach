'use client'

import { useMemo, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import {
  ACTIVE_SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_TEMPLATES,
  type ActiveService,
  type ServiceCategory,
  type ServiceTemplate,
} from '@/lib/mocks/admin'
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
  const [categories, setCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES)
  const [templates, setTemplates] = useState<ServiceTemplate[]>(SERVICE_TEMPLATES)
  const [services, setServices] = useState<ActiveService[]>(ACTIVE_SERVICES)
  const [saving, setSaving] = useState(false)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newTemplateTitle, setNewTemplateTitle] = useState('')
  const [newTemplateCategory, setNewTemplateCategory] = useState('')
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

  async function withLoader(action: () => void, successMessage: string) {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 550))
    action()
    setSaving(false)
    toast({ title: successMessage, description: 'Mock persistence only for now.' })
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Catalog management</h1>
        <p className="text-sm text-muted-foreground">
          Categories, service templates, and active service scheduling in one admin workspace.
        </p>
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
                <Button
                  disabled={saving || !newCategoryName.trim()}
                  onClick={() =>
                    void withLoader(() => {
                      setCategories((prev) => [
                        ...prev,
                        {
                          id: `cat-${Date.now()}`,
                          name: newCategoryName.trim(),
                          description: 'New category',
                          isActive: true,
                        },
                      ])
                      setNewCategoryName('')
                    }, 'Category created')
                  }
                >
                  {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                  Create
                </Button>
              </div>
              <div className="grid gap-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col gap-2 rounded-lg border border-border/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={category.isActive ? 'secondary' : 'outline'}>
                        {category.isActive ? 'Active' : 'Archived'}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Edit category', description: 'Edit UI to be expanded in next pass.' })}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setCategories((prev) =>
                            prev.map((item) => (item.id === category.id ? { ...item, isActive: !item.isActive } : item)),
                          )
                        }
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
                <Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
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
                disabled={saving || !newTemplateTitle || !newTemplateCategory}
                onClick={() =>
                  void withLoader(() => {
                    setTemplates((prev) => [
                      ...prev,
                      {
                        id: `st-${Date.now()}`,
                        title: newTemplateTitle.trim(),
                        category: newTemplateCategory,
                        basePrice: Number(newTemplatePrice) || 0,
                        subscription: newTemplateSubscription,
                        defaultDurationMinutes: Number(newTemplateDuration) || 30,
                        isActive: true,
                      },
                    ])
                    setNewTemplateTitle('')
                    setNewTemplateCategory('')
                  }, 'Template created')
                }
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
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Template duplicated', description: 'Mock duplicate action complete.' })}>
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setTemplates((prev) =>
                            prev.map((item) => (item.id === template.id ? { ...item, isActive: !item.isActive } : item)),
                          )
                        }
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

              <Button
                disabled={saving || !newServiceTemplateId || !newServiceDate || !newServiceTime}
                onClick={() =>
                  void withLoader(() => {
                    const template = templates.find((item) => item.id === newServiceTemplateId)
                    if (!template) return
                    const startsAt = `${newServiceDate}T${newServiceTime}`
                    const duration = Number(newServiceDuration) || template.defaultDurationMinutes
                    const endsAt = addMinutesToDateTime(startsAt, duration)
                    setServices((prev) => [
                      ...prev,
                      {
                        id: `srv-${Date.now()}`,
                        templateTitle: template.title,
                        clinician: newServiceClinician,
                        startsAt,
                        endsAt,
                        priceOverride: newServicePriceOverride.trim() ? Number(newServicePriceOverride) : null,
                        status: 'scheduled',
                      },
                    ])
                  }, 'Service slot created')
                }
              >
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
                      {service.priceOverride ? `Price override: GBP ${service.priceOverride}` : 'Using template price'}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setServices((prev) => prev.map((row) => (row.id === service.id ? { ...row, status: 'cancelled' } : row)))}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setServices((prev) => prev.map((row) => (row.id === service.id ? { ...row, status: 'completed' } : row)))}>
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
