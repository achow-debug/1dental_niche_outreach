const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 15
const hitTimestampsByIp = new Map<string, number[]>()

export function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const prev = hitTimestampsByIp.get(ip) ?? []
  const windowed = prev.filter((t) => now - t < RATE_WINDOW_MS)
  if (windowed.length >= RATE_MAX) return false
  windowed.push(now)
  hitTimestampsByIp.set(ip, windowed)
  return true
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip') || 'unknown'
}

export function isPrivacyPolicyUrl(url: string): boolean {
  try {
    const u = new URL(url)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
    const path = u.pathname.replace(/\/$/, '') || '/'
    return path.endsWith('/privacy')
  } catch {
    return false
  }
}
