import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { clientIp, isPrivacyPolicyUrl, rateLimitOk } from '@/lib/leads/lead-api-common'
import { postLeadJsonToN8nWebhook } from '@/lib/leads/post-n8n-webhook'

const bodySchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(320),
    sector: z.string().trim().min(1).max(200),
    teamSize: z.string().trim().min(1).max(200),
    consent: z.object({
      gdpr: z.literal(true),
      privacyPolicyUrl: z.string().url().max(500),
      submittedAt: z.string().max(64),
    }),
    honeypot: z.string().max(200).optional(),
  })
  .strict()
  .refine((d) => !d.honeypot?.trim(), { message: 'Invalid request' })

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

  const webhookUrl = process.env.REQUEST_DEMO_N8N_WEBHOOK_URL?.trim()
  if (!webhookUrl) {
    console.error('[request-demo]', correlationId, 'missing REQUEST_DEMO_N8N_WEBHOOK_URL')
    return NextResponse.json({ error: 'Demo lead capture is not configured.' }, { status: 503 })
  }

  if (!isPrivacyPolicyUrl(parsed.data.consent.privacyPolicyUrl)) {
    return NextResponse.json({ error: 'Invalid consent payload' }, { status: 400 })
  }

  const { firstName, lastName, email, sector, teamSize } = parsed.data
  const fullName = `${firstName} ${lastName}`.trim()

  const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
  const payload = {
    source: '1dental_niche_outreach',
    intent: 'demo' as const,
    firstName,
    lastName,
    fullName,
    email,
    sector,
    teamSize,
    consent: {
      ...parsed.data.consent,
      submittedAt: new Date().toISOString(),
    },
  }

  const result = await postLeadJsonToN8nWebhook({
    webhookUrl,
    webhookSecret: secret,
    payload,
    correlationId,
    logLabel: 'request-demo',
    webhookEnvName: 'REQUEST_DEMO_N8N_WEBHOOK_URL',
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  console.info('[request-demo]', correlationId, 'ok')
  return NextResponse.json({ ok: true })
}
