import { buildCalendlyEmbedUrl, type CalendlyBrandingQuery } from '@/lib/calendly/build-calendly-url'

function readEnvString(key: string): string | undefined {
  const v = process.env[key]
  if (v == null || !String(v).trim()) return undefined
  return String(v).trim()
}

function readEnvBoolean(key: string, defaultTrue: boolean): boolean {
  const v = readEnvString(key)
  if (v == null) return defaultTrue
  const lower = v.toLowerCase()
  if (lower === 'false' || lower === '0' || lower === 'no') return false
  if (lower === 'true' || lower === '1' || lower === 'yes') return true
  return defaultTrue
}

function normalizeEventUrlRaw(raw: string): string {
  return raw
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/^["']|["']$/g, '')
}

/** Validates configured event URL; returns undefined if missing or invalid. */
export function getCalendlyEventUrl(): string | undefined {
  const raw0 = readEnvString('NEXT_PUBLIC_CALENDLY_EVENT_URL')
  if (!raw0) return undefined
  const raw = normalizeEventUrlRaw(raw0)
  if (!raw) return undefined
  try {
    const u = new URL(raw)
    const host = u.hostname.toLowerCase()
    const isCalendlyHost =
      host === 'calendly.com' ||
      host === 'www.calendly.com' ||
      host.endsWith('.calendly.com')
    const isDev = process.env.NODE_ENV === 'development'
    const protocolOk = u.protocol === 'https:' || (isDev && u.protocol === 'http:')
    if (!protocolOk || !isCalendlyHost) {
      return undefined
    }
    return u.toString().replace(/\/$/, '')
  } catch {
    return undefined
  }
}

/** When false, pages should show copy + external link only (no widget script). */
export function isCalendlyEmbedEnabled(): boolean {
  return readEnvBoolean('NEXT_PUBLIC_CALENDLY_EMBED_ENABLED', true)
}

export function getCalendlyBrandingFromEnv(): CalendlyBrandingQuery {
  return {
    primaryColor: readEnvString('NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR'),
    textColor: readEnvString('NEXT_PUBLIC_CALENDLY_TEXT_COLOR'),
    backgroundColor: readEnvString('NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR'),
    hideGdprBanner: readEnvBoolean('NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER', false),
  }
}

/** Full embed URL with branding query params for `initInlineWidget` / `initPopupWidget`. */
export function getCalendlyEmbedUrl(): string | undefined {
  const base = getCalendlyEventUrl()
  if (!base) return undefined
  return buildCalendlyEmbedUrl(base, getCalendlyBrandingFromEnv())
}

/** Clean public booking link (no embed params) for fallback / new tab. */
export function getCalendlyPublicBookingUrl(): string | undefined {
  return getCalendlyEventUrl()
}

/** Values for client embeds — compute in a Server Component so env is read at request/build on the server, not inlined as empty in the client bundle. */
export type CalendlyEmbedRuntimeConfig = {
  publicBookingUrl: string | undefined
  embedUrl: string | undefined
  embedWidgetEnabled: boolean
}

export function getCalendlyEmbedRuntimeConfig(): CalendlyEmbedRuntimeConfig {
  return {
    publicBookingUrl: getCalendlyPublicBookingUrl(),
    embedUrl: getCalendlyEmbedUrl(),
    embedWidgetEnabled: isCalendlyEmbedEnabled(),
  }
}
