"use client"

import { useState, useCallback, useMemo } from "react"
import { ChevronRight, ChevronLeft, Info } from "lucide-react"

const cases = [
  {
    id: 1,
    title: "Full smile makeover",
    description:
      "Whiter, more aligned teeth using a combination of porcelain veneers and professional whitening — framed for even light and natural proportions.",
    notes: "Completed over 3 visits.",
    before: "/images/before-smile.jpg",
    after: "/images/after-smile.jpg",
    beforeFallback:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000",
    afterFallback:
      "https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: 2,
    title: "Invisalign transformation",
    description:
      "Corrected crowding and bite alignment without fixed braces — consistent photography for a fair before/after comparison.",
    notes: "Treatment time: 9 months.",
    before: "/images/before-invisalign.jpg",
    after: "/images/after-invisalign.jpg",
    beforeFallback:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000",
    afterFallback:
      "https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=2000",
  },
] as const

export function TreatmentGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [useFallback, setUseFallback] = useState(false)

  const c = cases[activeTab]
  const beforeSrc = useMemo(
    () => (useFallback ? c.beforeFallback : c.before),
    [c, useFallback]
  )
  const afterSrc = useMemo(() => (useFallback ? c.afterFallback : c.after), [c, useFallback])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(0, p - 5))
    if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(100, p + 5))
  }, [])

  return (
    <section className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-editorial text-4xl md:text-5xl font-bold mb-4">Before &amp; after — same light, real outcomes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Drag the handle to compare. High-impact cosmetic treatments (whitening, veneers, alignment) with brief clinical
            notes — swap in your own case photography when you&apos;re ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
          <div
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 interactive-card-lift"
            role="region"
            aria-label="Before and after comparison slider"
            onKeyDown={onKeyDown}
            tabIndex={0}
          >
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterSrc}
                alt="After treatment"
                className="w-full h-full object-cover"
                onError={() => setUseFallback(true)}
              />
            </div>

            <div
              className="absolute inset-0 z-10 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforeSrc}
                alt="Before treatment"
                className="w-full h-full object-cover grayscale"
                onError={() => setUseFallback(true)}
              />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              aria-label="Compare before and after"
              className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
            />

            <div
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center">
                <div className="flex gap-0.5" aria-hidden>
                  <ChevronLeft className="w-3 h-3 text-primary" />
                  <ChevronRight className="w-3 h-3 text-primary" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full">
              Before
            </div>
            <div className="absolute bottom-6 right-6 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full">
              After
            </div>
          </div>

          <div className="space-y-8">
            {cases.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(idx)
                  setUseFallback(false)
                }}
                className={`w-full text-left p-6 rounded-2xl transition-all border ${
                  activeTab === idx
                    ? "bg-white border-primary shadow-xl scale-[1.02]"
                    : "bg-transparent border-border hover:border-primary/50 interactive-card-lift"
                }`}
              >
                <h3 className={`font-bold text-xl mb-2 ${activeTab === idx ? "text-primary" : "text-foreground"}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <Info className="w-4 h-4" aria-hidden />
                  Clinical note: {item.notes}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
