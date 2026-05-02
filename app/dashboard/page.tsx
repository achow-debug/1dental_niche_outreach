import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ContextualHero } from '@/components/dashboard/user-home/contextual-hero'
import { NextAppointmentCard } from '@/components/dashboard/user-home/next-appointment-card'
import { PipelineSummary } from '@/components/dashboard/user-home/pipeline-summary'
import { BookingsPreview } from '@/components/dashboard/user-home/bookings-preview'
import { NotificationsPreview } from '@/components/dashboard/user-home/notifications-preview'
import { OnboardingLane } from '@/components/dashboard/user-home/onboarding-lane'
import { ReminderTimeline } from '@/components/dashboard/user-home/reminder-timeline'
import { ProfileCompletenessCard } from '@/components/dashboard/user-home/profile-completeness-card'
import { QuickLinksGrid } from '@/components/dashboard/user-home/quick-links'
import { TrustReassuranceCard } from '@/components/dashboard/user-home/trust-reassurance'
import { TreatmentBookCard } from '@/components/dashboard/user-home/treatment-book-card'
import { MobileStickyBookCta } from '@/components/dashboard/user-home/mobile-sticky-book-cta'
import {
  buildHeroContext,
  getNextAppointment,
  getPipelineCounts,
  getUpcomingBookings,
  primaryBookCtaLabel,
} from '@/lib/dashboard/dashboard-booking-utils'
import { loadUserBookingsForDashboard } from '@/lib/dashboard/load-user-bookings-server'
import { loadDashboardBookCatalogServer } from '@/lib/dashboard/load-dashboard-book-catalog-server'
import { loadDashboardNotifications } from '@/lib/dashboard/load-user-notifications-server'
import { computeProfileCompleteness } from '@/lib/dashboard/profile-completeness'
import { getRebookHrefFromBookings } from '@/lib/dashboard/user-bookings'

export const metadata = {
  title: 'Dashboard | Carter Dental Studio',
  description: 'Your Carter Dental Studio account.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Profile missing</AlertTitle>
        <AlertDescription>
          No profile row found. Run the Supabase migration and ensure the <code>handle_new_user</code> trigger is
          installed.
        </AlertDescription>
      </Alert>
    )
  }

  if (profile.role === 'admin' || profile.role === 'staff') {
    redirect('/admin')
  }

  const firstName =
    profile.first_name || profile.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  const [bookings, notifications, bookCatalog] = await Promise.all([
    loadUserBookingsForDashboard(),
    loadDashboardNotifications(),
    loadDashboardBookCatalogServer(supabase),
  ])

  const treatmentPreview = bookCatalog.slice(0, 3).map((t) => ({
    catalogSlug: t.catalogSlug,
    name: t.name,
    durationMinutes: t.durationMinutes,
    priceLabel: t.priceLabel,
    badge: t.badge,
  }))

  const hero = buildHeroContext(firstName, bookings)
  const pipeline = getPipelineCounts(bookings)
  const nextAppointment = getNextAppointment(bookings)
  const upcoming = getUpcomingBookings(bookings)
  const hasAnyBooking = bookings.length > 0
  const primaryCtaLabel = primaryBookCtaLabel(hasAnyBooking)
  const rebookHref = getRebookHrefFromBookings(bookings)

  const p = profile as Record<string, string | null | undefined>
  const completeness = computeProfileCompleteness({
    first_name: p.first_name ?? null,
    last_name: p.last_name ?? null,
    full_name: p.full_name ?? null,
    phone: p.phone ?? null,
    phone_number: p.phone_number ?? null,
    address_line1: p.address_line1 ?? null,
    city: p.city ?? null,
    post_code: p.post_code ?? null,
  })

  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Add contact details so we can reach you if your visit time changes.',
      done: completeness.percent === 100,
      href: '/profile',
      cta: 'Edit profile',
    },
    {
      id: 'book',
      title: 'Book your first appointment',
      description: 'Pick a treatment and time — booking takes just a minute.',
      done: hasAnyBooking,
      href: '/dashboard/book',
      cta: 'Start booking',
    },
  ]

  const showOnboarding = onboardingSteps.some((s) => !s.done)

  return (
    <div className="space-y-5 pb-[5.75rem] md:space-y-6 md:pb-6">
      <ContextualHero
        context={hero}
        roleLabel={String(profile.role).replace('_', ' ')}
        statusLabel={profile.status ? String(profile.status).replace('_', ' ') : null}
      />

      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-5 lg:col-span-2 lg:space-y-6">
          <NextAppointmentCard booking={nextAppointment} />
          <PipelineSummary counts={pipeline} />
          <BookingsPreview bookings={bookings} />
          <TreatmentBookCard
            rebookHref={rebookHref}
            primaryCtaLabel={primaryCtaLabel}
            previewTreatments={treatmentPreview}
          />
          <NotificationsPreview items={notifications} />
        </div>

        <aside className="space-y-5 lg:space-y-6">
          <OnboardingLane steps={onboardingSteps} show={showOnboarding} />
          <ReminderTimeline upcoming={upcoming} />
          <ProfileCompletenessCard percent={completeness.percent} missing={completeness.missing} />
          <QuickLinksGrid />
          <TrustReassuranceCard />
        </aside>
      </div>

      <MobileStickyBookCta primaryCtaLabel={primaryCtaLabel} />
    </div>
  )
}
