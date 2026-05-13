import { track } from '@vercel/analytics'

type AnalyticsValue = string | number | boolean | null
type AnalyticsPayload = Record<string, AnalyticsValue>

export function trackEvent(event: string, data?: AnalyticsPayload): void {
  if (typeof window === 'undefined') return
  try {
    if (data) {
      track(event, data)
    } else {
      track(event)
    }
  } catch {
    // Swallow analytics errors — never block UX on telemetry.
  }
}
