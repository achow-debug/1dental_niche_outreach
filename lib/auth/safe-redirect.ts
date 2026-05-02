/**
 * Prevents open redirects after login. Only same-origin relative paths are allowed.
 */
export function sanitizeRedirectPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (raw == null || raw === '') return fallback
  const trimmed = raw.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback
  if (trimmed.includes('\\')) return fallback
  return trimmed
}
