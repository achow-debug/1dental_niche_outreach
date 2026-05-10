import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import { clientIp, rateLimitOk } from '@/lib/leads/lead-api-common'
import { postLeadJsonToN8nWebhook } from '@/lib/leads/post-n8n-webhook'
import { resolveUnsubscribedConfirmationUrl } from '@/lib/unsubscribe/resolve-confirmation-url'

async function collectPayload(req: NextRequest): Promise<Record<string, string>> {
  const url = new URL(req.url)
  const fromQuery = Object.fromEntries(url.searchParams.entries())

  if (req.method === 'GET') {
    return fromQuery
  }

  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      const json: unknown = await req.json()
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        const out: Record<string, string> = { ...fromQuery }
        for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
          if (typeof v === 'string') out[k] = v
        }
        return out
      }
    } catch {
      return fromQuery
    }
  }

  try {
    const fd = await req.formData()
    const out: Record<string, string> = { ...fromQuery }
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') out[k] = v
    }
    return out
  } catch {
    return fromQuery
  }
}

async function handle(req: NextRequest) {
  const ip = clientIp(req)
  if (!rateLimitOk(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  const correlationId = randomUUID()
  const fields = await collectPayload(req)
  const redirectTo = resolveUnsubscribedConfirmationUrl({
    requestUrl: req.url,
    siteUrlEnv: process.env.NEXT_PUBLIC_SITE_URL,
  })

  const webhookUrl = process.env.UNSUBSCRIBE_N8N_WEBHOOK_URL?.trim()
  if (webhookUrl) {
    const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
    const payload = {
      source: '1dental_niche_outreach',
      event: 'marketing_unsubscribe' as const,
      method: req.method,
      correlationId,
      capturedAt: new Date().toISOString(),
      fields,
    }

    const result = await postLeadJsonToN8nWebhook({
      webhookUrl,
      webhookSecret: secret,
      payload,
      correlationId,
      logLabel: 'unsubscribe',
      webhookEnvName: 'UNSUBSCRIBE_N8N_WEBHOOK_URL',
    })

    if (!result.ok) {
      console.error('[unsubscribe]', correlationId, result.logDetail)
    } else {
      console.info('[unsubscribe]', correlationId, 'webhook ok')
    }
  }

  return NextResponse.redirect(redirectTo, 302)
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
