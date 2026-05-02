# Final adjustments and tweaks — implementation plan

This document captures the agreed scope from product feedback: auth onboarding, marketing-site mobile UX, section navigation, before/after slider, and UK English copy. **No code has been applied yet**; use the checklists below to track execution.

---

## Summary of outcomes

| Area | Goal |
|------|------|
| Auth | New accounts can use the app immediately after sign-up without an email confirmation gate. |
| Marketing (mobile) | Less cognitive load from overlays; tighter typography and spacing; reduced motion support; smooth scroll; coherent subtle colour refinement without noise. |
| Conversion | A prominent “quick find” control at the top of the home page jumps visitors to the section they need. |
| Before / after | The comparison slider in `TreatmentGallery` behaves correctly on desktop and touch devices. |
| Copy | User-facing strings use **UK English** spelling and wording conventions site-wide (within scope). |

---

## Phase 1 — Remove email verification as a gate to the app

**Context:** `components/auth/signup-form.tsx` already redirects to `/dashboard` when `data.session` is returned from `signUp`. When Supabase requires email confirmation, no session is returned and the UI shows: *“Check your email to confirm your address…”* Disabling confirmation is primarily a **Supabase project** setting; the app should stay consistent with that behaviour.

### Tasks

- [ ] **1.1 Supabase (production and any staging projects)**  
  In the Supabase Dashboard: **Authentication → Providers → Email** — disable **“Confirm email”** (wording may vary slightly by dashboard version). Confirm whether **“Secure email change”** or other flows still meet your security policy.

- [ ] **1.2 Post-change verification**  
  Sign up a throwaway account and confirm: immediate session, redirect to `/dashboard`, and protected routes behave as expected.

- [ ] **1.3 App copy and edge cases**  
  - [ ] After confirmations are off, remove or shorten the “check your email” success path in `signup-form.tsx` if it becomes unreachable, or keep a defensive message only if the API still returns no session in edge cases.  
  - [ ] Review `components/auth/login-form.tsx` (`authError === 'auth'` “Could not confirm email”) and `app/auth/callback` (if present) so messaging matches the new policy and does not imply mandatory confirmation.

- [ ] **1.4 Documentation**  
  Note in `supabase/README.md` (or your internal runbook) that local/staging projects must match this setting so developers are not surprised by different sign-up behaviour.

---

## Phase 2 — Marketing site: mobile modals and conversion-focused overlays

**Context:** The home page is composed in `components/landing-home-client.tsx`. Radix **Dialog** usage on the marketing story includes at least `components/video-testimonial-grid.tsx` (used from `components/social-proof.tsx`). `components/booking-modal.tsx` and `components/why-book-modal.tsx` exist but are not currently imported from the landing client — still include them in the audit in case they are wired from `Header`, `Hero`, or elsewhere.

### Principles

- **Desktop:** Preserve current modal behaviour where it aids trust (e.g. full video story).  
- **Mobile:** Prefer **inline expansion**, **sheet/drawer** with short copy, or **link-out** instead of tall scrollable dialogs where the same job can be done in fewer vertical pixels.  
- **Conversion:** Keep patterns that directly support booking or trust at decision time (e.g. video proof, clear pricing path); drop or simplify “nice to have” modals that repeat long-form content already on the page.

### Tasks

- [ ] **2.1 Inventory**  
  List every `Dialog` / `Drawer` / `Sheet` / full-screen overlay triggered from the **public landing** (`/`, `/book` if it shares patterns). Map trigger → component → approximate content height on small viewports.

- [ ] **2.2 Decide per overlay (document in a short table)**  
  For each: *Keep (desktop + mobile)* | *Keep desktop only; mobile alternative* | *Remove*.

- [ ] **2.3 Implement mobile-specific UX**  
  - [ ] For kept modals: cap height, sticky primary CTA where appropriate, shorter `DialogDescription`, or use `components/ui/drawer.tsx` (Vaul) below `md` breakpoint.  
  - [ ] Ensure focus trap and scroll do not force excessive scrolling to reach the primary action.

- [ ] **2.4 Regression**  
  Keyboard, screen reader labels, and `aria-*` on video dialog remain correct after layout changes.

---

## Phase 3 — Mobile polish: typography, motion, spacing, scroll, colour

**Scope:** Primarily `components/landing-home-client.tsx` and its section components (`hero`, `authority-band`, `smile-quiz`, `why-choose-us`, `treatment-gallery`, `treatments`, `suitability-checker`, `pricing-section`, `comfort-menu`, `how-it-works`, `social-proof`, `our-promise`, `meet-dentist`, `nervous-patients`, `faq-section`, `final-cta`, `footer`, `mobile-sticky-cta`), plus global styles (`app/globals.css`, Tailwind theme if used).

### Tasks

- [ ] **3.1 Typography scale on small screens**  
  Reduce aggressive `text-4xl` / `text-5xl`-style headings on `max-md` where they dominate the viewport; use responsive steps (e.g. `text-3xl md:text-5xl`) and slightly tighter `leading-*` where editorial style allows.

- [ ] **3.2 Whitespace**  
  Audit `section-padding`, `py-20 md:py-28`, large `mb-16` gaps, and `components/landing-home-client.tsx` trailing `h-24 md:hidden` spacer — tighten on mobile without crowding touch targets.

- [ ] **3.3 Reduced motion**  
  - [ ] Wrap or gate CSS transitions/animations (including `ScrollReveal` / `reveal-on-scroll` in `components/scroll-reveal.tsx` and any `animate-*` classes) with `prefers-reduced-motion: reduce` so non-essential motion is skipped or minimised.  
  - [ ] Prefer `scroll-behavior: auto` when reduced motion is requested (see 3.4).

- [ ] **3.4 Smooth scrolling**  
  - [ ] Ensure `html { scroll-behavior: smooth; }` (or equivalent) for in-page anchors **only** when `prefers-reduced-motion: no-preference`.  
  - [ ] Programmatic `scrollIntoView({ behavior: 'smooth' })` in `landing-home-client.tsx` (`handleLearnMoreClick`) should respect the same preference.

- [ ] **3.5 Colour**  
  Introduce **one** restrained accent use on mobile (e.g. soft band behind quick-find or section separators) using existing CSS variables (`primary`, `secondary`, `muted`) — avoid rainbow sections or heavy gradients.

- [ ] **3.6 QA devices**  
  Test on a real narrow phone (375px) and a tall Android; verify sticky CTA and header do not obscure content or focus rings.

---

## Phase 4 — Quick action “find” section (jump links)

**Goal:** At the **start** of the scrollable marketing page (immediately after `Hero` or integrated into the hero fold), a compact row/chip group lets users jump to major sections without long scrolling.

### Existing anchor IDs (verify while building)

| Section | Current `id` (from codebase) |
|---------|-------------------------------|
| Why choose us | `why-us` |
| Treatments | `treatments` |
| Pricing | `pricing` |
| Reviews | `reviews` |
| FAQ | `faq` |
| Our Team | `team` |
| Our Process | `process` |
| Our Reassurance | `reassurance` |

**Gap:** `TreatmentGallery` (`components/treatment-gallery.tsx`) does not expose a section `id` yet — add e.g. `id="results"` or `id="before-after"` for jump links.

### Tasks

- [ ] **4.1 New component**  
  e.g. `components/landing-quick-find.tsx` — horizontal scroll chips on very small screens, grid/wrap on larger; each control is an `<a href="#…">` for crawlability and no-JS behaviour.

- [ ] **4.2 Placement**  
  Insert in `landing-home-client.tsx` immediately after `<Hero … />` (or inside hero if design prefers a single fold).

- [ ] **4.3 Optional enhancement**  
  `scroll-margin-top` on target sections so fixed header / sticky UI does not obscure section titles when jumping.

- [ ] **4.4 Analytics (optional)**  
  If you use events, log quick-find usage to validate conversion hypothesis.

---

## Phase 5 — Before / after slider bug (`TreatmentGallery`)

**File:** `components/treatment-gallery.tsx`

### Likely technical causes to investigate (tick when ruled in or out)

- [ ] **5.1 Divider vs clip alignment**  
  The reveal uses `clip-path: inset(0 ${100 - sliderPosition}% 0 0)` while the divider uses `left: ${sliderPosition}%` on a `w-1` element without horizontal centre correction — visual mismatch is common; try `transform: translateX(-50%)` on the divider group so the handle aligns with the reveal edge.

- [ ] **5.2 Touch / pointer**  
  Confirm the `type="range"` overlay receives touches on iOS Safari (z-index stacking vs labels or `pointer-events`).

- [ ] **5.3 Before / after semantics**  
  Verify with stakeholders that the **left** region is intended to show **before** and **right** **after** (or the inverse) and that image `src` order matches; swap layers or labels if product says the comparison reads “wrong”.

- [ ] **5.4 `onError` / fallback**  
  Both images toggle `useFallback`; confirm no flicker or stuck state when switching tabs (`activeTab`) and when local `/images/…` paths 404.

- [ ] **5.5 Reduced motion**  
  If auto-animated demos are added later, gate them; static slider should remain usable with motion reduced.

---

## Phase 6 — UK English across the website

### Convention (examples)

- *colour, favourite, organise, centre, behaviour, enrol, paediatric* (where clinically appropriate), *practise* (noun) vs *practice* (clinic) — use correctly.  
- Avoid US-only terms where a UK alternative is clearer (*“surgery”* vs ambiguous US terms in dental context — follow your brand glossary).  
- Dates and copy: UK formatting where dates appear.

### Tasks

- [ ] **6.1 Grep-assisted pass**  
  Search for common US spellings: `-ize` → `-ise`, `color` → `colour` (in user-visible strings only), `center` → `centre`, `behavior` → `behaviour`, `customize` → `customise`, `recognize` → `recognise`, `license` (noun) vs `licence`, etc.

- [ ] **6.2 Scope**  
  Prioritise **user-visible** strings in `components/**`, `app/**` page copy, emails/templates if any, and metadata `description` fields. **Skip** code identifiers, npm package names, URLs, and third-party API field names.

- [ ] **6.3 Consistency pass**  
  Align mixed variants (e.g. “sign in” vs “log in”) with brand preference; UK English does not mandate one over the other, but pick one set of terms.

- [ ] **6.4 Final read**  
  Human proofread of high-traffic pages: home, login, sign-up, book, dashboard welcome if patient-facing.

---

## Phase 7 — Release and QA checklist

- [ ] **7.1** Run `pnpm lint` / `npm run lint` and production build.  
- [ ] **7.2** Cross-browser: Safari iOS, Chrome Android, desktop Safari, Chrome.  
- [ ] **7.3** Auth: sign-up, sign-out, password sign-in, redirect query param from booking CTA.  
- [ ] **7.4** Accessibility: tab order on quick-find, slider keyboard (`ArrowLeft` / `ArrowRight` already wired), contrast on any new colour bands.

---

## Dependency order

1. **Phase 1** (Supabase + signup/login copy) can ship independently.  
2. **Phase 5** (slider) is a focused bugfix — can parallel with **Phase 6** (copy).  
3. **Phase 4** (quick find) benefits from **Phase 3** (spacing/scroll) for final polish but can start earlier once section `id`s are stable.  
4. **Phase 2** and **Phase 3** overlap; consider one mobile-focused PR after a short design pass on which modals stay.

---

## Notes

- **Security:** Turning off email confirmation increases reliance on email ownership at password reset and comms; ensure support processes and Supabase rate limits are acceptable.  
- **Scope control:** This plan targets the described surfaces; avoid expanding into unrelated dashboard refactors unless a regression appears.

When every checkbox in Phases 1–7 is complete, this document can be archived or updated with a completion date in the heading.
