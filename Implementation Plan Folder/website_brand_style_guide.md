# Website Brand Style Guide

Use this guide as the source of truth when writing HTML emails so they stay aligned with the current Carter Dental web brand.

## Brand Reference (From Current UI)

- **Brand name lockup:** `Carter Dental` + sublabel `Studio • Manchester`
- **Tone:** calm, premium, reassuring, patient-first, clear and easy-to-book
- **Core CTA language:** `Book website audit`, `Request demo`, `Book a visit`

## Typography

- **Primary font:** `Manrope` (with `system-ui, sans-serif` fallback)
- **Email fallback stack:** `font-family: Manrope, Arial, Helvetica, sans-serif;`
- **Style direction:**
  - Headlines: bold, tight tracking, high contrast
  - Body: clean, readable, relaxed line-height (`1.5–1.7`)
  - Label text: uppercase + wider letter spacing for micro-tags/badges

## Color System (Use These Roles)

- **Primary brand color (teal/sage):** use for main CTA, icons, highlights
  - Site theme color reference: `#5a9a9a`
- **Background:** warm off-white (not stark gray)
- **Card/section blocks:** white
- **Main text:** deep charcoal
- **Secondary text:** muted gray-charcoal
- **Borders/dividers:** very soft warm gray
- **Accent tints:** very light teal backgrounds behind icons/badges

## Component Styling to Mirror

- **Buttons**
  - Primary CTA: rounded pill/full, teal background, white text, bold
  - Secondary CTA: outlined, neutral background, subtle border
  - Tertiary action: text/ghost style for low emphasis
- **Corners/radius:** modern, rounded (`12–24px` feel; pill for CTAs)
- **Spacing rhythm:** generous vertical breathing room, clean section blocks
- **Visual motif:** soft healthcare premium (gentle contrast, no harsh shadows)

## Email-Safe Adaptation Rules

- Prefer flat color over glass/blur/animated effects from web UI (email clients render these inconsistently).
- Use a single-column 600px container with padded white cards on a warm background.
- Keep one dominant CTA color (brand teal), one secondary outline style.
- Use inline CSS and table-based structure for maximum email-client compatibility.
