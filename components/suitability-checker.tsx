"use client"

import { useState } from "react"
import { Check, X, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const treatments = [
  {
    id: "invisalign",
    name: "Invisalign",
    criteria: [
      "Mild to moderate crowding",
      "Gaps between teeth",
      "Commitment to wearing aligners 22h/day",
      "Good overall gum health"
    ],
    notIdeal: [
      "Severe bite corrections",
      "Complex vertical tooth movements",
      "Active periodontal disease"
    ]
  },
  {
    id: "bonding",
    name: "Composite Bonding",
    criteria: [
      "Minor chips or cracks",
      "Small gaps between teeth",
      "Discolored edges",
      "Healthy tooth structure"
    ],
    notIdeal: [
      "Large-scale structural damage",
      "Heavy tooth grinding (bruxism)",
      "Smokers (prone to staining)"
    ]
  },
  {
    id: "whitening",
    name: "Professional Whitening",
    criteria: [
      "Extrinsic staining (coffee, tea, etc.)",
      "Healthy enamel",
      "Natural teeth (no crowns on front teeth)",
    ],
    notIdeal: [
      "Intrinsic staining (internal tooth damage)",
      "Highly sensitive teeth",
      "Front-facing restorations"
    ]
  }
]

export function SuitabilityChecker() {
  const [selectedTreatment, setSelectedTreatment] = useState(treatments[0])

  return (
    <section className="section-padding bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-6 inline-block">
            Treatment Discovery
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Are you a good fit?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive guidance to help you understand which treatment might best suit your smile goals and dental health.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
          {/* Treatment Selection */}
          <div className="flex flex-col gap-3">
            {treatments.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTreatment(t)}
                className={`p-5 rounded-2xl text-left transition-all border ${
                  selectedTreatment.id === t.id
                    ? "bg-white border-primary shadow-lg scale-105"
                    : "bg-transparent border-border hover:border-primary/30"
                }`}
              >
                <p className={`font-bold ${selectedTreatment.id === t.id ? "text-primary" : "text-foreground"}`}>
                  {t.name}
                </p>
              </button>
            ))}
          </div>

          {/* Results Display */}
          <div className="glass-surface rounded-[2.5rem] p-8 md:p-12 border-none">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-primary">{selectedTreatment.name}</span> Suitability
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-green-600 mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Ideal For
                </h4>
                <ul className="space-y-4">
                  {selectedTreatment.criteria.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-6 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Considerations
                </h4>
                <ul className="space-y-4">
                  {selectedTreatment.notIdeal.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-amber-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground max-w-sm">
                  This tool provides general guidance. A clinical consultation is required for a definitive diagnosis and treatment plan.
                </p>
              </div>
              <Button className="h-14 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-lg group">
                Discuss {selectedTreatment.name} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
