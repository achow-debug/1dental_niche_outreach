"use client"

import { useMemo, useState } from "react"
import { Check, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const treatments = [
  {
    id: "invisalign",
    name: "Invisalign",
    criteria: [
      { id: "crowding", label: "Mild to moderate crowding or spacing" },
      { id: "aligner", label: "Happy to wear aligners ~22 hours a day" },
      { id: "gums", label: "Generally healthy gums (or willing to stabilise first)" },
    ],
    notIdeal: [
      "Severe bite corrections needing complex movement",
      "Active, untreated gum disease",
      "Smoking heavily without commitment to oral hygiene",
    ],
  },
  {
    id: "bonding",
    name: "Composite bonding",
    criteria: [
      { id: "chips", label: "Small chips, worn edges, or narrow gaps" },
      { id: "structure", label: "Enough healthy tooth structure to bond to" },
      { id: "grinding", label: "Light grinding — or willing to protect with a guard" },
    ],
    notIdeal: [
      "Large breaks needing crowns or more extensive work",
      "Heavy grinding without protection",
      "Deep decay that needs treatment first",
    ],
  },
  {
    id: "whitening",
    name: "Professional whitening",
    criteria: [
      { id: "stain", label: "Mostly surface staining (coffee, tea, lifestyle)" },
      { id: "enamel", label: "Healthy enamel with normal sensitivity" },
      { id: "natural", label: "Whitening natural teeth (not existing crowns/veneers on front teeth)" },
    ],
    notIdeal: [
      "Deep internal greying that may need a different approach",
      "Severe sensitivity without assessment",
      "Crowns/veneers on front teeth expecting them to whiten",
    ],
  },
] as const

type FitLevel = "strong" | "possible" | "chat"

interface SuitabilityCheckerProps {
  onBookClick: () => void
}

export function SuitabilityChecker({ onBookClick }: SuitabilityCheckerProps) {
  const [selectedId, setSelectedId] = useState(treatments[0].id)
  const selectedTreatment = treatments.find((t) => t.id === selectedId) ?? treatments[0]

  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const [commitment, setCommitment] = useState([70])

  const activeToggles = selectedTreatment.criteria.map((c) => toggles[`${selectedTreatment.id}-${c.id}`] ?? false)
  const matchCount = activeToggles.filter(Boolean).length

  const fit: FitLevel = useMemo(() => {
    const c = commitment[0] ?? 50
    if (matchCount >= 2 && c >= 55) return "strong"
    if (matchCount >= 1 || c >= 40) return "possible"
    return "chat"
  }, [matchCount, commitment])

  const fitCopy: Record<FitLevel, { title: string; body: string }> = {
    strong: {
      title: "You could be a great fit",
      body: "Based on what you’ve toggled, this treatment may align well — a consultation will confirm what’s safest and most natural for your smile.",
    },
    possible: {
      title: "It’s worth a conversation",
      body: "A few details may need a closer look — that’s normal. We’ll be honest about what’s achievable and what we’d refine first.",
    },
    chat: {
      title: "Let’s take a closer look together",
      body: "No worries — suitability isn’t a pass/fail test. We’ll guide you with clear options, even if this exact treatment isn’t the right first step.",
    },
  }

  return (
    <section className="section-padding bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-6 inline-block">
            Helpful guidance
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Could this be right for you?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A quick, no-judgement check — toggle what feels true. We&apos;ll always confirm details in person.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
          <div className="flex flex-col gap-3">
            {treatments.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`p-5 rounded-2xl text-left transition-all border interactive-card-lift ${
                  selectedTreatment.id === t.id
                    ? "bg-white border-primary shadow-lg scale-[1.02]"
                    : "bg-transparent border-border hover:border-primary/30"
                }`}
              >
                <p className={`font-bold ${selectedTreatment.id === t.id ? "text-primary" : "text-foreground"}`}>
                  {t.name}
                </p>
              </button>
            ))}
          </div>

          <div className="glass-surface rounded-[2.5rem] p-8 md:p-12 border-none">
            <h3 className="text-2xl font-bold mb-2 flex flex-wrap items-center gap-3">
              <span className="text-primary">{selectedTreatment.name}</span>
              <span className="text-foreground">— your snapshot</span>
            </h3>

            <div
              className={`mb-8 rounded-2xl border px-5 py-4 ${
                fit === "strong"
                  ? "border-primary/30 bg-primary/5"
                  : fit === "possible"
                    ? "border-border bg-muted/40"
                    : "border-border bg-muted/30"
              }`}
            >
              <p className="font-semibold text-foreground">{fitCopy[fit].title}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{fitCopy[fit].body}</p>
            </div>

            <div className="space-y-6 mb-10">
              <p className="text-sm font-medium text-foreground">What sounds like you?</p>
              {selectedTreatment.criteria.map((c) => {
                const key = `${selectedTreatment.id}-${c.id}`
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-white/60 px-4 py-3"
                  >
                    <Label htmlFor={key} className="text-sm text-muted-foreground leading-snug cursor-pointer">
                      {c.label}
                    </Label>
                    <Switch
                      id={key}
                      checked={toggles[key] ?? false}
                      onCheckedChange={(v) => setToggles((prev) => ({ ...prev, [key]: v }))}
                    />
                  </div>
                )
              })}
            </div>

            <div className="mb-10 space-y-3">
              <div className="flex justify-between items-baseline gap-4">
                <Label className="text-sm font-medium text-foreground">How ready do you feel to commit to aftercare?</Label>
                <span className="text-xs font-semibold text-primary tabular-nums">{commitment[0]}%</span>
              </div>
              <Slider
                value={commitment}
                onValueChange={setCommitment}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher isn&apos;t &quot;better&quot; — it just helps us frame expectations for timelines and results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-green-700 mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Often a good match when…
                </h4>
                <ul className="space-y-3">
                  {selectedTreatment.criteria.map((item) => (
                    <li key={item.id} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-700" />
                      </div>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Worth discussing first…
                </h4>
                <ul className="space-y-3">
                  {selectedTreatment.notIdeal.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info className="w-3 h-3 text-amber-800" />
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
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  This is general guidance, not a diagnosis. We&apos;ll always tailor advice to your mouth, your goals, and
                  your pace.
                </p>
              </div>
              <Button
                type="button"
                onClick={onBookClick}
                className="magnetic-btn h-14 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-lg group"
              >
                Talk to us about {selectedTreatment.name}{" "}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
