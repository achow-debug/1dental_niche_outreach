# Calendly embed integration — implementation plan

**Scope:** Add Calendly booking using the **public embed only** (no Scheduling API). Admins configure event types, invitee questions, locations, and availability entirely in Calendly. This site embeds the booking UI and aligns branding within Calendly’s supported parameters.

**Stack (from repo):** Next.js **16** (App Router under `app/`), React **19**, TypeScript, Tailwind CSS **4** (`@import 'tailwindcss'` + tokens in `app/globals.css`), Radix UI (`components/ui/dialog.tsx` and others), deployment on **Vercel** (`@vercel/analytics` present). Landing composition: `app/page.tsx` → `components/landing-home-client.tsx` with section components and shared booking CTA via `lib/landing/book-cta`.

---

## (a) Recommended embed approach (with reasoning)

### Primary recommendation: **Calendly “advanced” JavaScript widget** (`widget.js` + `Calendly.initInlineWidget`)

Use the official embed script (`https://assets.calendly.com/assets/external/widget.js`) and the **inline** API against a dedicated container `div` (per [Calendly’s embed documentation](https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview)).

**Reasoning**

| Criterion | JS inline widget | Raw `<iframe src="…">` only |
|-----------|------------------|-----------------------------|
| **Next.js / SSR** | Load script and call `init*` only inside a **client component** `useEffect` (or `next/script` + effect). No `window` / `Calendly` on the server → **no SSR breakage**. | Same SSR constraint; iframe `src` still third-party. |
| **Branding query params** | Supported via `url` passed to `initInlineWidget` (append `primary_color`, `text_color`, `background_color`, `hide_gdpr_banner`, etc.). | Same params on URL; fewer lifecycle hooks. |
| **Route changes (App Router)** | Remount keyed by pathname or explicit cleanup: clear container + avoid double-init when navigating **client-side**. | Must manually resize / avoid duplicate iframes. |
| **Layout shift (CLS)** | Reserve **min-height** on the wrapper (e.g. `min-h-[600px]` or documented Calendly min) before init; optional skeleton. | Same if height not reserved. |
| **Optional popup CTA** | Either **`Calendly.initPopupWidget`** (Calendly’s own overlay) **or** Radix `Dialog` wrapping the **same** inline pattern for chrome that matches the site. | Popup usually still needs `widget.js` for Calendly popup helper. |

**Conclusion:** Prefer **`widget.js` + `initInlineWidget`** for the main “Book a Call” page/section. For a secondary “open from CTA” flow, prefer **`Calendly.initPopupWidget`** for minimal code and Lighthouse-friendly lazy script load, **or** a Radix `Dialog` + inline embed if you want the modal frame, title, and focus trap to match `components/ui/*` exactly (slightly more work: ensure sufficient dialog height and mobile scroll).

**Limitations (explicit)**

- **No full CSS control** inside the widget: typography, spacing, and component shapes are Calendly-controlled inside their iframe.
- **Colours** are approximations: Calendly expects **hex** (e.g. `#5a9a9a`). Site tokens in `app/globals.css` use **OKLCH** (`--primary`, `--background`, etc.) — you will **map** brand colours to hex for embed params (env or small constants file), not read OKLCH directly into Calendly.
- **`hide_gdpr_banner`:** Only consider if **legal/compliance** agrees your site’s cookie/privacy UX already covers what the banner would surface; document the decision in internal runbooks.
- **Invitee questions:** Defined in Calendly; they **automatically appear** in the embed — no duplicate form required on-site for v1.

---

## (b) Step-by-step task list (small, checkable)

### Calendly account (non-code)

- [ ] Create or choose the **single event type** used for “Book a call” (placeholder URL acceptable in dev, e.g. `https://calendly.com/your-org/30min`).
- [ ] Configure **Invitee questions** (and custom questions) in Calendly; verify in Calendly preview.
- [ ] Set **location types** (Google Meet, in-person, phone, etc.) in Calendly only.
- [ ] Decide **GDPR banner** policy: show in widget vs rely on site banner + `hide_gdpr_banner` (legal sign-off if hiding).

### Config & secrets (Vercel + local)

- [ ] Add `NEXT_PUBLIC_CALENDLY_EVENT_URL` to **`.env.local.example`** and Vercel **Environment Variables** (Production / Preview).
- [ ] Add optional `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR`, `NEXT_PUBLIC_CALENDLY_TEXT_COLOR`, `NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR` (hex), or one agreed naming scheme — see section (d).
- [ ] Optional flag: `NEXT_PUBLIC_CALENDLY_EMBED_ENABLED` for staged rollout.

### Implementation (code — later phase; listed for traceability)

- [ ] Add a **singleton script loader** (e.g. `loadCalendlyScript(): Promise<void>`) that appends `widget.js` once and resolves when `window.Calendly` exists; handle concurrent calls and errors.
- [ ] Add **`CalendlyInlineEmbed`** client component: props for `eventUrl`, branding options, optional `prefill` object (optional for future), `className`, reserved height.
- [ ] `useEffect`: after script ready, `Calendly.initInlineWidget({ url, parentElement, prefill: … })`; return cleanup that **clears** `parentElement` and avoids leaving duplicate listeners (use **mount key** on pathname if embed lives in shared layout).
- [ ] Add route **`app/book-a-call/page.tsx`** (or agreed path): server component shell (metadata, layout) + client embed section (“Book a Call”).
- [ ] Wire **primary navigation**: add “Book a call” link in `components/header.tsx` / `components/footer.tsx` / optional `#book-call` section on landing — align copy with existing “Book a visit” vs consultation positioning (product decision).
- [ ] **Optional modal CTA:** small client wrapper using `Calendly.initPopupWidget` **or** `Dialog` + `CalendlyInlineEmbed`; lazy-open script on first click where possible.
- [ ] **Fallback:** if script fails or times out, show `Link` / `Button` opening the same `NEXT_PUBLIC_CALENDLY_EVENT_URL` in a **new tab** (still branded as far as Calendly’s hosted page allows).

### QA & rollout

- [ ] Run through section (e) checklist on Preview deployment.
- [ ] Run Lighthouse on `/book-a-call` (mobile + desktop) before/after; compare **LCP/CLS/TBT** impact of script loading strategy.

---

## (c) Files / components to add or modify (repo-specific paths)

### Add (proposed)

| Path | Purpose |
|------|--------|
| `lib/calendly/load-script.ts` | Idempotent `widget.js` loader; typed `window.Calendly` minimal interface. |
| `lib/calendly/build-calendly-url.ts` | Append embed query params (`primary_color`, `text_color`, `background_color`, `hide_gdpr_banner`) to base event URL safely. |
| `lib/calendly/embed-config.ts` | Read `process.env.NEXT_PUBLIC_*` and defaults; single place for placeholder URL in dev. |
| `components/calendly/calendly-inline-embed.tsx` | Client-only inline embed + reserved height + error/fallback UI. |
| `components/calendly/calendly-popup-button.tsx` | *Optional:* CTA that calls `initPopupWidget` after script load. |
| `app/book-a-call/page.tsx` | Primary “Book a Call” page with metadata (`title`, `description`). |
| `app/book-a-call/opengraph-image` or reuse site default | Only if marketing wants unique OG; otherwise skip. |

### Modify (likely)

| Path | Purpose |
|------|--------|
| `components/header.tsx` | Add nav link or secondary CTA to `/book-a-call` (and mobile menu duplicate). |
| `components/footer.tsx` | Optional “Book a call” in nav or contact column. |
| `components/landing-home-client.tsx` | Optional new `<ScrollReveal>` section component for inline embed or teaser + link. |
| `.env.local.example` | Document all `NEXT_PUBLIC_CALENDLY_*` variables. |

### Optional / product-dependent

| Path | Purpose |
|------|--------|
| `components/final-cta.tsx`, `components/mobile-sticky-cta.tsx`, `components/hero.tsx` | If “Book a call” should split from existing `onBookClick` → `/dashboard/book` flow; may need a second handler or prop. |
| `app/layout.tsx` | **Avoid** global script here unless you accept site-wide third-party load; prefer route-level or component-level lazy load. |

**Note:** `app/book/page.tsx` is a **demo multi-step booking UI** unrelated to Calendly; do not overload it unless product explicitly wants Calendly there — prefer a dedicated **`/book-a-call`** route to avoid confusing “demo booking” with real Calendly.

---

## (d) Environment / configuration

Store the **public** event link and **hex** brand colours as **`NEXT_PUBLIC_*`** vars so the client embed can read them on Vercel without server secrets.

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `NEXT_PUBLIC_CALENDLY_EVENT_URL` | Yes | `https://calendly.com/org-name/event-type` — single event type. |
| `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR` | Recommended | Hex for buttons/links inside widget (align to brand teal, e.g. derived from marketing hex, not raw OKLCH). |
| `NEXT_PUBLIC_CALENDLY_TEXT_COLOR` | Optional | Body text inside widget. |
| `NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR` | Optional | Page background inside widget; align to `background` / `card` feel. |
| `NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER` | Optional | Typically `1` or `true` only with legal approval; implementation maps to `hide_gdpr_banner=1` in URL. |
| `NEXT_PUBLIC_CALENDLY_EMBED_ENABLED` | Optional | Feature flag: when false, page shows copy + external link only. |

**Vercel:** Project → Settings → Environment Variables; set per **Production** and **Preview**; redeploy after changes.

**Local:** Copy from `.env.local.example` to `.env.local` (gitignored; already implied by repo patterns).

---

## (e) QA checklist

### Functional

- [ ] Inline embed loads on **`/book-a-call`**; booking can be completed end-to-end in Calendly test mode / real event as appropriate.
- [ ] **Invitee questions** configured in Calendly appear in the embed and submit correctly.
- [ ] **Timezone:** invitee sees correct local time; organizer side in Calendly shows expected zone (spot-check a known slot).
- [ ] **Route change:** navigate away and back (client-side); **no double iframe** / duplicated widget.
- [ ] **Fallback link** works when ad-block or script error simulates failure.

### Browsers & devices

- [ ] **Chrome** + **Safari** (desktop).
- [ ] **Mobile Safari** + **Chrome Android**; keyboard does not trap focus irrecoverably inside modal (if using Radix `Dialog`).
- [ ] **Viewport:** embed scrollable inside short viewports; sticky header (`components/header.tsx`) does not obscure critical Calendly controls.

### Privacy / consent / blockers

- [ ] **Cookie / CMP banner:** if the site adds or already has a consent banner, verify behaviour when user **has not** accepted marketing/analytics — Calendly may still load as **strictly necessary** for booking (legal classification is yours); document actual behaviour.
- [ ] **uBlock / Privacy Badger:** widget blocked → fallback link still usable.
- [ ] **GDPR banner inside widget:** visible or hidden per policy; matches privacy copy on `/privacy`.

### Performance (Lighthouse)

- [ ] **CLS:** reserved vertical space for embed region; no large late layout jump when iframe mounts.
- [ ] **Script cost:** `widget.js` loaded **lazy** (after interaction, on route enter, or `lazyOnload`) — confirm acceptable **LCP/TBT** on 4G throttling.

---

## (f) Rollout plan

1. **Preview branch / PR:** Implement behind `NEXT_PUBLIC_CALENDLY_EMBED_ENABLED` (optional). QA on Vercel Preview URL.
2. **Staging verification:** Full QA checklist (e); confirm env vars scoped to Preview match Production names.
3. **Production:** Enable flag (or ship page live), monitor for support tickets (“can’t book”).
4. **Fallback:** Persistent **“Open booking in new tab”** link using the same configured URL (with or without query params) if embed fails — zero dependency on `widget.js`.
5. **Rollback:** Disable flag or revert route link in header/footer to remove traffic to embed page; Calendly-hosted link still works standalone.

---

## (g) Future upgrades

| Upgrade | Notes |
|---------|--------|
| **Prefill name / email** | Calendly supports prefill via embed API / URL parameters when you add a small on-site step or read from session; keep **optional** — not required for v1. |
| **UTM / campaign tracking** | Append `utm_source`, `utm_medium`, `utm_campaign` to embed URL for attribution inside Calendly (where supported). |
| **Webhooks / CRM sync** | Requires **higher Calendly tier** / API products — explicitly out of scope for “embed only” v1; revisit if plan upgrades. |
| **Multiple event types** | Switch `NEXT_PUBLIC_CALENDLY_EVENT_URL` per campaign page or pass prop from CMS later. |
| **Content Security Policy** | If CSP headers are added on Vercel, allowlist `https://assets.calendly.com`, `https://calendly.com` (and any Calendly iframe/frame-src domains Calendly documents at that time). |

---

## Security / privacy summary (for stakeholders)

| Topic | Detail |
|-------|--------|
| **Data passed from our site** | v1: primarily the **event URL** + **branding query params**. No PII required on-page. Future prefill would pass **name/email** only if user supplied them. |
| **Where data is processed** | Booking form and answers live in **Calendly’s iframe** (third party). Subject to Calendly privacy policy + DPA if applicable. |
| **Cookies** | Calendly may set **first- and third-party** cookies for session, preferences, or analytics depending on product and browser privacy settings; treat as **third-party embed** in cookie policy and CMP rules. |
| **`hide_gdpr_banner`** | Reduces duplicate GDPR UI **inside** the widget only; does not remove Calendly’s underlying processing — coordinate with legal. |

---

## Appendix: Repo discovery snapshot

- **Framework:** Next.js `16.2.0`, `app/` router, `next.config.mjs`.
- **Styling:** Tailwind 4 + `app/globals.css` OKLCH design tokens (`--primary`, `--background`, …).
- **UI primitives:** `components/ui/button.tsx`, `components/ui/dialog.tsx` (Radix).
- **Existing booking UX:** Logged-in flow to `app/dashboard/book`; landing uses `handleBookClick` in `components/landing-home-client.tsx`; standalone demo at `app/book/page.tsx`.

This document is **plan-only**; implementation should follow in a separate change set after product/legal sign-off on GDPR banner behaviour and the public event URL.
