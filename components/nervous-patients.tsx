"use client"

import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Clock, Shield, CheckCircle } from "lucide-react"

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
    description: "We never rush. Take breaks whenever you need them — you are in control."
  },
  {
    icon: Shield,
    title: "No judgement",
    description: "Whatever your dental history, we are here to help, not criticise. We've seen it all."
  },
  {
    icon: Heart,
    title: "Gentle approach",
    description: "Calm, respectful care designed to help you feel safe and heard."
  },
]

export function NervousPatients({ onBookClick }: NervousPatientsProps) {
  return (
    <section id="reassurance" className="section-padding bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-32 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-8">
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">A Reassuring Environment</span>
            </div>
            <h2 className="text-editorial text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-8">
              Your comfort is <br />
              <span className="text-primary italic">our priority.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              Dental anxiety is common. Many of our patients avoided the dentist for years before finding our calm, patient-first approach. 
            </p>
            
            <div className="space-y-6 mb-12">
              {[
                "No sales-led treatment plans",
                "Clear, upfront pricing",
                "Patient-first decision making",
                "Gentle clinical techniques"
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg font-medium text-foreground">{point}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={onBookClick}
              variant="cta"
              className="h-16 px-12 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105"
            >
              Book Appointment
            </Button>
          </div>
          
          {/* Reassurance cards */}
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {reassurances.map((item, index) => (
              <div
                key={index}
                className="glass-surface rounded-[2.5rem] p-8 border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-editorial text-2xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Soft decorative glow */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  )
}
