'use client'

import { ReactCompareSlider } from 'react-compare-slider'
import { ArrowLeftRight, Quote, Star } from 'lucide-react'
import { MagneticCTAButton } from '@/components/ui/magnetic-cta-button'
import type { LeadSchedulingIntent } from '@/lib/leads/lead-questions'

type Props = {
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

// Inline SVG mockups used as `itemOne` / `itemTwo` in the compare slider.
// Inlining avoids external file-load failures and guarantees the slider
// always has visible content, even if static assets are misconfigured.
function BeforeMockup() {
  return (
    <div
      className="h-full w-full select-none"
      role="img"
      aria-label="Old, dated dental practice website with cluttered navigation and outdated typography."
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id="before-bg" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F1ECE2" />
            <stop offset="100%" stopColor="#E0D5BD" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#before-bg)" />

        {/* Browser chrome */}
        <rect width="1200" height="56" fill="#CDC4B0" />
        <circle cx="28" cy="28" r="8" fill="#D86F6F" />
        <circle cx="56" cy="28" r="8" fill="#E2B95C" />
        <circle cx="84" cy="28" r="8" fill="#7FB28A" />
        <rect x="160" y="14" width="640" height="28" rx="6" fill="#F5EFE3" />
        <text x="180" y="34" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fill="#7B6C50">
          http://dr-smith-dental.example.co.uk/home.html
        </text>

        {/* Hero (cramped, outdated) */}
        <rect x="40" y="96" width="1120" height="200" fill="#F7EFDF" stroke="#C7B894" strokeWidth="2" />
        <text x="80" y="160" fontFamily="'Times New Roman', Times, serif" fontSize="48" fill="#5C3F1F" fontWeight="bold">
          Dr Smith Dental Surgery
        </text>
        <text x="80" y="200" fontFamily="'Comic Sans MS', cursive" fontSize="22" fill="#9B6F2B">
          Family dentistry for over 25 years!
        </text>
        <text x="80" y="240" fontFamily="Verdana, sans-serif" fontSize="18" fill="#4A3A1E">
          Call us today: 0161 555 0199 - Mon-Fri 9-5
        </text>
        <rect x="80" y="256" width="180" height="34" fill="#C24B4B" />
        <text
          x="170"
          y="280"
          textAnchor="middle"
          fontFamily="Verdana, sans-serif"
          fontWeight="bold"
          fontSize="14"
          fill="#FFFFFF"
        >
          Click Here For Info
        </text>

        {/* Navigation bar - cluttered */}
        <rect x="40" y="312" width="1120" height="40" fill="#A98C5A" />
        <g fontFamily="Verdana, sans-serif" fontSize="13" fill="#FFFFFF" fontWeight="bold">
          <text x="60" y="338">HOME</text>
          <text x="130" y="338">ABOUT US</text>
          <text x="220" y="338">TREATMENTS</text>
          <text x="330" y="338">FEES</text>
          <text x="390" y="338">NEW PATIENTS</text>
          <text x="520" y="338">FAQ</text>
          <text x="580" y="338">CONTACT</text>
          <text x="670" y="338">EMERGENCY</text>
          <text x="780" y="338">GALLERY</text>
          <text x="860" y="338">TESTIMONIALS</text>
          <text x="980" y="338">BLOG</text>
          <text x="1040" y="338">LINKS</text>
        </g>

        {/* Body: dense paragraph + sidebar */}
        <text x="60" y="400" fontFamily="'Times New Roman', Times, serif" fontSize="22" fill="#5C3F1F" fontWeight="bold">
          Welcome to Our Practice
        </text>
        <g fontFamily="Verdana, sans-serif" fontSize="13" fill="#3D2F18">
          <text x="60" y="436">We have been providing dental care since 1998 to families across the Greater</text>
          <text x="60" y="454">Manchester area. Our friendly team is committed to providing high quality</text>
          <text x="60" y="472">dentistry in a relaxed environment. Please click on a link to the left to find</text>
          <text x="60" y="490">out more about our treatments, fees and team. New patients always welcome!</text>
        </g>

        <rect x="800" y="380" width="340" height="320" fill="#FFFFFF" stroke="#C7B894" />
        <text x="820" y="410" fontFamily="Verdana, sans-serif" fontSize="14" fontWeight="bold" fill="#5C3F1F">
          NEWS &amp; OFFERS
        </text>
        <g fontFamily="Verdana, sans-serif" fontSize="11" fill="#3D2F18">
          <text x="820" y="438">- Free check-up for new patients (T&amp;Cs apply)</text>
          <text x="820" y="458">- £49 hygienist (limited time)</text>
          <text x="820" y="478">- We accept Denplan!</text>
          <text x="820" y="498">- See our gallery &gt;</text>
        </g>
        <rect x="820" y="530" width="300" height="120" fill="#F4E2C4" />
        <text x="970" y="600" textAnchor="middle" fontFamily="Verdana, sans-serif" fontSize="14" fill="#7B5A28">
          [stock dentist photo]
        </text>

        {/* Footer */}
        <rect x="40" y="720" width="1120" height="60" fill="#A98C5A" />
        <text x="60" y="754" fontFamily="Verdana, sans-serif" fontSize="12" fill="#FFFFFF">
          © 2008 Dr Smith Dental | Site by Webmaster Joe
        </text>

        {/* Watermark */}
        <text
          x="1140"
          y="784"
          textAnchor="end"
          fontFamily="Verdana, sans-serif"
          fontSize="11"
          fill="#5C3F1F"
          opacity="0.6"
        >
          BEFORE
        </text>
      </svg>
    </div>
  )
}

function AfterMockup() {
  return (
    <div
      className="h-full w-full select-none"
      role="img"
      aria-label="Modern dental practice website with glass navigation, a clear hero CTA and three benefit cards."
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id="after-bg" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBFAF6" />
            <stop offset="100%" stopColor="#F0F4F3" />
          </linearGradient>
          <linearGradient id="after-cta" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5A9A9A" />
            <stop offset="100%" stopColor="#3F7A7A" />
          </linearGradient>
          <linearGradient id="after-mark" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6FB1B1" />
            <stop offset="100%" stopColor="#2F6868" />
          </linearGradient>
          <linearGradient id="after-hero-card" x1="0" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E9F1EF" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#after-bg)" />

        {/* Browser chrome */}
        <rect width="1200" height="56" fill="#ECEFEC" />
        <circle cx="28" cy="28" r="8" fill="#E07B7B" />
        <circle cx="56" cy="28" r="8" fill="#E7C36F" />
        <circle cx="84" cy="28" r="8" fill="#85C49A" />
        <rect x="160" y="14" width="640" height="28" rx="14" fill="#FFFFFF" />
        <text x="184" y="33" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#4A5759">
          https://carterdental.co.uk
        </text>

        {/* Floating glass nav */}
        <rect x="120" y="88" width="960" height="64" rx="22" fill="#FFFFFF" opacity="0.85" />
        <rect x="120" y="88" width="960" height="64" rx="22" fill="none" stroke="#E0E8E6" />
        <rect x="148" y="104" width="32" height="32" rx="8" fill="url(#after-mark)" />
        <text
          x="164"
          y="126"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontWeight="700"
          fontSize="14"
          fill="#FFFFFF"
        >
          CD
        </text>
        <text
          x="192"
          y="126"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontWeight="600"
          fontSize="16"
          fill="#1F2A2F"
        >
          Carter Dental
        </text>
        <text
          x="848"
          y="126"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="13"
          fill="#4A5759"
          fontWeight="500"
        >
          More v
        </text>
        <rect x="936" y="104" width="120" height="32" rx="14" fill="url(#after-cta)" />
        <text
          x="996"
          y="124"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontWeight="600"
          fontSize="13"
          fill="#FFFFFF"
        >
          Book Audit
        </text>

        {/* Hero */}
        <text
          x="600"
          y="262"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontWeight="700"
          fontSize="56"
          fill="#1F2A2F"
        >
          Your dental site is
        </text>
        <text
          x="600"
          y="316"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontWeight="700"
          fontSize="56"
          fill="#1F2A2F"
        >
          costing you patients.
        </text>
        <text
          x="600"
          y="358"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="18"
          fill="#5C6B6E"
        >
          A 10-minute audit shows you exactly why &mdash; and how to fix it.
        </text>

        <rect x="476" y="392" width="248" height="56" rx="22" fill="url(#after-cta)" />
        <text
          x="600"
          y="427"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontWeight="600"
          fontSize="16"
          fill="#FFFFFF"
        >
          Get my free audit
        </text>

        <text
          x="600"
          y="492"
          textAnchor="middle"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="11"
          fontWeight="600"
          letterSpacing="3"
          fill="#7C8A8D"
        >
          TRUSTED BY 40+ UK PRIVATE PRACTICES
        </text>

        {/* Cards row */}
        <g>
          <rect x="120" y="552" width="304" height="180" rx="22" fill="url(#after-hero-card)" stroke="#E0E8E6" />
          <rect x="144" y="576" width="40" height="40" rx="12" fill="#D5EBE7" />
          <text
            x="164"
            y="602"
            textAnchor="middle"
            fontFamily="'Manrope', system-ui, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#3F7A7A"
          >
            01
          </text>
          <text x="144" y="640" fontFamily="'Manrope', system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#1F2A2F">
            Faster mobile
          </text>
          <text x="144" y="666" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#5C6B6E">
            Quick loads on your
          </text>
          <text x="144" y="686" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#5C6B6E">
            clinic site.
          </text>

          <rect x="448" y="552" width="304" height="180" rx="22" fill="url(#after-hero-card)" stroke="#E0E8E6" />
          <rect x="472" y="576" width="40" height="40" rx="12" fill="#D5EBE7" />
          <text
            x="492"
            y="602"
            textAnchor="middle"
            fontFamily="'Manrope', system-ui, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#3F7A7A"
          >
            02
          </text>
          <text x="472" y="640" fontFamily="'Manrope', system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#1F2A2F">
            Clear booking
          </text>
          <text x="472" y="666" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#5C6B6E">
            One obvious path to
          </text>
          <text x="472" y="686" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#5C6B6E">
            book on your site.
          </text>

          <rect x="776" y="552" width="304" height="180" rx="22" fill="url(#after-hero-card)" stroke="#E0E8E6" />
          <rect x="800" y="576" width="40" height="40" rx="12" fill="#D5EBE7" />
          <text
            x="820"
            y="602"
            textAnchor="middle"
            fontFamily="'Manrope', system-ui, sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#3F7A7A"
          >
            03
          </text>
          <text x="800" y="640" fontFamily="'Manrope', system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#1F2A2F">
            Trust signals
          </text>
          <text x="800" y="666" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#5C6B6E">
            Reviews and team where
          </text>
          <text x="800" y="686" fontFamily="'Manrope', system-ui, sans-serif" fontSize="13" fill="#5C6B6E">
            patients expect them.
          </text>
        </g>

        <text
          x="1140"
          y="784"
          textAnchor="end"
          fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="#3F7A7A"
        >
          AFTER
        </text>
      </svg>
    </div>
  )
}

const REVIEWS = [
  {
    quote:
      'Bookings jumped 38% in the first month after Carter Dental rebuilt our homepage. The audit pointed at exactly the friction we’d been missing.',
    name: 'Dr Priya Anand',
    practice: 'Anand Family Dental, Leeds',
  },
  {
    quote:
      'I was sceptical about a “website audit”, but the report was specific and the redesign paid for itself by week two.',
    name: 'Dr Marcus Webb',
    practice: 'Northgate Dental Studio, Edinburgh',
  },
] as const

export function ProofSlider({ onOpenSchedulingModal }: Props) {
  return (
    <section
      id="proof"
      aria-labelledby="proof-slider-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Before / After
          </span>
          <h2
            id="proof-slider-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            See what your clinic&apos;s site could look like.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground">
            Drag the slider to compare a practice like yours — old site vs the rebuild we deliver for private
            clinics.
          </p>
        </div>

        <div className="relative mt-10 aspect-[3/2] w-full overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl backdrop-blur-md">
          <ReactCompareSlider
            className="h-full w-full select-none"
            style={{ height: '100%', width: '100%', touchAction: 'none' }}
            itemOne={<BeforeMockup />}
            itemTwo={<AfterMockup />}
            defaultPosition={50}
            boundsPadding="16px"
            onlyHandleDraggable={false}
            handle={
              <div
                role="slider"
                aria-label="Drag to compare before and after"
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                className="flex h-full w-11 cursor-ew-resize items-center justify-center touch-none"
              >
                {/* Centre divider line */}
                <span aria-hidden="true" className="absolute inset-y-0 w-px bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] backdrop-blur" />
                {/* Tap target pill */}
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-lg">
                  <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>
            }
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground md:hidden" aria-hidden="true">
          Drag the handle ←→ to compare
        </p>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {REVIEWS.map((review) => (
            <li
              key={review.name}
              className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center gap-1 text-primary" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <Quote className="mt-3 h-5 w-5 text-primary/60" aria-hidden="true" />
              <p className="mt-2 text-pretty text-base leading-relaxed text-foreground">{review.quote}</p>
              <p className="mt-4 text-sm font-semibold text-foreground">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.practice}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <MagneticCTAButton
            type="button"
            onClick={() => onOpenSchedulingModal('website_audit')}
            variant="cta"
            className="h-12 px-8 text-sm font-semibold"
          >
            Request your free audit
          </MagneticCTAButton>
        </div>
      </div>
    </section>
  )
}
