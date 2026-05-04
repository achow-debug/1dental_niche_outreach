export type CalendlyBrandingQuery = {
  primaryColor?: string
  textColor?: string
  backgroundColor?: string
  hideGdprBanner?: boolean
}

/** Calendly expects hex without `#` in query params. */
export function normalizeCalendlyHex(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined
  const s = value.trim().replace(/^#/, '')
  return /^[0-9A-Fa-f]{3,8}$/.test(s) ? s : undefined
}

export function buildCalendlyEmbedUrl(baseUrl: string, branding: CalendlyBrandingQuery): string {
  let url: URL
  try {
    url = new URL(baseUrl)
  } catch {
    return baseUrl
  }

  const primary = normalizeCalendlyHex(branding.primaryColor)
  const text = normalizeCalendlyHex(branding.textColor)
  const bg = normalizeCalendlyHex(branding.backgroundColor)

  if (primary) url.searchParams.set('primary_color', primary)
  if (text) url.searchParams.set('text_color', text)
  if (bg) url.searchParams.set('background_color', bg)
  if (branding.hideGdprBanner) url.searchParams.set('hide_gdpr_banner', '1')

  return url.toString()
}
