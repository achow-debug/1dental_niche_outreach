# Carter Dental Studio - Implementation Plan

## Project Overview

A front-end-only website prototype for a fictional private dental clinic called "Carter Dental Studio" in Manchester, UK. The site is conversion-focused with a single CTA: **"Book Appointment"**.

---

## Design System

### Color Palette (5 colors maximum)

| Token | Purpose | Value |
|-------|---------|-------|
| `--background` | Page background | Warm off-white `#FAFAF8` |
| `--foreground` | Primary text | Dark charcoal `#1C1C1E` |
| `--card` | Card surfaces | Pure white `#FFFFFF` |
| `--muted` | Secondary text | Medium gray `#6B7280` |
| `--primary` | Accent color (single) | Muted teal `#5A9A9A` |

**Accent Color Application:**
- All CTA buttons use `--primary`
- Hover states use darker teal `#4A8A8A`
- Text highlights and links use `--primary`
- Icon accents use `--primary`
- Active states and focus rings use `--primary`

### Typography

**Font:** Inter (single font family)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 48px / 3rem | 700 | 1.1 |
| H2 (Section) | 36px / 2.25rem | 600 | 1.2 |
| H3 (Card title) | 24px / 1.5rem | 600 | 1.3 |
| Body | 16px / 1rem | 400 | 1.6 |
| Small | 14px / 0.875rem | 400 | 1.5 |

**Mobile Typography:**
- H1: 32px / 2rem
- H2: 28px / 1.75rem
- H3: 20px / 1.25rem

### Glass Morphism Card Style

```css
/* Glass card base */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
```

---

## Animation System

### Hover Effects
- **Buttons:** Scale 1.02, shadow increase, 200ms ease
- **Cards:** Translate Y -4px, shadow increase, 300ms ease
- **Links:** Color transition to primary, 150ms ease

### Scroll-Based Transitions
- **Fade in up:** Elements fade in and translate Y from 20px, triggered at 10% viewport
- **Stagger:** Child elements animate with 100ms delay between each

### Micro-Interactions
- **Button click:** Scale 0.98 on active
- **Form inputs:** Border color transition on focus
- **Menu toggle:** Smooth rotate on hamburger icon
- **Back to top:** Fade in at 400px scroll depth

### Animation Utilities (Tailwind classes)
```
animate-fade-in-up
animate-stagger-children
transition-all duration-200 ease-out
hover:scale-[1.02]
hover:-translate-y-1
```

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Laptops/Desktops |

**Mobile-First Approach:**
- Base styles target mobile
- Use `sm:`, `md:`, `lg:` prefixes to enhance for larger screens
- Touch targets minimum 44px
- Adequate spacing for thumb navigation

---

## Component Architecture

### File Structure
```
/components
  /header.tsx              (~150 lines) - Navigation + mobile menu
  /hero.tsx                (~120 lines) - Hero section
  /trust-bar.tsx           (~60 lines)  - Trust indicators
  /why-choose-us.tsx       (~100 lines) - Value propositions
  /treatments.tsx          (~150 lines) - Service cards
  /nervous-patients.tsx    (~100 lines) - Reassurance section
  /pricing-section.tsx     (~180 lines) - Membership plans
  /social-proof.tsx        (~200 lines) - Testimonials + results
  /how-it-works.tsx        (~100 lines) - 3-step process
  /meet-dentist.tsx        (~120 lines) - Dr. Carter profile
  /faq-section.tsx         (~200 lines) - FAQ accordion + concerns
  /final-cta.tsx           (~80 lines)  - Final conversion block
  /footer.tsx              (~150 lines) - Footer content
  /booking-modal.tsx       (~300 lines) - Modal booking form
  /mobile-sticky-cta.tsx   (~50 lines)  - Mobile bottom CTA
  /back-to-top.tsx         (~50 lines)  - Scroll to top button
```

### Shared Components
```
/components/ui
  - Button (existing shadcn)
  - Card (existing shadcn)
  - Dialog (existing shadcn)
  - Accordion (existing shadcn)
  - Input (existing shadcn)
  - Select (existing shadcn)
```

---

## Page Layout Structure

### Full-Width Single Page Layout

```
┌─────────────────────────────────────────────┐
│ HEADER (sticky)                             │
│ Logo | Nav Links | Book Appointment CTA     │
├─────────────────────────────────────────────┤
│ HERO                                        │
│ Headline + Subhead + CTA + Image            │
├─────────────────────────────────────────────┤
│ TRUST BAR                                   │
│ 4 proof points with icons                   │
├─────────────────────────────────────────────┤
│ WHY CHOOSE US                               │
│ 6 value proposition cards (glass)           │
├─────────────────────────────────────────────┤
│ TREATMENTS                                  │
│ 6 service cards (glass)                     │
├─────────────────────────────────────────────┤
│ NERVOUS PATIENTS                            │
│ Empathetic messaging + reassurance points   │
├─────────────────────────────────────────────┤
│ PRICING / MEMBERSHIP                        │
│ 2-3 plan cards (glass)                      │
├─────────────────────────────────────────────┤
│ SOCIAL PROOF                                │
│ Testimonials + Results + Stories            │
├─────────────────────────────────────────────┤
│ HOW IT WORKS                                │
│ 3-step process visualization                │
├─────────────────────────────────────────────┤
│ MEET DR. CARTER                             │
│ Photo + Bio + Credentials                   │
├─────────────────────────────────────────────┤
│ FAQ + OBJECTION HANDLING                    │
│ Accordion FAQ + Concern cards               │
├─────────────────────────────────────────────┤
│ FINAL CTA                                   │
│ Closing headline + Book Appointment         │
├─────────────────────────────────────────────┤
│ FOOTER                                      │
│ Contact info + Links + Legal                │
└─────────────────────────────────────────────┘

[MOBILE STICKY CTA - fixed bottom on mobile]
[BACK TO TOP - appears on scroll]
[BOOKING MODAL - triggered by any CTA]
```

---

## Navigation Structure

### Desktop Header
- Logo: "Carter Dental Studio" (left)
- Nav links: Treatments | About | Reviews | FAQ (center/right)
- CTA: "Book Appointment" button (far right)

### Mobile Header
- Logo: "Carter Dental Studio" (left)
- Hamburger icon (right)
- Full-screen overlay menu on toggle
- Large touch-friendly nav links
- Prominent CTA button in mobile menu

### Mobile Navigation Behavior
1. Hamburger icon animates to X on open
2. Menu slides in from right or fades in
3. Body scroll locked when open
4. Backdrop click closes menu
5. Links smooth scroll to sections
6. Menu auto-closes after link click

---

## CTA Strategy

### Single CTA: "Book Appointment"

**Placement locations:**
1. Header (desktop + mobile menu)
2. Hero section (primary)
3. After Why Choose Us section
4. After Treatments section
5. Final CTA section
6. Mobile sticky bottom bar

**CTA Behavior:**
- All "Book Appointment" buttons open the same booking modal
- No alternative CTAs (no "Contact Us", "Learn More", "Call Now")
- No email capture forms
- No newsletter signup

### Booking Modal
- Triggered by any CTA click
- Multi-step form visualization
- Fields: Treatment, Date, Time, Name, Email, Phone
- Success confirmation state
- Modal closes on backdrop click or X button

---

## SEO & Metadata Structure

### Page Metadata
```typescript
export const metadata: Metadata = {
  title: 'Carter Dental Studio | Private Dental Care in Manchester',
  description: 'Modern private dental care that feels calm, clear, and easy to book. Serving Manchester with gentle dentistry, cosmetic treatments, and same-week emergency appointments.',
  keywords: ['dentist manchester', 'private dentist', 'cosmetic dentistry', 'nervous patients dentist', 'emergency dentist'],
  authors: [{ name: 'Dr. Amelia Carter' }],
  openGraph: {
    title: 'Carter Dental Studio | Private Dental Care in Manchester',
    description: 'Modern private dental care that feels calm, clear, and easy to book.',
    type: 'website',
    locale: 'en_GB',
  },
}
```

### Semantic HTML Structure
- `<header>` for navigation
- `<main>` wrapping all content sections
- `<section>` for each major content block with `id` for anchor links
- `<article>` for testimonials/stories
- `<footer>` for footer content
- Proper heading hierarchy (h1 > h2 > h3)
- Alt text on all images
- ARIA labels on interactive elements

---

## Placeholder Images

### Image Specifications
| Image | Dimensions | Purpose |
|-------|------------|---------|
| Hero clinic | 800x600 | Modern clinic interior |
| Dr. Carter | 400x500 | Professional portrait |
| Treatment icons | 64x64 | Service category icons |
| Testimonial avatars | 48x48 | Patient photo placeholders |
| Before/after | 300x200 | Result comparison cards |

### Placeholder Strategy
- Use `/placeholder.svg?height={h}&width={w}` format
- Add descriptive alt text for accessibility
- Prepare for easy asset replacement later

---

## Smooth Scrolling & Navigation

### Scroll Behavior
- `scroll-behavior: smooth` on `<html>`
- Offset for sticky header (80px)
- Anchor links scroll to section IDs

### Back to Top Button
- Appears after 400px scroll
- Fixed position bottom-right
- Smooth scroll to top on click
- Fade in/out animation
- Semi-transparent with hover state

---

## Implementation Phases

### Phase 1: Foundation
1. Update `globals.css` with design tokens and glass morphism utilities
2. Update `layout.tsx` with Inter font and metadata
3. Create animation utility classes

### Phase 2: Core Components
4. Header component with mobile menu
5. Hero section
6. Trust bar
7. Booking modal (shared across all CTAs)

### Phase 3: Content Sections
8. Why Choose Us
9. Treatments
10. Nervous Patients
11. Pricing/Membership
12. Social Proof (testimonials + results + stories)

### Phase 4: Conversion & Trust
13. How It Works
14. Meet Dr. Carter
15. FAQ with objection handling
16. Final CTA

### Phase 5: Navigation & Polish
17. Footer
18. Mobile sticky CTA
19. Back to top button
20. Final responsive testing

---

## Quality Checklist

### Mobile Experience
- [ ] All touch targets >= 44px
- [ ] Readable text without zooming
- [ ] Hamburger menu fully functional
- [ ] Sticky mobile CTA visible and tappable
- [ ] Forms usable on mobile keyboards
- [ ] No horizontal scroll

### Accessibility
- [ ] Color contrast meets WCAG AA
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Alt text on images

### Performance
- [ ] No heavy animations
- [ ] Optimized images
- [ ] Minimal JavaScript
- [ ] Fast initial render

### Conversion
- [ ] Single CTA message throughout
- [ ] CTA visible on every viewport
- [ ] Booking modal works correctly
- [ ] No competing actions
- [ ] Trust elements prominent

---

## Brand Voice Reminders

**Do:**
- Calm, clear, reassuring language
- Human and approachable tone
- Professional without being cold
- Educational without jargon
- Premium but not flashy

**Don't:**
- Salesy or hypey marketing speak
- Generic SaaS-style copy
- Overly clinical terminology
- Childish or casual tone
- Aggressive conversion tactics

---

## Technical Notes

- **Framework:** Next.js App Router
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui base components
- **No backend:** All interactions are front-end mockups
- **No data persistence:** Form submissions are visual only
- **Max file length:** 400-600 lines per component file
