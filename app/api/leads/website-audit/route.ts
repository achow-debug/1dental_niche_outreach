import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 15
const hitTimestampsByIp = new Map<string, number[]>()

function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const prev = hitTimestampsByIp.get(ip) ?? []
  const windowed = prev.filter((t) => now - t < RATE_WINDOW_MS)
  if (windowed.length >= RATE_MAX) return false
  windowed.push(now)
  hitTimestampsByIp.set(ip, windowed)
  return true
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip') || 'unknown'
}

function isPrivacyPolicyUrl(url: string): boolean {
  try {
    const u = new URL(url)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
    const path = u.pathname.replace(/\/$/, '') || '/'
    return path.endsWith('/privacy')
  } catch {
    return false
  }
}

const bodySchema = z
  .object({
    fullName: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    business: z.object({
      q1: z.string().trim().min(1).max(4000),
      q2: z.string().trim().min(1).max(4000),
      q3: z.string().trim().min(1).max(4000),
    }),
    consent: z.object({
      gdpr: z.literal(true),
      privacyPolicyUrl: z.string().url().max(500),
      submittedAt: z.string().max(64),
    }),
    honeypot: z.string().max(200).optional(),
  })
  .strict()
  .refine((d) => !d.honeypot?.trim(), { message: 'Invalid request' })

const WEBHOOK_TIMEOUT_MS = 15_000

export async function POST(req: Request) {
  const correlationId = randomUUID()
  const ip = clientIp(req)

  if (!rateLimitOk(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead data' }, { status: 400 })
  }

  const webhookUrl = process.env.WEBSITE_AUDIT_N8N_WEBHOOK_URL?.trim()
  if (!webhookUrl) {
    console.error('[website-audit]', correlationId, 'missing WEBSITE_AUDIT_N8N_WEBHOOK_URL')
    return NextResponse.json({ error: 'Lead capture is not configured.' }, { status: 503 })
  }

  if (!isPrivacyPolicyUrl(parsed.data.consent.privacyPolicyUrl)) {
    return NextResponse.json({ error: 'Invalid consent payload' }, { status: 400 })
  }

  const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
  const payload = {
    source: '1dental_niche_outreach',
    intent: 'website_audit' as const,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    business: parsed.data.business,
    consent: {
      ...parsed.data.consent,
      submittedAt: new Date().toISOString(),
    },
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Webhook-Secret': secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!res.ok) {
      console.error('[website-audit]', correlationId, 'n8n status', res.status)
      return NextResponse.json(
        { error: 'Could not reach scheduling service. Please try again.' },
        { status: 502 },
      )
    }
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError'
    console.error('[website-audit]', correlationId, aborted ? 'timeout' : 'fetch_error')
    return NextResponse.json(
      { error: 'Could not reach scheduling service. Please try again.' },
      { status: 503 },
    )
  } finally {
    clearTimeout(timeout)
  }

  console.info('[website-audit]', correlationId, 'ok')
  return NextResponse.json({ ok: true })
}
