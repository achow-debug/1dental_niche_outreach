# Lead forms → n8n webhooks (implementation guide)

## Current behaviour (May 2026)

- **CTAs:** "Book website audit" and "Request demo" open `components/booking-lead-modal.tsx` with intent `website_audit` or `demo`.
- **Audit form fields:** Name, Email, Website URL, Business type, Biggest issue/goal, GDPR consent checkbox, honeypot. Submit posts to **`/api/leads/website-audit`**.
- **Demo form fields:** Name, Email, Website URL, Practice name, GDPR consent checkbox, honeypot. Submit posts to **`/api/leads/request-demo`**.
- **Success state:** Thank‑you copy confirms delivery to the email entered, with a 2‑business‑day promise for the audit and a "next business day" promise for the demo.
- **n8n payload (audit):** `source`, `intent`, `firstName`, `lastName`, `fullName`, `email`, `websiteUrl`, `businessType`, `biggestIssue`, `consent`.

## Environment variables

See `.env.local.example`: `WEBSITE_AUDIT_N8N_WEBHOOK_URL`, `REQUEST_DEMO_N8N_WEBHOOK_URL`, optional `N8N_WEBHOOK_SECRET`.

## Canonical variable contract (audit)

The four sources of truth must agree on field names:

| Form field (`booking-lead-modal.tsx`) | Zod key (`/api/leads/website-audit/route.ts`) | n8n payload key | Email placeholder |
|---|---|---|---|
| `name` | `name` (split server‑side into `firstName` + `lastName`) | `firstName`, `lastName`, `fullName` | `{{ $json.body.firstName \|\| 'there' }}`, `{{ $json.body.fullName }}` |
| `email` | `email` | `email` | `{{ $json.body.email }}` |
| `websiteUrl` | `websiteUrl` | `websiteUrl` | `{{ $json.body.websiteUrl }}` |
| `businessType` | `businessType` | `businessType` | `{{ $json.body.businessType \|\| '—' }}` |
| `biggestIssue` | `biggestIssue` | `biggestIssue` | `{{ $json.body.biggestIssue \|\| '—' }}` |
| `consent` object | `consent` object | `consent` object | not rendered |

**Rules:**

- All email placeholders use the **spaced** `{{ $json.body.<field> }}` form (never `{{$json.body.<field>}}`).
- Always wrap user‑facing placeholders in a fallback (`|| 'there'` for the greeting, `|| '—'` for summary card rows).
- The recipient email in `{{ $json.body.email }}` does **not** get a fallback — the email cannot be sent without one.

## Example payload (website audit)

```json
{
  "source": "1dental_niche_outreach",
  "intent": "website_audit",
  "firstName": "Jane",
  "lastName": "Smith",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "websiteUrl": "https://janes-clinic.example.com",
  "businessType": "Dental clinic",
  "biggestIssue": "Mobile site loads slowly and bookings have dropped.",
  "consent": {
    "gdpr": true,
    "privacyPolicyUrl": "https://your-site.example/privacy",
    "submittedAt": "2026-05-06T12:00:00.000Z"
  }
}
```

## Email template authoring (audit confirmation)

- **Source of truth lives in the repo** at `emails/audit-request-received.html` (HTML) and `emails/audit-request-received.txt` (plain‑text alt).
- For v1, the HTML is **copy‑pasted into the n8n Send Email node's HTML field** verbatim. The plain‑text version is pasted into the node's Text field.
- All n8n templating expressions stay as `{{ $json.body.<field> }}` so they are evaluated by n8n at send time.
- When the email is updated, edit the file in the repo first, then paste into n8n. Treat the repo as canonical and the n8n field as a deployment artefact.
- A later iteration may switch to having n8n load the HTML via the HTTP Request node from a publicly served path, but that is out of scope for v1.

## Sender identity (audit confirmation)

- **From:** `Alex from Standout Group <alex@senderdomain.net>`
- **Reply‑To:** `alex@senderdomain.net` (same human mailbox, must be monitored, 1‑business‑day reply SLA)
- **Reply owner:** **Alex** personally replies to inbound emails (audit corrections, walkthrough requests) within 1 business day.
- **Sign‑off line in body:** `— Alex, Standout Group` (must match From display name)
- **Domain:** `senderdomain.net` (locked). SPF / DKIM / DMARC must be verified on this domain before any send goes live.

## Unsubscribe scoping (audit confirmation)

- The footer "Unsubscribe from marketing emails" link points at the n8n unsubscribe webhook with `?type=marketing&email=<urlEncoded>`.
- The n8n unsubscribe workflow must set **`marketing_unsubscribed = true`** on the contact record. It **must not** set `all_unsubscribed` and **must not** suppress transactional sends (audit delivery, walkthrough confirmation, replies from the human sender).
- A separate `?type=all` path is reserved for genuine hard‑opt‑out requests, typically triggered manually (not from the email pill).
- The audit itself must be sent via the **transactional** code path so the `marketing_unsubscribed` flag does not block delivery.

`intent` is `"demo"` for the request‑demo route. The audit confirmation email described in `Implementation Plan Folder/request_received_implementation_plan.md` only fires off the `website_audit` intent.
