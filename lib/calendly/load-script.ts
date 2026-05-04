import '@/lib/calendly/calendly-types'

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js'

const SCRIPT_TIMEOUT_MS = 20_000

let inflight: Promise<void> | null = null

function whenCalendlyReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      if (typeof window !== 'undefined' && window.Calendly) {
        resolve()
        return
      }
      if (Date.now() - start > SCRIPT_TIMEOUT_MS) {
        reject(new Error('Calendly script timed out'))
        return
      }
      window.setTimeout(tick, 50)
    }
    tick()
  })
}

function injectScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = CALENDLY_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Calendly script failed to load'))
    document.body.appendChild(script)
  })
}

/**
 * Idempotent loader for Calendly `widget.js`. Call from client components only.
 */
export function loadCalendlyScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }
  if (window.Calendly) {
    return Promise.resolve()
  }
  if (inflight) {
    return inflight
  }

  inflight = (async () => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_SCRIPT_SRC}"]`,
    )
    if (!existing) {
      await injectScript()
    }
    await whenCalendlyReady()
  })().catch((err: unknown) => {
    inflight = null
    throw err
  })

  return inflight
}
