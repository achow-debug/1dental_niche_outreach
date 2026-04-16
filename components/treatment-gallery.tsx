"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Info } from "lucide-react"

const cases = [
  {
    id: 1,
    title: "Full Smile Makeover",
    description: "Whiter, more aligned teeth using a combination of porcelain veneers and professional whitening.",
    notes: "Completed over 3 visits.",
    before: "/images/before-smile.jpg",
    after: "/images/after-smile.jpg",
  },
  {
    id: 2,
    title: "Invisalign Transformation",
    description: "Corrected overcrowding and bite alignment issues without traditional braces.",
    notes: "Treatment time: 9 months.",
    before: "/images/before-invisalign.jpg",
    after: "/images/after-invisalign.jpg",
  }
]

export function TreatmentGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-editorial text-4xl md:text-5xl font-bold mb-4">The transformative power of dental care.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See real results from patients who moved from dental anxiety to dental confidence.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
          {/* Comparison Slider */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            {/* After Image (Below) */}
            <div className="absolute inset-0">
               <img 
                src={cases[activeTab].after} 
                alt="After treatment outcome"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=2000"
                }}
              />
            </div>
            
            {/* Before Image (Above, clipped) */}
            <div 
              className="absolute inset-0 z-10 overflow-hidden" 
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img 
                src={cases[activeTab].before} 
                alt="Before treatment state"
                className="w-full h-full object-cover grayscale"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000"
                }}
              />
            </div>

            {/* Slider Handle */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
            />
            
            <div 
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center">
                <div className="flex gap-0.5">
                  <ChevronLeft className="w-3 h-3 text-primary" />
                  <ChevronRight className="w-3 h-3 text-primary" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full">Before</div>
            <div className="absolute bottom-6 right-6 z-20 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full">After</div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            {cases.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-6 rounded-2xl transition-all border ${
                  activeTab === idx 
                    ? "bg-white border-primary shadow-xl scale-[1.02]" 
                    : "bg-transparent border-border hover:border-primary/50"
                }`}
              >
                <h3 className={`font-bold text-xl mb-2 ${activeTab === idx ? "text-primary" : "text-foreground"}`}>
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {c.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <Info className="w-4 h-4" />
                  Clinical Note: {c.notes}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
