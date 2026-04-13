"use client"

import { Button } from "@/components/ui/button"
import { Stethoscope, Sparkles, Sun, Palette, AlertCircle, Users } from "lucide-react"

interface TreatmentsProps {
  onBookClick: () => void
}

const treatments = [
  {
    icon: Stethoscope,
    title: "General Dentistry",
    description: "Comprehensive check-ups, fillings, and preventive care to keep your smile healthy.",
    features: ["Regular check-ups", "Fillings & repairs", "Preventive care"]
  },
  {
    icon: Sparkles,
    title: "Hygiene Appointments",
    description: "Professional cleaning and guidance to maintain optimal oral health between visits.",
    features: ["Deep cleaning", "Stain removal", "Personalised advice"]
  },
  {
    icon: Sun,
    title: "Teeth Whitening",
    description: "Safe, effective whitening treatments for a naturally brighter smile.",
    features: ["Professional results", "Safe approach", "Natural finish"]
  },
  {
    icon: Palette,
    title: "Cosmetic Dentistry",
    description: "Subtle improvements that enhance your smile while looking completely natural.",
    features: ["Veneers", "Bonding", "Smile design"]
  },
  {
    icon: AlertCircle,
    title: "Emergency Dental Care",
    description: "Same-week appointments for urgent dental issues when you need us most.",
    features: ["Same-week booking", "Pain relief", "Clear guidance"]
  },
  {
    icon: Users,
    title: "Family Dentistry",
    description: "Caring for patients of all ages with a gentle, family-friendly approach.",
    features: ["All ages welcome", "Family appointments", "Gentle care"]
  },
]

export function Treatments({ onBookClick }: TreatmentsProps) {
  return (
    <section id="treatments" className="py-20 md:py-28 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Treatments designed around your needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From routine care to cosmetic improvements, we offer a complete range of modern dental services.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <treatment.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-xl mb-3">
                {treatment.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {treatment.description}
              </p>
              <ul className="space-y-2">
                {treatment.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={onBookClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 font-medium"
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </section>
  )
}
