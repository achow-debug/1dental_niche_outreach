# Standout Group — Brand Mini System (v1, dark mode)

> A separate brand system from `website_brand_style_guide.md`. That guide is for the **Carter Dental** demo client (warm‑white teal). This guide is for **Standout Group**, the agency that actually sends emails, audits, and follow‑ups to leads. **Never mix violet + teal** in the same asset.

## 1. Brand at a glance

- **Wordmark (v1):** `Standout Group` (text lockup only — no image logo)
- **Tagline (v1):** `Websites that convert` (alt: `Standout · Conversion‑led websites`)
- **Tone:** premium, calm, confident — *not* flashy or hyper‑agency
- **Voice:** clear, low‑pressure, educative; reassure first, sell second
- **Core promise (transactional emails):** "audit delivered within 2 business days"

## 2. Locked decisions

- **Accent color:** violet `#7C5CFF` on near‑black `#0C0F12`. (Mint alt is dropped. Teal stays with Carter Dental.)
- **Logo:** text lockup only for v1. Image logo deferred to a later iteration.
- **Delivery window in email body:** within 2 business days.
- **Sender identity:** real person — `Alex from Standout Group <alex@senderdomain.net>`. No `noreply@…`. Reply‑To matches the sender.
- **Unsubscribe scope:** marketing only. Transactional sends (audit delivery, walkthrough confirmation) always go through.

## 3. Dark mode palette (locked tokens)

These are the canonical hex values. Inline them as hex on every element in email HTML — Outlook strips CSS variables.

| Role | Token | Hex | Usage |
|---|---|---|---|
| Page background | `bg.canvas` | `#0C0F12` | Email body `<body>` and outer table bgcolor |
| Card surface | `bg.surface` | `#15191E` | Primary card container |
| Elevated surface | `bg.surface.raised` | `#1B2027` | Request summary card (nested) |
| Hairline border | `border.subtle` | `#262C34` | Section dividers, summary card rows |
| Strong border | `border.default` | `#323942` | Outer card outline |
| Text primary | `text.primary` | `#F3F5F7` | Headlines, body emphasis |
| Text secondary | `text.secondary` | `#AEB6BF` | Body copy |
| Text muted | `text.muted` | `#7B8694` | Labels, footer fine print, fallback URLs |
| Accent (CTA) | `accent.brand` | `#7C5CFF` | Primary CTA fill, link text, eyebrow accents |
| Accent hover | `accent.brand.hover` | `#6B49F2` | Darker step (limited use in email) |
| Accent on‑text | `accent.on` | `#0C0F12` | Text/icon on a violet fill (e.g. primary button label) |
| Soft accent tint | `accent.tint` | `#1E1830` | Background for status pills |
| Pill border | `border.pill` | `#2C2647` | 1px border on the soft‑violet pill |
| Success | `signal.success` | `#22C58B` | Confirmation strokes (optional) |

### Hard rules

- Violet is only ever used on: primary CTA fill, secondary CTA outline + text, the eyebrow tag accent, and link colors.
- Violet is **never** a large background fill. Keep the canvas dark; let violet be a sparing highlight.
- Do not mix violet *and* teal in the same email or any Standout Group asset.

## 4. Typography

Email‑safe stack (system safe weights only; web fonts are not reliable in Outlook):

```
font-family: Inter, Manrope, "Helvetica Neue", Arial, sans-serif;
```

- **Headlines:** `Inter` 700/800 (or `Manrope` 800 for continuity with the website agency stack)
- **Body:** same family, 400/500
- **Sizes:**
  - H1: 28–32px, line‑height 1.15
  - H2: 18–20px, line‑height 1.3
  - Body: 15–16px, line‑height 1.55
  - Label / eyebrow: 11–12px, uppercase, `letter-spacing: 0.14em`

## 5. Layout + visual motif

- Single column, 600px container, centered, on `bg.canvas` (`#0C0F12`).
- Card: `bg.surface` (`#15191E`), 18–20px border radius, 1px `border.default` (`#323942`) outline.
- Nested summary card: `bg.surface.raised` (`#1B2027`), same radius, 1px `border.subtle` (`#262C34`) outline.
- Section padding: 32px gutters on the card, 22–26px vertical rhythm between sections.
- Buttons:
  - **Primary:** 999px pill, `accent.brand` fill, `accent.on` text. Use sparingly.
  - **Secondary:** 999px pill, transparent fill, 1px `accent.brand` border, `accent.brand` text. Use for *optional* / *low‑intent* actions like the walkthrough CTA.
- **No shadows** — they render inconsistently across dark‑mode clients.
- **One** thin 1px hairline per section divider.
- **No images** in v1 — pure typographic dark UI. Avoids image‑blocking / proxy issues in Gmail + Outlook.

## 6. Status pill (eyebrow chip)

For the "Audit request received" pill in the email header:

- Background: `accent.tint` `#1E1830`
- Border: 1px solid `border.pill` `#2C2647`
- Text: `accent.brand` `#7C5CFF`
- Font: 11px uppercase, `letter-spacing: 0.14em`, weight 700
- Padding: 6px 10px, 999px radius

## 7. Mobile + accessibility rules

- 600px desktop → collapse padding to `24px 20px` on `@media only screen and (max-width: 480px)`.
- Minimum touch target on CTAs: 44px tall.
- Contrast: `text.primary` on `bg.canvas` is well above WCAG AA. **Never** drop body text below `#AEB6BF` on the canvas.
- All layout `<table>` must carry `role="presentation"` for screen readers.

## 8. Email rendering safety

- Set `color-scheme: light dark` and `supported-color-schemes: light dark` in `<head>`.
- Add `<meta name="color-scheme" content="dark">` and `<meta name="supported-color-schemes" content="dark">`.
- Inline every color as a hex on every element.
- Avoid pure black (`#000`). Use `#0C0F12`.
- Provide explicit `bgcolor=""` attributes on `<table>` and `<td>` as a belt‑and‑braces fallback for Outlook.
- Always ship a plain‑text alt body alongside the HTML.

## 9. Sender identity

- **From:** `Alex from Standout Group <alex@senderdomain.net>`
- **Reply‑To:** same human mailbox (`alex@senderdomain.net`)
- **Sign‑off line in body:** `— Alex, Standout Group` (must match the From display name)
- **Reply owner:** **Alex** personally handles inbound replies (audit corrections, walkthrough requests). **SLA: 1 business day.**
- **Hard rule:** the inbox must be monitored. A real‑person sender that goes unanswered is worse than a `noreply@`.

## 10. Where this brand applies

- `audit-request-received.html` (this email)
- The future audit PDF cover + headers
- The walkthrough confirmation email
- The "Audit submitted" success state on the website
- Any other Standout Group → lead touchpoint

All four touchpoints must use the **same** violet‑on‑near‑black palette so the lead's brain forms a single consistent opinion of Standout Group across the funnel.
