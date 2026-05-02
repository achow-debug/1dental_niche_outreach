# Treatments, landing page booking, and dashboard bookings — implementation plan

This document covers three workstreams: **premium empty states** for users with sparse or no bookings, **auth-aware booking** from the public landing page, and **replacing mock data** with Supabase-backed reads (and optional realtime updates). It assumes **mobile-first** layout, accessible patterns, and performance-conscious data fetching.

---

## 1. Goals and scope

| Area | Goal |
|------|------|
| Empty state | Replace minimal placeholders with a **premium, reassuring** empty experience that still drives **one clear primary action** (book). |
| Booking from landing | **Logged in:** fast path (modal summary and/or streamlined in-app booking). **Logged out:** redirect to **login with return URL** so post-auth booking resumes with minimal friction. |
| Data | **Catalog** (`session_types`, optionally `session_categories`) and **user bookings** (`bookings` + related `sessions` / `session_types`) drive UI instead of hardcoded arrays. |

**In scope (recommended):**

- Landing: `components/treatments.tsx`, `components/booking-modal.tsx`, and any CTA that opens booking from `app/page.tsx`.
- Dashboard: `app/dashboard/bookings/bookings-client.tsx`, `components/dashboard/user-home/bookings-preview.tsx`, and related hero / “next appointment” surfaces if they show empty copy.
- Shared libs: `lib/dashboard/user-bookings.ts` (remove or narrow mock usage), `lib/dashboard/booking.ts` (`DASHBOARD_TREATMENTS`, `DASHBOARD_SLOTS`), server loaders such as `lib/dashboard/load-user-bookings-server.ts`.

**Out of scope unless explicitly added:**

- Admin catalog CRUD UX (assume data exists in Supabase).
- Payment capture on landing (keep enquiry / booking intent only unless product changes).

---

## 2. Current state (codebase snapshot)

- **My bookings page** (`app/dashboard/bookings/page.tsx`) already passes **`loadUserBookingsForDashboard()`** into `BookingsClient` — real Supabase when the user is authenticated and RLS allows reads.
- **`USER_BOOKINGS` in `lib/dashboard/user-bookings.ts`** is still documented as mock; **`getRebookHref()`** falls back to it — should be deprecated once all callers use real `bookings` arrays or a safe empty default.
- **Dashboard book flow** (`app/dashboard/book/**`, `lib/dashboard/booking.ts`) uses **`DASHBOARD_TREATMENTS`** and **`DASHBOARD_SLOTS`** — mock catalog and mock availability.
- **Landing booking** (`components/booking-modal.tsx`) uses hardcoded treatment names, dates, and times — not aligned with `session_types` or authenticated booking API (`app/api/dashboard/bookings/route.ts` expects a logged-in user and `startsAt` + `catalogSlug` / `sessionTypeId`).

This plan treats “real time integration” as: **authoritative reads from Supabase**, plus an **optional second phase** of **Realtime subscriptions** where they add clear value (dashboard list / preview), not necessarily every marketing component.

---

## 3. Premium empty state

### 3.1 Where to apply it

| Surface | Current behaviour | Target |
|---------|-------------------|--------|
| `BookingsClient` | Plain card: “No bookings yet.” | Full-width **empty module**: illustration or subtle gradient panel, headline, supporting line, **primary CTA** + optional secondary link. |
| `BookingsPreview` | Dashed box, short line of copy | Match **visual language** of the full page empty state at a **compact** density (still thumb-friendly on small screens). |

### 3.2 Copy and logic (mobile-first messaging)

Prefer **short headline + one sentence body**; avoid clutter on narrow viewports.

**Suggested states (derive from real data + practice timezone, e.g. `Europe/London`):**

1. **No bookings at all** (no upcoming and no history, or policy: treat as “never booked”)  
   - Headline: e.g. “Your calendar is open”  
   - Body: Warm, specific to dentistry.  
   - CTA: “Book your first visit” → `/dashboard/book` (or deep link with suggested `session_type` if you add defaults).

2. **No upcoming, but has history**  
   - Headline: e.g. “Nothing scheduled yet”  
   - Body: “Ready when you are — pick a time that suits you.”  
   - Secondary: “View history” (switch tab on same page).

3. **“No bookings today”** (user has upcoming visits, but **none on local calendar today**)  
   - Headline: e.g. “No visits today”  
   - Body: **Dynamic next slot**: “Your next appointment is **Thu 8 May, 09:30**” or if the next visit is tomorrow: “How about **tomorrow**? Your hygiene visit is at **14:00**.”  
   - CTA: If next is not tomorrow, offer “Browse more times” / “Add another visit” as appropriate.

Implement **one shared helper** (e.g. `buildBookingsEmptyStateContext(bookings, now, timeZone)`) so list page and preview stay consistent and testable.

### 3.3 Visual and UX best practices

- **Touch targets**: primary CTA minimum **44×44 px** effective tap area; full-width button on `< sm`, auto width on `sm+` aligned with existing dashboard patterns (`bookings-client.tsx` already uses `w-full sm:w-auto` in places — mirror that).
- **Hierarchy**: one H2-level visual title in the empty module; do not nest misleading heading levels inside cards.
- **Motion**: respect `prefers-reduced-motion` for any entrance animation (opacity only, or skip animation).
- **Do not** use fake urgency (“only 2 slots left”) unless backed by real inventory.

---

## 4. Booking flow integration (landing ↔ auth ↔ dashboard)

### 4.1 Desired behaviour

| User | Action on “Book” from landing / treatments |
|------|-----------------------------------------------|
| **Logged out** | `redirect` to **`/login?redirect=<encoded-return-path>`** where return path includes intent, e.g. `/dashboard/book?treatment=<catalogSlug>` or `/dashboard/book/calendar?...`. After login, middleware or client should send them to that URL. **Do not** open the legacy mock modal for booking completion. |
| **Logged in** | Prefer **streamlined in-app flow**: navigate to `/dashboard/book` (or calendar step) with **query params** for pre-selected `session_type` / slug. Optional **lightweight confirmation dialog** only if you need to confirm “You’re booking as [email]” before leaving the landing page — avoid duplicating the whole multi-step flow in a modal. |

### 4.2 Session continuity (conversion)

- Use a **single canonical query key** aligned with dashboard routes (e.g. `treatment=<slug>` matching `slugForSessionType` / `resolveSessionTypeForSlug` in `lib/dashboard/catalog-slug.ts`).
- Ensure **login page** preserves and applies **`redirect`** (validate path is same-origin relative path only — **security**: reject open redirects).

### 4.3 Landing treatments CTA wiring

- Each treatment card (once data-driven) should carry **`catalogSlug` or `sessionTypeId`** in the link or button handler.
- **Logged-out** users: `router.push('/login?redirect=' + encodeURIComponent('/dashboard/book?treatment=' + slug))` or use `<Link>` for progressive enhancement where possible.

### 4.4 What happens to `BookingModal`

- **Option A (recommended):** Landing “Book” opens auth-aware navigation only; **retire** multi-step mock modal or reduce it to a **marketing teaser** (“Sign in to see live times”) with one button.  
- **Option B:** Keep modal **only** for logged-in users as a thin **summary + “Continue to calendar”** step — still redirect to real slot selection on dashboard.

---

## 5. Real data integration (Supabase)

### 5.1 Catalog for landing + dashboard picker

**Tables:** `public.session_types` (and optionally `public.session_categories` for grouping / labels).

**Queries:**

- Public or authenticated read depending on RLS: align with existing **`session_types_select`** policy pattern in migrations.
- Filter: `is_active = true`, `deleted_at is null`, order by category `sort_order` then title (if category join is available).

**Mapping to UI:**

- Replace `DASHBOARD_TREATMENTS` and landing static arrays with rows: `title`, `description`, `duration_minutes`, `price_cents`, `currency`, `metadata` for optional badges / marketing lines.
- **`treatmentId` / slug**: continue using **`slugForSessionType`** for URLs and `getRebookHrefFromBookings` consistency.

**Server vs client:**

- **Prefer RSC or server loaders** for landing and dashboard first paint: `fetch` in server component or small `loadCatalogForLanding()` in `lib/`, pass props to client components only where interactivity requires it.
- Avoid shipping service role keys to the browser.

### 5.2 Availability (replace `DASHBOARD_SLOTS`)

**Tables:** `public.sessions` (and/or your practice’s slot model) joined to `session_types`.

- Implement **`getAvailableSlots(sessionTypeId, from, to)`** server-side with timezone-aware boundaries (`practice_settings.timezone` or constant `Europe/London`).
- Dashboard calendar step should request slots via **Route Handler** or server action with auth, not static arrays.

### 5.3 User bookings (already partially wired)

- **`loadUserBookingsForDashboard`** — keep as source of truth for SSR dashboard data.
- Remove reliance on **`USER_BOOKINGS`** for production paths; keep minimal mock **only** for Storybook/tests if needed.

### 5.4 “Realtime” — phased recommendation

| Phase | Approach | When |
|-------|-----------|------|
| **Phase 1** | SSR + **router.refresh()** or **revalidatePath** after successful POST to `app/api/dashboard/bookings` | Baseline; simplest and robust. |
| **Phase 2** | **Supabase Realtime** channel on `bookings` (and optionally `sessions`) for the logged-in user’s rows | When you need live desk-side updates without refresh; scope to **dashboard bookings list / preview** only. |
| **Phase 3** | Optimistic UI + rollback on error | Improves perceived speed on slow networks. |

**Mobile note:** Realtime is fine on modern phones; debounce UI updates and avoid re-rendering entire calendars on every payload field.

---

## 6. Implementation phases (suggested order)

1. **Catalog loader + types** — one module for landing and dashboard; feature-flag or gradual rollout if needed.  
2. **Replace mock treatments** on landing and **`DASHBOARD_TREATMENTS`** consumers; align query params with slug resolver.  
3. **Auth-aware booking entry** from landing + **login redirect** hardening.  
4. **Replace `DASHBOARD_SLOTS`** with real session queries + API.  
5. **Premium empty state** component + shared context builder; swap into `BookingsClient` and `BookingsPreview`.  
6. **Cleanup** — remove or quarantine `USER_BOOKINGS`, trim `BookingModal` mock flow.  
7. **Optional Realtime** for dashboard bookings.

---

## 7. Testing and quality bar

- **Unit tests:** empty-state copy resolver (today / tomorrow / next week edge cases around midnight DST).  
- **E2E (Playwright or similar):** logged-out CTA → login → lands on `/dashboard/book` with treatment pre-selected.  
- **RLS:** verify anon cannot read other users’ bookings; verify catalog visibility matches product.  
- **Lighthouse:** landing LCP should not regress — avoid huge images in empty state; use CSS and small SVG.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Catalog empty in Supabase | Landing fallback: practice message + contact CTA, not broken grid. |
| Slug collisions / missing metadata | DB constraint or deterministic slug; document admin workflow. |
| Double booking under load | Server-side transaction / unique constraints on slot capacity (existing schema rules). |
| Redirect open-URL vulnerability | Strict same-origin path allowlist for `redirect` query param. |

---

## 9. Summary

Ship **server-driven catalog and slots**, **auth-gated booking continuation** from the landing page, and a **shared, timezone-aware empty state** that scales from **dashboard preview** to **full bookings page**. Add **Supabase Realtime** only after the read path is correct and stable, to keep mobile performance and complexity under control.
