import { Award, Users, Clock, Building2 } from "lucide-react"

const trustItems = [
  { icon: Award, label: "12+ Years Experience", description: "Trusted expertise" },
  { icon: Users, label: "Nervous Patients Welcome", description: "Gentle approach" },
  { icon: Clock, label: "Same-Week Appointments", description: "When you need us" },
  { icon: Building2, label: "Modern Private Clinic", description: "Premium care" },
]

export function TrustBar() {
  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent flex items-center justify-center mb-3">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
