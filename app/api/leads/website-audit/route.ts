import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { clientIp, isPrivacyPolicyUrl, rateLimitOk } from '@/lib/leads/lead-api-common'
import { DEFAULT_WEBSITE_AUDIT_N8N_WEBHOOK_URL } from '@/lib/leads/n8n-webhook-defaults'
import { postLeadJsonToN8nWebhook } from '@/lib/leads/post-n8n-webhook'

const bodySchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    websiteUrl: z.string().trim().url().max(500),
    practiceName: z.string().trim().min(1).max(200),
    consent: z.object({
      gdpr: z.literal(true),
      privacyPolicyUrl: z.string().url().max(500),
      submittedAt: z.string().max(64),
    }),
    honeypot: z.string().max(200).optional(),
  })
  .strict()
  .refine((d) => !d.honeypot?.trim(), { message: 'Invalid request' })

function splitName(full: string): { firstName: string; lastName: string } {
  const trimmed = full.trim().replace(/\s+/g, ' ')
  if (!trimmed) return { firstName: '', lastName: '' }
  const [first, ...rest] = trimmed.split(' ')
  return {
    firstName: first ?? '',
    lastName: rest.join(' ').trim(),
  }
}

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

  const webhookUrl =
    process.env.WEBSITE_AUDIT_N8N_WEBHOOK_URL?.trim() || DEFAULT_WEBSITE_AUDIT_N8N_WEBHOOK_URL

  if (!isPrivacyPolicyUrl(parsed.data.consent.privacyPolicyUrl)) {
    return NextResponse.json({ error: 'Invalid consent payload' }, { status: 400 })
  }

  const { name, email, websiteUrl, practiceName } = parsed.data
  const { firstName, lastName } = splitName(name)
  const fullName = name.trim().replace(/\s+/g, ' ')

  const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
  const payload = {
    source: '1dental_niche_outreach',
    intent: 'website_audit' as const,
    firstName,
    lastName,
    fullName,
    email,
    websiteUrl,
    practiceName,
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
    logLabel: 'website-audit',
    webhookEnvName: 'WEBSITE_AUDIT_N8N_WEBHOOK_URL',
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  console.info('[website-audit]', correlationId, 'ok')
  return NextResponse.json({ ok: true })
}
