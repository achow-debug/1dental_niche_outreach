import { createClient } from '@/lib/supabase/server'
import { LandingHomeClient } from '@/components/landing-home-client'
import { loadPublicCatalogForLanding } from '@/lib/landing/load-public-catalog'
import { getCalendlyEmbedRuntimeConfig } from '@/lib/calendly/embed-config'

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function Home({ searchParams }: HomeProps) {
  const supabase = await createClient()
  const [authResult, catalogItems, sp] = await Promise.all([
    supabase.auth.getUser(),
    loadPublicCatalogForLanding(supabase),
    searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>),
  ])
  const raw = sp.schedule
  const schedule = Array.isArray(raw) ? raw[0] : raw
  const initialSchedulingOpen =
    schedule === '1' ||
    schedule === 'true' ||
    schedule === 'audit' ||
    schedule === 'demo'

  const calendlyEmbed = getCalendlyEmbedRuntimeConfig()

  return (
    <LandingHomeClient
      isLoggedIn={Boolean(authResult.data.user)}
      catalogItems={catalogItems}
      initialSchedulingOpen={initialSchedulingOpen}
      calendlyEmbed={calendlyEmbed}
    />
  )
}
