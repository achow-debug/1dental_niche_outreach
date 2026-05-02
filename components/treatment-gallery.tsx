"use client"

import { useState, useCallback } from "react"
import { ChevronRight, ChevronLeft, Info } from "lucide-react"

/** Remote assets — local `/images/before-*.jpg` are not shipped; these load reliably for the demo slider. */
const cases = [
  {
    id: 1,
    title: "Full smile makeover",
    description:
      "Whiter, more aligned teeth using a combination of porcelain veneers and professional whitening — framed for even light and natural proportions.",
    notes: "Completed over 3 visits.",
    before:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1600",
    after:
      "https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 2,
    title: "Invisalign transformation",
    description:
      "Corrected crowding and bite alignment without fixed braces — consistent photography for a fair before/after comparison.",
    notes: "Treatment time: 9 months.",
    before:
      "https://images.unsplash.com/photo-1620775397926-f50f6e21ed2f?auto=format&fit=crop&q=80&w=1600",
    after:
      "https://images.unsplash.com/photo-1579684947550-22e945225d99?auto=format&fit=crop&q=80&w=1600",
  },
] as const

export function TreatmentGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  const c = cases[activeTab]

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(0, p - 5))
    if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(100, p + 5))
  }, [])

  return (
    <section
      id="results"
      className="section-padding bg-secondary/30 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-editorial text-3xl md:text-5xl font-bold mb-2 md:mb-3 leading-tight md:leading-[1.15]">
            Before &amp; after — same light, real outcomes
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Drag the handle to compare. High-impact cosmetic treatments (whitening, veneers, alignment) with brief clinical
            notes — swap in your own case photography when you&apos;re ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-10 items-start lg:items-center">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-xl md:rounded-3xl aspect-[4/3] sm:aspect-video min-h-[13rem]"
            role="region"
            aria-label="Before and after comparison slider"
            onKeyDown={onKeyDown}
            tabIndex={0}
          >
            {/* After (full frame) */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.after}
                alt="After treatment"
                className="absolute inset-0 block h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Before (clipped from the left) */}
            <div
              className="absolute inset-0 z-[1] overflow-hidden will-change-[clip-path]"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.before}
                alt="Before treatment"
                className="absolute inset-0 block h-full w-full object-cover grayscale brightness-[0.92]"
                sizes="(max-width: 1024px) 100vw, 65vw"
                loading="lazy"
                decoding="async"
              />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              aria-label="Compare before and after"
              className="absolute inset-0 z-[35] h-full w-full cursor-ew-resize opacity-0"
            />

            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white shadow-lg -translate-x-1/2"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl">
                <div className="flex gap-0.5" aria-hidden>
                  <ChevronLeft className="h-3 w-3 text-primary" />
                  <ChevronRight className="h-3 w-3 text-primary" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute left-3 top-3 z-30 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
              Before
            </div>
            <div className="pointer-events-none absolute right-3 top-3 z-30 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
              After
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:space-y-4">
            {cases.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(idx)
                  setSliderPosition(50)
                }}
                className={`w-full rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                  activeTab === idx
                    ? "scale-[1.01] border-primary bg-white shadow-lg lg:scale-[1.02]"
                    : "border-border bg-background/40 hover:border-primary/50 interactive-card-lift"
                }`}
              >
                <h3 className={`mb-1.5 text-lg font-bold sm:text-xl ${activeTab === idx ? "text-primary" : "text-foreground"}`}>
                  {item.title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
                  <Info className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Clinical note: {item.notes}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
