/**
 * Builds the absolute URL for the public unsubscribe confirmation page.
 * Prefer NEXT_PUBLIC_SITE_URL when set (correct canonical host in prod).
 */
export function resolveUnsubscribedConfirmationUrl(options: {
  requestUrl: string
  siteUrlEnv?: string | undefined
}): string {
  const raw = options.siteUrlEnv?.trim()
  if (raw) {
    try {
      const base = raw.replace(/\/$/, '')
      return new URL('/unsubscribed', base).href
    } catch {
      // fall through to request origin
    }
  }
  return new URL('/unsubscribed', new URL(options.requestUrl).origin).href
}
