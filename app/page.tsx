import { createClient, isSupabaseServerConfigured } from '@/lib/supabase/server'
import { LandingHomeClient } from '@/components/landing-home-client'
import { loadPublicCatalogForLanding } from '@/lib/landing/load-public-catalog'
import type { LandingCatalogItem } from '@/lib/landing/load-public-catalog'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function Home({ searchParams }: HomeProps) {
  let isLoggedIn = false
  let catalogItems: LandingCatalogItem[] = []

  if (isSupabaseServerConfigured()) {
    const supabase = await createClient()
    const [authResult, items] = await Promise.all([
      supabase.auth.getUser(),
      loadPublicCatalogForLanding(supabase),
    ])
    isLoggedIn = Boolean(authResult.data.user)
    catalogItems = items
  }

  const sp =
    (await searchParams) ?? ({} as Record<string, string | string[] | undefined>)
  const raw = sp.schedule
  const schedule = Array.isArray(raw) ? raw[0] : raw
  const initialSchedulingOpen =
    schedule === '1' ||
    schedule === 'true' ||
    schedule === 'audit' ||
    schedule === 'demo'

  const initialSchedulingIntent: LeadSchedulingIntent =
    schedule === 'demo' ? 'demo' : 'website_audit'

  return (
    <LandingHomeClient
      isLoggedIn={isLoggedIn}
      catalogItems={catalogItems}
      initialSchedulingOpen={initialSchedulingOpen}
      initialSchedulingIntent={initialSchedulingIntent}
    />
  )
}
