"use client"

import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Clock, Shield } from "lucide-react"

interface NervousPatientsProps {
  onBookClick: () => void
}

const reassurances = [
  {
    icon: MessageSquare,
    title: "Clear explanations",
    description: "We explain every step before we begin, so there are no surprises."
  },
  {
    icon: Clock,
    title: "Your pace, not ours",
    description: "We never rush. Take breaks whenever you need them."
  },
  {
    icon: Shield,
    title: "No judgement",
    description: "Whatever your dental history, we are here to help, not criticise."
  },
  {
    icon: Heart,
    title: "Gentle approach",
    description: "Calm, respectful care designed to help you feel more comfortable."
  },
]

export function NervousPatients({ onBookClick }: NervousPatientsProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-sm font-medium text-primary mb-4">
              For nervous patients
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
              Worried about visiting the dentist? You&apos;re not alone.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Dental anxiety is incredibly common, and we understand how difficult it can be to book an appointment 
              after putting it off. Our approach is designed specifically to help nervous patients feel safe, 
              respected, and in control.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Many of our patients tell us they&apos;ve avoided the dentist for years before coming to see us. 
              Whatever your situation, we&apos;re here to help you take the first step with confidence.
            </p>
            
            <Button 
              onClick={onBookClick}
              size="lg"
              className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 font-medium"
            >
              Book Appointment
            </Button>
          </div>
          
          {/* Reassurance cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reassurances.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
