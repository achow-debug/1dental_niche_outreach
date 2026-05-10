# Lead forms → n8n webhooks (implementation guide)

## Current behaviour (May 2026)

- **CTAs:** “Book website audit” and “Request demo” open `components/booking-lead-modal.tsx` with intent `website_audit` or `demo`.
- **Single-step form:** First name, last name, email, GDPR checkbox, honeypot. Submit posts to **`/api/leads/website-audit`** or **`/api/leads/request-demo`**.
- **Success:** Thank-you copy confirms delivery to the email entered (audit vs demo wording differs slightly).
- **n8n payload:** `firstName`, `lastName`, `fullName` (combined), `email`, `consent`, `source`, `intent`.

## Environment variables

See `.env.local.example`: `WEBSITE_AUDIT_N8N_WEBHOOK_URL`, `REQUEST_DEMO_N8N_WEBHOOK_URL`, optional `N8N_WEBHOOK_SECRET`.

## Example payload (website audit)

```json
{
  "source": "1dental_niche_outreach",
  "intent": "website_audit",
  "firstName": "Jane",
  "lastName": "Smith",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "consent": {
    "gdpr": true,
    "privacyPolicyUrl": "https://your-site.example/privacy",
    "submittedAt": "2026-05-06T12:00:00.000Z"
  }
}
```

`intent` is `"demo"` for the request-demo route.
