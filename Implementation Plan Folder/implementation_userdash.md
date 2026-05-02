# User/Client Dashboard Implementation Plan

## Objective
Build a premium, mobile-first dashboard experience for `user` and `client` roles that feels visually consistent with the admin UI while prioritizing booking management, smart notifications, and guided onboarding.

## Product Goals
- Deliver a branded, polished first impression (premium hero + consistent visual identity).
- Make booking management the primary workflow (upcoming bookings, pipeline, rebooking, scheduling actions).
- Provide smart, non-intrusive notifications with clear next actions.
- Guide new users to activation with onboarding, reminders, and trust-building UX.
- Improve self-service with profile completion and quick links.

## Scope (v1)

### 1) Visual and Branding Experience
- Premium hero section with dynamic contextual greeting:
  - Example: `Hey {firstName}, you have a booking today at {time}.`
  - Fallback variants when no booking exists.
- Subtle glassmorphism/gradient backdrop consistent with admin styling language.
- Reuse admin visual system (tokens/components) for cohesive identity:
  - Color palette, card treatments, badges, CTA style, spacing rhythm.
- Add tasteful micro-animations:
  - Card hover lift, feed item fade-in, badge pulse for unread notifications.
  - Keep animation durations short and non-distracting.

### 2) Booking Management (Core)
- Upcoming booking card (next appointment spotlight with status and CTA).
- Booking pipeline summary:
  - Pending / Confirmed / Completed / Cancelled counts.
- Booking list module with toggle:
  - Upcoming tab
  - History tab
- One-click rebooking:
  - Pre-fill the most recent completed service/session for fast rebook flow.
- Interactive schedule entry point:
  - CTA adapts based on history:
    - No bookings: `Book your first visit`
    - Has bookings: `Book another session`
- Add direct treatment booking from dashboard:
  - Dashboard card with `Book Treatment` and optional `Rebook last treatment`.
  - Upcoming treatments preview strip with `View all treatments`.
- Introduce dedicated booking surfaces:
  - `/dashboard/book` (treatment selection hub)
  - `/dashboard/book/calendar` (calendar + slot picker)
  - `/dashboard/book/confirm` (final confirmation)
- Slot-disclosure strategy (avoid overwhelming users):
  - Do not show every slot at once.
  - Require treatment selection first, then show only nearest relevant dates/times.
  - Use progressive reveal patterns (`Show more times`, day-part grouping, limited initial slots).

### 3) Smart Notifications
- Notification bell in dashboard header area with unread counter, which when clicked, displays a pop-up preview stemming from the bell.
- Activity feed module (bookings, reminders, status updates).
- Non-intrusive push-style in-app alerts:
  - Small toast/alert cards for important events (confirmations, changes).
  - Avoid blocking modals unless action-critical.
- Notification actions:
  - Mark as read
  - Open related item (booking/details)

### 4) Onboarding and Retention
- Onboarding lane for new users:
  - Complete profile
  - Book first appointment
  - Enable reminders
- Reminder timeline:
  - Upcoming reminders and prep milestones.
- Trust and reassurance card:
  - “What happens next” and support reassurance copy.

### 5) Profile and Self-Service
- Profile/contact completeness panel with progress indicator.
- Direct actions for missing fields (phone, emergency contact, key details).
- Quick links panel:
  - Book appointment
  - View booking history
  - Profile settings
  - Contact support

## Information Architecture (Page Sections)
1. Hero + account badges
2. Next appointment card (or first-visit CTA)
3. Booking pipeline + booking list (upcoming/history toggle)
4. Notifications feed + bell indicator
5. Onboarding lane + reminder timeline
6. Profile completeness + quick actions/self-service links
7. Trust & reassurance card

## UX and Interaction Rules
- Mobile-first layout:
  - Single-column card flow on small screens.
  - Sticky primary booking CTA on mobile.
- Progressive disclosure:
  - Surface top actions first; advanced actions behind simple entry points.
- Action clarity:
  - Every card includes at least one explicit next step (button/link).
- Non-intrusive feedback:
  - Success/error states shown via inline alerts and toasts.
- Booking flow UX:
  - Step sequence: Treatment -> Time -> Confirm.
  - Keep selected treatment and slot visible in sticky/mobile summary.
  - Match admin calendar visual language, but simplify controls for user/client context.
- Slot presentation UX:
  - Group slots by morning/afternoon/evening.
  - Start with concise default slot set per day and expand on demand.
  - Highlight best/soonest slots instead of rendering full dense inventory.
- Micro-interactions (subtle, mobile-first):
  - Treatment card selection state animation.
  - Slot tap feedback and sticky CTA enable transition.
  - Gentle feed/card entrance transitions and unread badge pulse (reduced-motion aware).

## Technical Implementation Outline (No Coding Yet)

### A) Page Composition
- Refactor current `app/dashboard/page.tsx` placeholder into modular sections.
- Keep access/role logic as-is (user/client stay on dashboard; admin/staff redirect to admin).
- Build section-level components under dashboard-local component directory for maintainability.
- Add dedicated booking route group under dashboard for:
  - Treatment hub page
  - Calendar/slot selection page
  - Confirmation page

### B) Data Requirements
- Session/profile data for personalized greeting and completeness checks.
- Booking data for:
  - Next appointment
  - Pipeline summary
  - Upcoming/history listing
  - Rebooking context
- Treatment catalog data for:
  - Upcoming/available treatments on dashboard
  - Search/filter in booking hub
- Availability/slot data for:
  - Calendar date availability states
  - Time slots scoped to selected treatment/date
- Notification/activity data for bell count and feed rendering.
- Reminder data for timeline milestones.

### C) State and Loading Strategy
- Use skeleton/loading placeholders per section (not full-page blocking).
- Render hero and core next-step CTAs early; hydrate secondary modules progressively.
- Preserve resilient empty states for new users with zero bookings.
- For booking flow:
  - Persist selected treatment across booking steps.
  - Load calendar and slot data incrementally (date first, slots on date select).
  - Apply initial slot cap per day with explicit expand control.

### D) Design System Alignment
- Reuse existing shared UI primitives (`Card`, `Badge`, `Button`, `Alert`, etc.).
- Reuse admin-inspired class patterns (`glass-surface`, elevated cards, rounded CTAs) where appropriate.
- Keep motion subtle and accessible (respect reduced-motion preferences).

## API and Backend Considerations (Planning Level)
- Confirm existing booking endpoints can support user-facing list/filter needs.
- Define notification feed source and unread tracking model for user dashboard.
- Validate profile completeness fields available in `profiles` table.
- Confirm timeline/reminder data source (derived or dedicated reminders table/event stream).
- Confirm treatment catalog endpoint shape for user/client booking pages.
- Confirm availability endpoint supports filtered, paginated, or capped slot responses for progressive reveal.
- Ensure booking creation endpoint accepts selected treatment + slot references from user dashboard flow.

## Milestones

### Milestone 1: Foundation and Visual Shell
- Dashboard hero redesign (premium greeting + branded visuals).
- Section scaffolding with responsive mobile-first layout.
- Account badges and static placeholders for each major module.

### Milestone 2: Booking Core
- Next appointment card + pipeline metrics.
- Upcoming/history list and one-click rebooking action.
- History-aware primary booking CTA behavior.
- Dashboard `Book Treatment` entry card + upcoming treatments preview.
- Dedicated booking hub (`/dashboard/book`) for treatment selection.
- Calendar/slot step (`/dashboard/book/calendar`) with progressive slot reveal.
- Confirmation step (`/dashboard/book/confirm`) before final booking submit.

### Milestone 3: Notifications and Activity
- Bell indicator with unread count.
- Notifications feed and related-item navigation.
- In-app non-intrusive alert behavior for key booking events.

### Milestone 4: Onboarding, Reminders, and Completeness
- Onboarding lane for new users.
- Reminder timeline module.
- Profile completeness + quick links + trust card.

### Milestone 5: Polish and QA
- Motion tuning and accessibility checks.
- Responsive QA across common device widths.
- Empty/error/loading state audit for every module.
- Micro-interaction QA (tap states, transitions, sticky CTA behavior, reduced-motion support).

## Acceptance Criteria (v1)
- Dashboard feels visually aligned with admin branding and premium quality.
- User sees contextual greeting based on real account/booking state.
- Booking management is central and actionable within one screen depth.
- Notifications are visible, actionable, and non-disruptive.
- New users receive guided onboarding and clear next steps.
- Profile completion and quick links reduce navigation friction.
- Mobile experience is first-class and not a desktop squeeze-down.

## Risks and Mitigations
- Risk: Data gaps for notifications/reminders.
  - Mitigation: Start with available feed data and add backend hooks incrementally.
- Risk: Over-animating harms usability.
  - Mitigation: Keep animation subtle, purposeful, and reduced-motion friendly.
- Risk: Feature density increases cognitive load.
  - Mitigation: Prioritize section hierarchy and progressive disclosure.

## Out of Scope (for this phase)
- Full real-time push infrastructure beyond practical in-app alerts.
- Large booking calendar rebuild if existing scheduling paths suffice.
- Deep billing/payment workflows (keep as quick-link placeholder unless already available).
