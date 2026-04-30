import { createClient } from '@supabase/supabase-js'

export class MissingSupabaseAdminEnvError extends Error {
  missingVars: string[]

  constructor(missingVars: string[]) {
    const sorted = [...missingVars].sort()
    super(`Missing Supabase admin environment variables: ${sorted.join(', ')}`)
    this.name = 'MissingSupabaseAdminEnvError'
    this.missingVars = sorted
  }
}

export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const missingVars: string[] = []

  if (!url) {
    missingVars.push('SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
  }
  if (!serviceRoleKey) {
    missingVars.push('SUPABASE_SERVICE_ROLE_KEY')
  }

  if (missingVars.length > 0) {
    throw new MissingSupabaseAdminEnvError(missingVars)
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
