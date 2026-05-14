# "Audit request received" email — Standout Group re‑theme + copy upgrade

> Source of the existing email: n8n "Send Email" node that fires after `/api/leads/website-audit` POSTs to the n8n webhook. Current payload (see `app/api/leads/website-audit/route.ts`) sends: `firstName`, `lastName`, `fullName`, `email`, `websiteUrl`, `practiceName`, `teamSize`, optional `bottleneck`, and a `consent` object.

## Goals of this iteration

1. On the email,replace the **Carter Dental** prototype branding with a dedicated **Standout Group** brand theme (Carter Dental is the demo client; Standout Group is the agency actually sending the email).
2. Move from a **calm warm‑white light** look to a **modern premium dark mode** experience for the email.
3. Rewrite the copy so the email **reassures and educates**, instead of immediately pushing the recipient to book a call.
4. Update the **Request summary** card to mirror the *new* form fields (name, website URL, business type, biggest issue/goal) — the website form will be updated separately.
5. Demote the call CTA into a **soft, optional** "audit walkthrough" link, so the funnel feels low‑friction.
6. Fix the broken unsubscribe link HTML in the current template.

## Locked decisions (from review)

- **Accent color:** violet `#7C5CFF` on near‑black `#0C0F12`. Mint alternative is dropped.
- **Logo:** text lockup only for v1 (`Standout Group` wordmark). Image logo deferred to a later iteration once we have a final mark.
- **Delivery window:** promise the audit **within 2 business days**, written into the email body.
- **"Reply if anything's wrong" line:** included, placed just under the Request summary card.
- **Walkthrough CTA framing:** keep it optional, but reframe with a concrete benefit ("we'll talk through the 2–3 highest‑impact changes specific to your site").
- **No qualification asks in this email:** confirmation only — do not request more info, do not ask follow‑up questions.
- **Sender identity:** from a real person, e.g. `Alex from Standout Group <alex@senderdomain.net>`. No `noreply@…`. Reply‑To set to the same human mailbox so replies actually land.
- **Unsubscribe scope:** unsubscribe only removes the recipient from **marketing sequences**, not from the transactional audit delivery itself. The recipient must still receive the audit they requested.

---

## Tasks (tick off as you go)

### A. Brand + theme

- [x] Create `Implementation Plan Folder/standout_group_brand_style_guide.md` as a separate brand mini system from `website_brand_style_guide.md` (that file is for the Carter Dental demo site)
- [x] Lock the dark mode palette in code using the tokens in "Standout Group dark theme palette" below — accent is **violet `#7C5CFF`** on canvas `#0C0F12`
- [x] Decide on typography stack for email (Inter or Manrope, with `Arial, Helvetica, sans-serif` fallback) and stick to system‑safe weights only
- [x] Replace the `Carter Dental` / `Studio • Manchester` lockup in the email header with `Standout Group` + a tagline (e.g. `Websites that convert` or `Standout · Conversion‑led websites`) — **text lockup only for v1**
- [x] Swap the "Audit request received" pill so it reads on the new dark surface (violet text on a translucent violet chip — use `accent.tint` `#1E1830` with `accent.brand` `#7C5CFF` text and a `#2C2647` 1px border) instead of the current pastel teal chip
- [x] Remove the warm sand background (`#f7f3ec`) and warm white card (`#ffffff` + `#ece5da` border) and replace with the dark surface tokens
- [x] Confirm no image assets are referenced in v1 (text‑only wordmark) so the email never relies on remote image hosting or Gmail's image proxy

### B. Copy rewrite

- [x] Update the **preheader** to: `We’ve received your audit request, {{ $json.body.firstName }}. We’ll send your recommendations within 2 business days — no action needed from you.`
- [x] Update the eyebrow tag (currently "Free website audit") to: `Audit request received`
- [x] Replace the H1:
  - From: `Thanks for requesting your audit, {{firstName}}.`
  - To: `We’ve received your audit request, {{ $json.body.firstName }}.`
- [x] Replace the hero paragraph with the new "what we'll review" body:
  > We’ll review your site and look at the key areas that usually affect enquiries and bookings: trust, mobile experience, page clarity, calls‑to‑action, and how easy it is for visitors to take the next step.
- [x] Add a **"reply if anything's wrong" line** immediately under the Request summary card (before "What happens next"):
  > If anything in this summary is wrong, just reply to this email and we’ll update it.
  - Style: 13px, `text.secondary` color, italic optional, no border — should read as a quiet aside, not a CTA
- [x] Rewrite **What happens next** to remove the "book a call" pressure and include the **2 business days** commitment:
  > **We’ll review your website and send over your audit within 2 business days.** You don’t need to do anything else right now.
  >
  > Once the audit is ready, we’ll email clear, prioritised recommendations to **{{ $json.body.email }}** that you can use to improve the website.
  - Note: dynamically printing the recipient's own email back to them reinforces the "we have your details correctly" trust signal without adding a separate field
- [x] Replace the hard CTA with a **soft optional** walkthrough offer that includes a concrete benefit:
  > **Optional — book a 15‑minute walkthrough**
  >
  > If you’d rather go through the findings together, you can book a short call. On the walkthrough we’ll talk through the 2–3 highest‑impact changes specific to your site, so you leave with clear next steps.
  >
  > `Book a 15‑min audit walkthrough →` (button, **secondary outline** style — not the primary violet fill)
- [x] Keep the bare Calendly URL underneath the button in small `text.muted` text as a fallback for clients that strip buttons
- [x] Append UTM params to both the button `href` and the bare URL: `?utm_source=email&utm_medium=audit_confirmation&utm_campaign=walkthrough_soft_cta`
- [x] Update the footer line `You’re receiving this because you requested a free website audit through our website.` → `You’re receiving this because you requested a free website audit from Standout Group.`
- [x] Update the footer brand line `Carter Dental · Studio • Manchester` → `Standout Group · [city or "Remote, UK"]`
- [x] Add a one‑line **sign‑off** above the footer from the human sender, e.g.:
  > — Alex, Standout Group
  - Reinforces the "from a real person" sender identity decision

### C. Request summary fields (new schema)

- [x] Confirm the website form will be updated to capture: **Name**, **Website URL**, **Business type**, **Biggest issue/goal**
- [x] Agree the JSON keys the n8n webhook will receive (recommended): `name` (or keep `firstName` + `lastName`), `websiteUrl`, `businessType`, `biggestIssue`
- [x] In the email template, replace the three rows in the Request summary card:
  - Row 1: `Name` → `{{ $json.body.fullName }}` (or `{{ $json.body.name }}` once the form is updated)
  - Row 2: `Website URL` → `{{ $json.body.websiteUrl }}` (render as a plain text URL, not a link, to keep the card calm)
  - Row 3: `Business type` → `{{ $json.body.businessType }}`
  - Row 4: `Biggest issue/goal` → `{{ $json.body.biggestIssue }}` (long values — see "long‑text handling" below)
- [x] Remove the **Sector** and **Team size** rows entirely (they came from the old form)
- [x] Add graceful fallbacks for missing values (n8n expression: `{{ $json.body.businessType || '—' }}`) so the card never shows a blank row if a field is missing

### D. Soft CTA (walkthrough) section

- [x] Move the Calendly link out of the primary card position into a smaller, less visually loud block beneath "What happens next"
- [x] Style the button as the **secondary** style — 1px violet border (`#7C5CFF`), transparent fill, violet text — not the primary violet fill — to signal it's optional
- [x] Add a small eyebrow label above the button: `OPTIONAL — 15‑MINUTE WALKTHROUGH` (11px, uppercase, `text.muted` color, `letter-spacing: 0.14em`)
- [x] Body copy directly above the button is the concrete‑benefit version: *"On the walkthrough we'll talk through the 2–3 highest‑impact changes specific to your site, so you leave with clear next steps."*
- [x] Create a dedicated **15‑minute** Calendly event (e.g. `calendly.com/achow-standoutgroup/15min-audit-walkthrough`) and use that URL here. The existing `/30min` event stays available for **post‑audit** deeper conversations and is referenced in the next funnel touch, not here.
- [x] Add UTM params to the Calendly URL: `?utm_source=email&utm_medium=audit_confirmation&utm_campaign=walkthrough_soft_cta`

### E. Bug fixes in the current template

- [x] Fix the **broken unsubscribe link** in the footer. Current markup:
  ```html
  <a <a href="https://lwa24ysc.app.n8n.cloud/webhook/...?email={{ $json.body.email }} target="_blank" style="...">
  ```
  Problems: duplicated `<a`, missing closing quote on `href`, no URL encoding on `{{ $json.body.email }}`.
  Replace with:
  ```html
  <a href="https://lwa24ysc.app.n8n.cloud/webhook/ac3e9b6b-1a6e-4bdc-8fce-041efad6f704?email={{ encodeURIComponent($json.body.email) }}" target="_blank" rel="noopener" style="...">Unsubscribe</a>
  ```
- [x] Move the orphan `<table>` for the unsubscribe pill **inside** the footer `<td>` so it nests correctly (right now it sits below the `<p>` siblings in a way that some clients render oddly)
- [x] Close the outer `<table>` that opens at the top — the current snippet ends with an open `<tr>` and no `</tr></table></td></tr></table></body></html>`. Add the closing tags before shipping.
- [x] Replace smart curly quotes (e.g. `’`) with `&rsquo;` HTML entities to avoid Outlook double‑encoding artefacts
- [x] Add an explicit `<!DOCTYPE html>`, `<html>`, `<head>` (with `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width,initial-scale=1">`, and `<title>`), and `<body>` wrapper. The n8n "Send Email" node usually adds basics but explicit is safer for Gmail/Outlook.

### F. Dark mode email rendering safety

- [x] Set `color-scheme: light dark` and `supported-color-schemes: light dark` in `<head>` so iOS Mail / Apple Mail respects the intended dark theme
- [x] Add `<meta name="color-scheme" content="dark">` and `<meta name="supported-color-schemes" content="dark">`
- [x] Inline every color as a hex on every element (Outlook strips `:root` variables; Gmail mobile inverts pure white text on dark unless told otherwise)
- [x] Avoid pure black (`#000`) backgrounds — Gmail dark mode can force colors. Use a near‑black like `#0E1116` or `#0C0F12` so any auto‑adjustment is minimal
- [ ] Test in: Apple Mail dark, Gmail web (light + dark theme), Gmail iOS dark, Outlook Windows desktop, Outlook web
- [x] Provide explicit `bgcolor=""` attributes on `<table>` and `<td>` as a belt‑and‑braces fallback for Outlook

### G. Variables / n8n binding

- [x] Decide whether the email template should be authored in **n8n's "Send Email" node** (HTML field with `{{ }}` expressions) or as a static MJML/HTML file in the repo that n8n loads
- [x] If staying with the n8n HTML field: confirm every placeholder uses the `{{ $json.body.<field> }}` form — current template mixes `{{ $json.body.firstName }}` with `{{$json.body.firstName}}` (no spaces). Pick one style and lint it
- [x] Add a fallback for the first name: `{{ $json.body.firstName || 'there' }}` so the greeting never reads "Hi ,"
- [x] Document the final variable contract in `Implementation Plan Folder/book_website_audit_n8n_webhook_plan.md` so the form, API, and email stay in sync

### H. Sender identity (from a real person)

- [x] Pick the sender mailbox: **`alex@senderdomain.net`** (locked). Avoid `noreply@…`, `hello@…`, or generic role addresses for this email
- [ ] Set the n8n Send Email node `From` to: `Alex from Standout Group <alex@senderdomain.net>` (display name + address) — display name matters more than the local‑part for inbox trust
- [ ] Set `Reply-To` to the **same** human mailbox so replies actually land in a monitored inbox, not a black hole
- [ ] Verify the sender's domain has working SPF, DKIM, and DMARC records before going live (sending from a new domain without these will land in spam regardless of how good the email is)
- [x] Add the sign‑off line in the email body (`— Alex, Standout Group`) so the sender name in the From header and the sign‑off match
- [x] Decide who actually owns the inbox and is responsible for replying within 1 business day — and document it. The "from a real person" benefit collapses fast if replies go unanswered *(Owner: **Alex**; inbox: `alex@senderdomain.net`; SLA: 1 business day. Recorded in `standout_group_brand_style_guide.md` § 9 and `book_website_audit_n8n_webhook_plan.md` sender identity section.)*

### I. Unsubscribe scoping (marketing‑only)

- [ ] Update the n8n unsubscribe workflow (`https://lwa24ysc.app.n8n.cloud/webhook/ac3e9b6b-...`) so that triggering it sets a **`marketing_unsubscribed: true`** flag on the contact record — it must **not** suppress transactional emails (audit delivery, audit walkthrough confirmation, replies to the human sender)
- [ ] Reflect this split in whatever contact store n8n is writing to (Google Sheets, Airtable, CRM, Supabase, etc.) with **two** flags: `marketing_unsubscribed` and `all_unsubscribed`. The unsubscribe link from this confirmation email only flips the first one
- [x] Update the small print under the unsubscribe pill: `You can unsubscribe from future marketing emails at any time. You’ll still receive your requested audit.`
- [ ] Add a separate path in the unsubscribe workflow for hard‑opt‑out (e.g. `?type=all`) reserved for genuine "remove me entirely" requests — usually triggered by manual support replies, not the email pill
- [ ] Confirm with whoever sends the audit (manual or automated) that they are sending via the **transactional** code path, not the marketing one, so the `marketing_unsubscribed` flag does not accidentally block the audit itself

### J. QA

- [ ] Send a real test from the form with each *new* field populated — verify all four rows render
- [ ] Send a test with `biggestIssue` left blank — verify the row either hides or shows the `—` fallback
- [ ] Send a test from a name with no surname — verify greeting still works
- [ ] Verify the unsubscribe link actually fires the n8n unsubscribe workflow and that the email address is URL‑encoded
- [ ] Verify clicking unsubscribe only sets `marketing_unsubscribed = true` and the contact is **still** eligible to receive the audit and audit walkthrough confirmation
- [ ] Verify the Calendly link opens in a new tab and the **15‑minute** event exists at the new slug
- [ ] Verify the UTM params land in your analytics tool (Plausible, GA4, etc.) when the Calendly button is clicked
- [ ] Verify the `From` header shows `Alex from Standout Group <alex@senderdomain.net>` in Gmail, Apple Mail, and Outlook, and that hitting Reply pre‑fills the same address
- [ ] Run the final HTML through [htmlemail.io / Mail Tester / Litmus or Email on Acid] for a deliverability + rendering check — aim for Mail Tester score 9/10 or higher
- [ ] Confirm SPF / DKIM / DMARC alignment for the `senderdomain.net` sender domain — this is a deliverability blocker if changing brand also means changing sender address
- [ ] Confirm the 2‑business‑day delivery window is operationally realistic — if it isn't, the promise becomes a trust problem, not a trust signal

---

## Standout Group dark theme palette (suggested)

A separate brand system from Carter Dental's warm‑white teal theme. The goal is **premium, calm, confident** — not flashy or hyper‑agency.

| Role | Token | Hex | Notes |
|---|---|---|---|
| Page background | `bg.canvas` | `#0C0F12` | Near‑black, slight blue cast |
| Card surface | `bg.surface` | `#15191E` | One step up from canvas |
| Elevated surface (summary card) | `bg.surface.raised` | `#1B2027` | For nested cards |
| Hairline border | `border.subtle` | `#262C34` | Replaces the warm `#ece5da` |
| Strong border | `border.default` | `#323942` | For card outlines |
| Text primary | `text.primary` | `#F3F5F7` | High contrast, not pure white |
| Text secondary | `text.secondary` | `#AEB6BF` | Body copy |
| Text muted | `text.muted` | `#7B8694` | Labels, footer fine print |
| Accent (CTA) | `accent.brand` | `#7C5CFF` | Suggested: a controlled violet — see brand direction below |
| Accent hover | `accent.brand.hover` | `#6B49F2` | Darker step |
| Accent on‑text | `accent.on` | `#0C0F12` | Used for text on the accent button |
| Soft accent tint | `accent.tint` | `#1E1830` | Background for status pills |
| Success | `signal.success` | `#22C58B` | Optional, for confirmations |

### Why violet (locked)

- Carter Dental already owns **teal/sage** as a *calm healthcare* signal. Reusing it for Standout Group would muddy the two brands and weaken both.
- The chosen **violet `#7C5CFF`** reads as "modern digital agency" without feeling overdone. It pairs well with dark surfaces (teal on dark can look medical/sterile).
- Violet is **only used on:** the primary CTA fill, the secondary CTA outline + text, the eyebrow tag accent, and link colors. It is **never used as a large background fill** — keep the canvas dark and let the violet be a sparing highlight.

> Hard rule: do not mix violet *and* teal in the same email or in any Standout Group asset. Carter Dental's teal stays in the demo client surface area only.

### Typography

- Headlines: `Inter` (700/800) or keep `Manrope` (800) for continuity with the website agency stack
- Body: same family, 400/500
- Email fallback stack: `Inter, Manrope, "Helvetica Neue", Arial, sans-serif`
- Sizes: H1 28–32px, H2 18–20px, body 15–16px, label/eyebrow 11–12px uppercase with `letter-spacing: 0.14em`

### Visual motif

- Generous padding (32px gutters on the card, 22–26px between sections)
- 18–20px border radius on the card, 999px pill for the primary CTA
- One thin 1px hairline border per section divider (no shadows — they render inconsistently on dark mode)
- No images in v1 — the brand reads cleaner as pure typographic dark UI, and avoids image‑blocking issues in Outlook / Gmail clipping

---

## Design + UX best practices for this email

1. **Lead with reassurance, not action.** The recipient just gave you their details — the job of this email is to *confirm receipt* and *set expectations*, not to ask for more. Your new copy ("We've received your audit request… you don't need to do anything else") is correct; protect that hierarchy in the visual layout too. The hero block should breathe.
2. **One dominant CTA per email — and in this email, the CTA is "do nothing".** Demote the Calendly button to secondary (outline) styling so it doesn't compete with the implicit "wait for the audit" message.
3. **Make the Request summary feel like a receipt, not a form.** Use muted label text and slightly stronger value text on a *raised* surface. People skim this section to confirm "yes they got the right info" — speed of comprehension matters more than visual flair.
4. **Render long `biggestIssue` values gracefully.** Set `word-break: break-word;` and `max-width: 100%` on the value cell. Cap the visual height of that row with a softer line‑height (1.5) and a max of ~3 lines visually — but don't truncate the actual text (clients vary).
5. **Use a clear visual rhythm.** Eyebrow → headline → 1 paragraph → summary card → "what happens next" → soft CTA → footer. Don't add anything else. This is a transactional/confirmation email; extra modules (testimonials, case studies, social proof) will *reduce* trust here, not add to it.
6. **Mobile first.** 60%+ of recipients will open on mobile. Padding should collapse to `24px 20px` on small viewports — use a media query with `@media only screen and (max-width: 480px)`. Touch target for the CTA: minimum 44px tall.
7. **Plain‑text alt body.** Always ship a plain‑text version alongside the HTML (n8n's Send Email node has a "Text" field). It massively helps deliverability and accessibility, and the plain version *also* reinforces the calm "we've got this" tone.
8. **Accessibility.** Contrast `text.primary` (`#F3F5F7`) on `bg.canvas` (`#0C0F12`) is well above WCAG AA. Don't drop body text below `#AEB6BF` on the canvas. Use `role="presentation"` on every layout `<table>` (already done in the current template — keep it).
9. **Don't use dark mode CSS hacks for Outlook.** Outlook ignores most media queries. Set explicit hex colors inline on every element instead.

---

## Sales funnel best practices for this stage

The point of this email in the funnel is to **move the lead from "submitted a form" → "trusts that Standout Group is competent and is actually going to deliver the audit"**. Booking a call is a *later* step.

1. **Set a delivery expectation with a specific timeframe.** *Locked:* "within 2 business days, sent to {{ $json.body.email }}." The number you commit to matters less than the discipline of hitting it — pick a window you can hit 95% of the time.
2. **Echo back their data.** The Request summary card already does this — keep it. Showing the recipient that you captured their info correctly is one of the strongest trust signals in a confirmation email and reduces "did my submission go through?" support pings.
3. **Reduce reply‑guilt.** *Locked:* the line *"If anything in this summary is wrong, just reply to this email and we'll update it."* sits directly under the Request summary card. Replying‑to is the highest‑intent micro‑action you can capture at this stage, and it primes a real human relationship for the audit handoff.
4. **Make the optional call feel valuable, not lifeless.** *Locked:* reframe the walkthrough with a concrete benefit — *"On the walkthrough we'll talk through the 2–3 highest‑impact changes specific to your site, so you leave with clear next steps."* That moves the call from "sales meeting" to "personalised guidance".
5. **Don't ask for more info yet.** *Locked:* this email is a *confirmation*, not a *qualification*. No "while we're at it" asks. No "what's your monthly traffic?" follow‑up question. The lead already gave us the form data — that's enough for now.
6. **Plan the next touch.** This email is touch 1. Decide now:
   - Touch 2: the audit itself (within the promised 2‑business‑day window)
   - Touch 3 (if no walkthrough booking): a low‑pressure follow‑up offering the 15‑min walkthrough again, sent ~3 days after the audit
   - Touch 4 (if no reply): a short "did the audit land OK?" email that doubles as a deliverability check
   Document this 3‑step sequence in the same n8n workflow so the funnel isn't a one‑shot. Each touch suppresses if the previous one converted (i.e. don't follow up if they already booked the walkthrough).
7. **Track opens, link clicks, and replies separately.** The walkthrough CTA click is your strongest in‑funnel signal at this stage. *Locked:* the Calendly URL carries `?utm_source=email&utm_medium=audit_confirmation&utm_campaign=walkthrough_soft_cta` so you can measure walkthrough conversion rate from this specific email.
8. **Sender identity matters more than copy.** *Locked:* From‑name is `Alex from Standout Group <alex@senderdomain.net>` and Reply‑To is the same human mailbox. Personal sender names lift reply rates by 2–3x in transactional + onboarding emails.
9. **Unsubscribe scoping.** *Locked:* the unsubscribe pill flips `marketing_unsubscribed = true` only. Transactional sends (the audit itself, walkthrough confirmation) are exempt. The fine print under the pill says so explicitly: *"You can unsubscribe from future marketing emails at any time. You'll still receive your requested audit."*
10. **Brand consistency across the funnel.** The audit PDF + the walkthrough confirmation email + the website's "Audit submitted" success state should all use the same Standout Group violet‑on‑near‑black palette. The audit lead's brain is forming an opinion about Standout Group across 3–4 touchpoints; make every touchpoint look like the same company.

---

## Open questions still to confirm before coding

> All the brand/tone/funnel decisions are now locked (see "Locked decisions" at the top). The questions below are the only blockers left.

- [x] **Sender domain**: **Locked — `senderdomain.net`.** Sender mailbox is `alex@senderdomain.net`; Reply‑To is the same address. SPF / DKIM / DMARC must still be verified on this domain before any send goes live (tracked in Section H + Section J).
- [x] **Reply ownership**: **Locked — Alex.** Alex personally replies to inbound emails (audit corrections, walkthrough requests). Replies land in the `alex@senderdomain.net` mailbox (same as From / Reply‑To) with a 1‑business‑day reply SLA.
- [x] **Operational confidence on 2 business days**: **Locked — confirmed.** Audit production can reliably hit the 2‑business‑day window, so the body copy and the modal success state both promise it.
- [x] **New form field names**: **Locked.** The form, the Zod schema in `app/api/leads/website-audit/route.ts`, the n8n payload, and the email placeholders all agree on `name`, `email`, `websiteUrl`, `businessType`, `biggestIssue` (full contract in `book_website_audit_n8n_webhook_plan.md`).
- [x] **Footer city/location**: **Locked — not included.** The footer carries only the "You're receiving this because…" line; no `Standout Group · <city>` line. (Trade‑off noted: CAN‑SPAM / PECR best practice expects a physical address in the footer; revisit if/when a registered business address is finalised.)

---

## Deliverable summary

When this plan is executed, we will have:

1. A redesigned **dark‑mode Standout Group** email template (violet `#7C5CFF` on near‑black `#0C0F12`, HTML + inline CSS, mobile‑responsive, dark‑mode safe).
2. New copy that **confirms receipt** and commits to **delivering the audit within 2 business days**, instead of pushing a call.
3. A Request summary that mirrors the **new form fields** (name, website URL, business type, biggest issue/goal), followed by a quiet "reply if anything's wrong" line.
4. A **soft, optional** 15‑minute walkthrough CTA framed with a concrete benefit ("the 2–3 highest‑impact changes specific to your site"), tracked via UTMs.
5. Sender identity from a **real person** (`Alex from Standout Group <alex@senderdomain.net>`) with matching Reply‑To and an in‑body sign‑off.
6. **Marketing‑only** unsubscribe scope — the audit itself is exempt — with fixed unsubscribe markup, proper HTML scaffolding, and dark‑mode meta tags.
7. A documented variable contract that keeps the form → API → n8n → email chain in sync, and a planned 4‑touch follow‑up sequence so this isn't a one‑shot funnel.
