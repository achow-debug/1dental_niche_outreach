'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Stethoscope,
  Sparkles,
  Sun,
  Palette,
  AlertCircle,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { LandingCatalogItem } from '@/lib/landing/load-public-catalog'
import type { LandingBookClickHandler } from '@/lib/landing/book-cta'

interface TreatmentsProps {
  catalogItems: LandingCatalogItem[]
  onBookClick: LandingBookClickHandler
}

const STATIC_FALLBACK: LandingCatalogItem[] = [
  {
    catalogSlug: 'new-patient-exam',
    title: 'General Dentistry',
    description:
      'Comprehensive check-ups, fillings, and preventive care to keep your smile healthy.',
    featureLines: ['Regular check-ups', 'Fillings & repairs', 'Preventive care'],
    durationMinutes: 45,
    priceLabel: '',
    categorySlug: null,
    categorySortOrder: 0,
  },
  {
    catalogSlug: 'hygiene-maintenance',
    title: 'Hygiene Appointments',
    description: 'Professional cleaning and guidance to maintain optimal oral health between visits.',
    featureLines: ['Deep cleaning', 'Stain removal', 'Personalised advice'],
    durationMinutes: 30,
    priceLabel: '',
    categorySlug: null,
    categorySortOrder: 1,
  },
  {
    catalogSlug: 'teeth-whitening-consult',
    title: 'Teeth Whitening',
    description: 'Safe, effective whitening treatments for a naturally brighter smile.',
    featureLines: ['Professional results', 'Safe approach', 'Natural finish'],
    durationMinutes: 30,
    priceLabel: '',
    categorySlug: null,
    categorySortOrder: 2,
  },
  {
    catalogSlug: 'aligner-consult',
    title: 'Cosmetic Dentistry',
    description: 'Subtle improvements that enhance your smile while looking completely natural.',
    featureLines: ['Veneers', 'Bonding', 'Smile design'],
    durationMinutes: 45,
    priceLabel: '',
    categorySlug: null,
    categorySortOrder: 3,
  },
  {
    catalogSlug: 'new-patient-exam',
    title: 'Emergency Dental Care',
    description: 'Same-week appointments for urgent dental issues when you need us most.',
    featureLines: ['Same-week booking', 'Pain relief', 'Clear guidance'],
    durationMinutes: 30,
    priceLabel: '',
    categorySlug: null,
    categorySortOrder: 4,
  },
  {
    catalogSlug: 'hygiene-maintenance',
    title: 'Family Dentistry',
    description: 'Caring for patients of all ages with a gentle, family-friendly approach.',
    featureLines: ['All ages welcome', 'Family appointments', 'Gentle care'],
    durationMinutes: 30,
    priceLabel: '',
    categorySlug: null,
    categorySortOrder: 5,
  },
]

function iconForTreatment(item: LandingCatalogItem): LucideIcon {
  const blob = `${item.categorySlug ?? ''} ${item.title}`.toLowerCase()
  if (blob.includes('white')) return Sun
  if (blob.includes('hygiene') || blob.includes('clean')) return Sparkles
  if (blob.includes('cosmetic') || blob.includes('veneer') || blob.includes('bond')) return Palette
  if (blob.includes('emergency') || blob.includes('urgent')) return AlertCircle
  if (blob.includes('family') || blob.includes('child')) return Users
  return Stethoscope
}

function displayFeatureLines(item: LandingCatalogItem): string[] {
  if (item.featureLines.length > 0) return item.featureLines
  const lines: string[] = []
  if (item.durationMinutes > 0) lines.push(`Typical visit · ${item.durationMinutes} minutes`)
  if (item.priceLabel) lines.push(`From ${item.priceLabel}`)
  if (lines.length === 0) lines.push('Personalised care', 'Clear pricing', 'Gentle approach')
  return lines.slice(0, 3)
}

export function Treatments({ catalogItems, onBookClick }: TreatmentsProps) {
  const items = useMemo(
    () => (catalogItems.length > 0 ? catalogItems : STATIC_FALLBACK),
    [catalogItems],
  )
  const fromCatalog = catalogItems.length > 0

  return (
    <section id="treatments" className="py-20 md:py-28 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Treatments designed around your needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From routine care to cosmetic improvements, we offer a complete range of modern dental services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((treatment, index) => {
            const Icon = iconForTreatment(treatment)
            const lines = displayFeatureLines(treatment)
            return (
              <div
                key={`${treatment.catalogSlug}-${treatment.title}-${index}`}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-7 h-7 text-primary" aria-hidden />
                </div>
                <h3 className="font-semibold text-foreground text-xl mb-3">{treatment.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{treatment.description}</p>
                {fromCatalog && (treatment.durationMinutes > 0 || treatment.priceLabel) ? (
                  <p className="mb-3 text-xs text-muted-foreground">
                    {treatment.durationMinutes > 0 ? `${treatment.durationMinutes} min` : null}
                    {treatment.durationMinutes > 0 && treatment.priceLabel ? ' · ' : null}
                    {treatment.priceLabel ? <>From {treatment.priceLabel}</> : null}
                  </p>
                ) : null}
                <ul className="space-y-2 mb-5">
                  {lines.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                {fromCatalog ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-auto h-10 w-full"
                    onClick={() => onBookClick(treatment.catalogSlug)}
                  >
                    Book this treatment
                  </Button>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button onClick={() => onBookClick()} variant="cta" className="h-12 px-8 font-medium min-h-12 w-full sm:w-auto">
            Book appointment
          </Button>
        </div>
      </div>
    </section>
  )
}
