import { createClient } from '@/lib/supabase/server'
import { LandingHomeClient } from '@/components/landing-home-client'
import { loadPublicCatalogForLanding } from '@/lib/landing/load-public-catalog'

export default async function Home() {
  const supabase = await createClient()
  const [authResult, catalogItems] = await Promise.all([supabase.auth.getUser(), loadPublicCatalogForLanding(supabase)])

  return (
    <LandingHomeClient isLoggedIn={Boolean(authResult.data.user)} catalogItems={catalogItems} />
  )
}
