# Cursor-recommended implementation plan

Frontend-focused follow-up from the Carter Dental Studio site review. Scope matches the earlier brainstorm: **no backend** unless a bullet explicitly says otherwise.

---

## Goals

- Fix invalid HTML and broken in-page navigation.
- Improve mobile safety (notch / home indicator) and motion accessibility.
- Reduce UX confusion between booking surfaces and tighten visual consistency.
- Prepare trust signals (real links, clear demo vs live booking copy).

---

## Phase 1 — Critical fixes

| # | Task | Notes |
|---|------|--------|
| 1.1 | **Unique section IDs** | `id="about"` is duplicated on `WhyChooseUs` and `MeetDentist`. Choose distinct IDs (e.g. `#why-us` and `#team` or `#practice` and `#dentist`) and update [components/header.tsx](components/header.tsx) / [components/footer.tsx](components/footer.tsx) anchor `href`s to match. |
| 1.2 | **“Learn more” target** | [app/page.tsx](app/page.tsx) scrolls to `#about`; after 1.1, point it at the intended first “about” block or rename handler for clarity. |
| 1.3 | **Safe area on mobile CTA** | [components/mobile-sticky-cta.tsx](components/mobile-sticky-cta.tsx) uses `safe-area-pb` — define it in [app/globals.css](app/globals.css) (e.g. `padding-bottom: max(1rem, env(safe-area-inset-bottom))`) or use Tailwind arbitrary utilities. |

---

## Phase 2 — Accessibility and layering

| # | Task | Notes |
|---|------|--------|
| 2.1 | **Skip link** | Add a visually hidden “Skip to main content” link as first focusable element in [app/layout.tsx](app/layout.tsx) or [components/header.tsx](components/header.tsx); target `<main>` with `id="main-content"` or `tabIndex={-1}`. |
| 2.2 | **Heading hierarchy** | Audit sections so one `h1` (hero) and logical `h2`/`h3` order across [app/page.tsx](app/page.tsx) sections. |
| 2.3 | **`prefers-reduced-motion`** | Disable hero scroll parallax in [components/hero.tsx](components/hero.tsx) when `prefers-reduced-motion: reduce` (match patterns in [app/globals.css](app/globals.css)). |
| 2.4 | **Decorative video** | In [components/background-video.tsx](components/background-video.tsx), mark container `aria-hidden="true"` if screen readers should ignore it; keep text contrast over video verified at all breakpoints. |
| 2.5 | **Film grain vs content** | Confirm [app/layout.tsx](app/layout.tsx) `.film-grain` stacking does not hurt readability or modal focus; adjust `z-index` / opacity if needed. |

---

## Phase 3 — Performance and polish

| # | Task | Notes |
|---|------|--------|
| 3.1 | **Throttle hero scroll** | Replace per-scroll `setState` with `requestAnimationFrame` or only update when delta exceeds a threshold to cut main-thread work on mobile. |
| 3.2 | **Primary button recipe** | Align “Book a visit” (and key CTAs) across hero, header, footer, sticky bar: height, radius, shadow, hover/active in one place (e.g. shared `className` or variant on [components/ui/button.tsx](components/ui/button.tsx)). |
| 3.3 | **Secondary CTA focus** | Ensure “Learn why patients choose us” has visible `:focus-visible` styles consistent with the design system. |
| 3.4 | **Images** | Audit `next/image` usage for `sizes` and priority only where needed (hero already `priority`). |

---

## Phase 4 — IA, booking UX, and trust

| # | Task | Notes |
|---|------|--------|
| 4.1 | **Pricing anchor** | Add `id="pricing"` to [components/pricing-section.tsx](components/pricing-section.tsx) if you want footer/header deep links; add nav item only if it fits IA. |
| 4.2 | **Modal vs `/book`** | Decide primary path: modal-only, page-only, or modal with “Open full booking page” link to [app/book/page.tsx](app/book/page.tsx). Reduce duplicate logic if possible (shared step component or copy). |
| 4.3 | **Booking modal expectations** | Until backend exists, add short copy that dates/times are **examples** or “typical availability” in [components/booking-modal.tsx](components/booking-modal.tsx). |
| 4.4 | **Placeholder content** | Replace footer placeholder address and `href="#"` legal links in [components/footer.tsx](components/footer.tsx) when real URLs/copy exist; use `tel:` / `mailto:` for phone and email. |
| 4.5 | **Theme** | Either wire [components/theme-provider.tsx](components/theme-provider.tsx) in layout + add a theme toggle, or document light-only and avoid shipping unused dark paths. |

---

## Phase 5 — Optional enhancements

| # | Task | Notes |
|---|------|--------|
| 5.1 | **Sticky section nav** | Desktop (or mobile drawer) jump links for long page: Treatments, Pricing, Reviews, FAQ, etc. |
| 5.2 | **Logo asset** | Replace letter “C” block with wordmark/monogram for stronger brand at small sizes. |
| 5.3 | **Self-hosted hero video** | Host loop locally for fewer third-party dependencies and predictable LCP. |

---

## Progress checklist

Use this checklist to track completion. Check off items as you finish them.

### Phase 1 — Critical fixes

- [ ] 1.1 Unique section IDs (`WhyChooseUs` / `MeetDentist`) + nav `href` updates
- [ ] 1.2 `handleLearnMoreClick` / `#about` behavior updated after ID change
- [ ] 1.3 Safe-area padding for mobile sticky CTA defined and verified on a notched device

### Phase 2 — Accessibility and layering

- [ ] 2.1 Skip to main content link
- [ ] 2.2 Heading hierarchy audit across landing sections
- [ ] 2.3 Hero parallax respects `prefers-reduced-motion`
- [ ] 2.4 Background video a11y (e.g. `aria-hidden`) + contrast check
- [ ] 2.5 Film grain / modal stacking review

### Phase 3 — Performance and polish

- [ ] 3.1 Hero scroll listener throttled or optimized
- [ ] 3.2 Primary CTA styles unified
- [ ] 3.3 Secondary CTA `:focus-visible` styles
- [ ] 3.4 Image `sizes` / priority audit

### Phase 4 — IA, booking UX, and trust

- [ ] 4.1 Optional `#pricing` (and nav) if desired
- [ ] 4.2 Booking modal vs `/book` strategy + dedupe if feasible
- [ ] 4.3 Demo/expectation copy in booking modal
- [ ] 4.4 Real contact + legal URLs in footer
- [ ] 4.5 Theme provider decision (wire or simplify)

### Phase 5 — Optional

- [ ] 5.1 Sticky / jump navigation for long page
- [ ] 5.2 Logo / wordmark upgrade
- [ ] 5.3 Self-hosted hero video (optional)

---

## Quick reference — files most likely touched

| Area | Files |
|------|--------|
| IDs & nav | [components/why-choose-us.tsx](components/why-choose-us.tsx), [components/meet-dentist.tsx](components/meet-dentist.tsx), [components/header.tsx](components/header.tsx), [components/footer.tsx](components/footer.tsx), [app/page.tsx](app/page.tsx) |
| Global styles / safe area / motion | [app/globals.css](app/globals.css), [app/layout.tsx](app/layout.tsx) |
| Hero | [components/hero.tsx](components/hero.tsx) |
| Video | [components/background-video.tsx](components/background-video.tsx) |
| Mobile CTA | [components/mobile-sticky-cta.tsx](components/mobile-sticky-cta.tsx) |
| Booking | [components/booking-modal.tsx](components/booking-modal.tsx), [app/book/page.tsx](app/book/page.tsx) |
| Pricing anchor | [components/pricing-section.tsx](components/pricing-section.tsx) |
| Buttons | [components/ui/button.tsx](components/ui/button.tsx) |

---

*Generated from the frontend review brainstorm. Adjust phases or scope as product priorities change.*
