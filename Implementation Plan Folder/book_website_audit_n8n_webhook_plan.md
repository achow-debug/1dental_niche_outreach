# Book website audit form → n8n webhook (implementation guide)

## Implemented in codebase (May 2026)

- **Intent split:** `website_audit` vs `demo` — passed from header, footer, book-call section, and home deep links (`?schedule=audit` → audit, otherwise demo when modal opens from URL).
- **Audit path:** Step 0 collects full name, work email, GDPR checkbox (required), honeypot; three qualification questions (`AUDIT_LEAD_QUESTION_STEPS` in `lib/calendly/lead-questions.ts`); then **POST** `/api/leads/website-audit` before Calendly; on failure the user sees an error and can retry.
- **Demo path:** Five questions unchanged; no n8n POST.
- **Server route:** `app/api/leads/website-audit/route.ts` — Zod validation, optional `X-Webhook-Secret` from `N8N_WEBHOOK_SECRET`, forwards JSON to `WEBSITE_AUDIT_N8N_WEBHOOK_URL`, light per-IP rate limit, 15s timeout.
- **Full-page scheduler:** `/book-a-call?intent=audit` for audit flow; default remains demo.

## Environment variables

See `.env.local.example`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `WEBSITE_AUDIT_N8N_WEBHOOK_URL` | Yes (for audit POST) | n8n Webhook trigger URL (server-only). |
| `N8N_WEBHOOK_SECRET` | No | If set, sent as `X-Webhook-Secret` on the outbound request. |
| `NEXT_PUBLIC_SITE_URL` | No | Optional canonical site base for other features; privacy URL in consent is built from the browser origin on submit. |

## n8n test webhook (your current URL)

Use this value for **`WEBSITE_AUDIT_N8N_WEBHOOK_URL`** in `.env.local` and Vercel while testing:

`https://lwa24ysc.app.n8n.cloud/webhook-test/fd50bef9-f4cb-4a92-82b6-a2ad5395c15e`

Switch to the **production** webhook URL from n8n when you go live.

## Payload sent to n8n

```json
{
  "source": "1dental_niche_outreach",
  "intent": "website_audit",
  "fullName": "…",
  "email": "…",
  "business": {
    "q1": "…",
    "q2": "…",
    "q3": "…"
  },
  "consent": {
    "gdpr": true,
    "privacyPolicyUrl": "https://your-site.example/privacy",
    "submittedAt": "2026-05-06T12:00:00.000Z"
  }
}
```

`q1`–`q3` are human-readable strings (option labels or textarea text), aligned with the three audit steps in order.

## n8n workflow (ops) checklist

1. Workflow with **Webhook** node (POST).
2. **Test URL** vs **production URL** — store production in Vercel env only.
3. Optional: validate `X-Webhook-Secret` matches what you set in `N8N_WEBHOOK_SECRET`.
4. Branch to email / Sheets / CRM as needed.
5. Error notifications (Error Trigger workflow or execution alerts).
6. **GDPR:** document retention in sheet/CRM; avoid copying full payloads into unsecured channels.

## QA

- Happy path: complete audit form → n8n receives payload → Calendly step appears.
- Missing GDPR → cannot continue from step 0.
- Webhook misconfigured or 500 → error message; user can retry after fixing env or n8n.

---

## Original architecture notes (reference)

| Topic | Recommendation |
|--------|----------------|
| **Webhook exposure** | Never call n8n from the browser; use the Next.js route handler with a secret env. |
| **Request demo vs audit** | `intent: 'website_audit' \| 'demo'` from CTAs. |
| **GDPR** | On-site checkbox + consent object in payload; not replaced by Calendly’s banner alone. |
| **When to fire** | After last business question, before Calendly (captures abandons after qualification). |
| **Failure handling** | v1: block + retry (implemented). |
| **Abuse** | Rate limit + max field lengths + honeypot (implemented). |
| **PII in logs** | Route logs correlation id / status only, not email/name. |
