"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Shield, 
  Clock, 
  Sparkles, 
  Users, 
  CheckCircle2,
  ArrowRight
} from "lucide-react"

interface WhyBookModalProps {
  isOpen: boolean
  onClose: () => void
  onBookClick: () => void
}

const reasons = [
  {
    icon: Heart,
    title: "Gentle, patient-first care",
    description: "Every appointment is designed around your comfort. We listen, explain clearly, and never rush.",
  },
  {
    icon: Shield,
    title: "12+ years of trusted experience",
    description: "Dr. Amelia Carter brings over a decade of expertise in private dental care.",
  },
  {
    icon: Clock,
    title: "Same-week appointments",
    description: "Need to be seen quickly? We offer flexible scheduling including emergency slots.",
  },
  {
    icon: Sparkles,
    title: "Modern, calming environment",
    description: "Our clinic is designed to feel warm, bright, and reassuring from the moment you arrive.",
  },
  {
    icon: Users,
    title: "Perfect for nervous patients",
    description: "Anxious about dental visits? Our calm approach helps even the most nervous patients feel at ease.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent pricing",
    description: "No surprises. Clear treatment plans and pricing explained before any work begins.",
  },
]

export function WhyBookModal({ isOpen, onClose, onBookClick }: WhyBookModalProps) {
  const handleBookClick = () => {
    onClose()
    onBookClick()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-card/95 border-border/50">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Why patients choose Carter Dental Studio
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Discover what makes our approach to dental care different.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group flex gap-4 p-4 rounded-xl bg-accent/30 backdrop-blur-sm border border-border/30 hover:bg-accent/50 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50">
          <Button
            onClick={handleBookClick}
            variant="cta"
            className="group h-14 w-full text-base font-medium shadow-md hover:shadow-lg"
          >
            Book Appointment
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Simple online booking. No obligation. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
