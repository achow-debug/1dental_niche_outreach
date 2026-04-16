import { Heart, MessageCircle, Calendar, Smile, Home, Leaf, ShieldCheck, Sparkles } from "lucide-react"

const reasons = [
  {
    icon: Smile,
    title: "Nervous Patients",
    description: "Our clinic is designed specifically for those who feel anxious at the dentist. Gentle care is our priority."
  },
  {
    icon: ShieldCheck,
    title: "Busy Professionals",
    description: "Early morning, evening, and same-week appointments make fitting care into your schedule effortless."
  },
  {
    icon: Sparkles,
    title: "Cosmetic & Health",
    description: "From essential checkups to aesthetic transformations, we offer modern private care with a bespoke touch."
  },
  {
    icon: MessageCircle,
    title: "Clear Communication",
    description: "We explain every step in plain English, ensuring you remain in control of your treatment journey."
  },
  {
    icon: Home,
    title: "Private Comfort",
    description: "A bright, modern space designed to feel more like a wellness studio than a traditional clinic."
  },
  {
    icon: Leaf,
    title: "Modern Tech",
    description: "We use the latest digital tools to make treatments more precise, faster, and more comfortable."
  },
]

export function WhyChooseUs() {
  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 animate-fade-in-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Patient Experience</span>
            </div>
            <h2 className="text-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Modern private care <br />
              <span className="text-primary italic">tailored to you.</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
            We've built a clinic that prioritizes your comfort, clarity, and peace of mind at every stage.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group glass-surface p-8 rounded-[2rem] border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                <reason.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-editorial text-2xl font-bold text-foreground mb-4">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
