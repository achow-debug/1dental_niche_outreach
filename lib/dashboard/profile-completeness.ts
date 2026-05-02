export type ProfileCompletenessInput = {
  first_name: string | null
  last_name: string | null
  full_name: string | null
  /** Legacy column from initial schema */
  phone: string | null
  phone_number: string | null
  address_line1: string | null
  city: string | null
  post_code: string | null
}

export type MissingProfileField = { id: string; label: string; href: string }

const PROFILE_EDITOR = '/profile'

function hasName(p: ProfileCompletenessInput) {
  const n = `${p.first_name ?? ''}${p.last_name ?? ''}`.trim()
  if (n.length > 0) return true
  return Boolean(p.full_name?.trim())
}

export function computeProfileCompleteness(profile: ProfileCompletenessInput): {
  percent: number
  missing: MissingProfileField[]
} {
  const checks: { ok: boolean; field: MissingProfileField }[] = [
    {
      ok: hasName(profile),
      field: { id: 'name', label: 'Your name', href: PROFILE_EDITOR },
    },
    {
      ok: Boolean(profile.phone_number?.trim() || profile.phone?.trim()),
      field: { id: 'phone', label: 'Phone number', href: PROFILE_EDITOR },
    },
    {
      ok: Boolean(profile.address_line1?.trim()),
      field: { id: 'address', label: 'Address line 1', href: PROFILE_EDITOR },
    },
    {
      ok: Boolean(profile.city?.trim()),
      field: { id: 'city', label: 'City', href: PROFILE_EDITOR },
    },
    {
      ok: Boolean(profile.post_code?.trim()),
      field: { id: 'post', label: 'Postcode', href: PROFILE_EDITOR },
    },
  ]

  const missing = checks.filter((c) => !c.ok).map((c) => c.field)
  const done = checks.length - missing.length
  const percent = Math.round((done / checks.length) * 100)

  return { percent, missing }
}
