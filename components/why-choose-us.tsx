import { Heart, MessageCircle, Calendar, Smile, Home, Leaf } from "lucide-react"

const reasons = [
  {
    icon: Heart,
    title: "Gentle, patient-first care",
    description: "Every treatment is delivered with care and consideration for your comfort."
  },
  {
    icon: MessageCircle,
    title: "Clear communication",
    description: "We explain everything in plain terms so you understand your options."
  },
  {
    icon: Calendar,
    title: "Flexible appointments",
    description: "Early morning, evening, and same-week appointments available."
  },
  {
    icon: Smile,
    title: "Nervous patient specialists",
    description: "Our calm approach helps anxious visitors feel more at ease."
  },
  {
    icon: Home,
    title: "Modern, calming environment",
    description: "A clean, bright space designed to help you feel relaxed."
  },
  {
    icon: Leaf,
    title: "Contemporary techniques",
    description: "Using the latest methods for more comfortable treatment."
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Why patients choose Carter Dental Studio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We focus on making dental care feel different: calm, clear, and genuinely comfortable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
