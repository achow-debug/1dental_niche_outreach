import Image from "next/image"
import { Award, GraduationCap, Heart, Users } from "lucide-react"

const credentials = [
  { icon: GraduationCap, label: "University of Manchester Graduate" },
  { icon: Award, label: "12+ Years Clinical Experience" },
  { icon: Heart, label: "Nervous Patient Specialist" },
  { icon: Users, label: "500+ Patients Trusted" },
]

export function MeetDentist() {
  return (
    <section id="team" className="scroll-mt-28 md:scroll-mt-32 py-10 md:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-muted max-w-md mx-auto lg:mx-0 shadow-xl">
              <Image
                src="/images/dr-carter.jpg"
                alt="Dr. Amelia Carter, Founder and Lead Dentist at Carter Dental Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-sm font-medium text-primary mb-4">
              Meet your dentist
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
              Dr. Amelia Carter
            </h2>
            <p className="mt-2 text-xl text-muted-foreground">
              Founder & Lead Dentist
            </p>
            
            <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I founded Carter Dental Studio because I believe dental care should feel calm, clear, and 
                genuinely comfortable. After more than 12 years working with patients in Manchester, I&apos;ve 
                seen how much difference a thoughtful, patient-first approach can make.
              </p>
              <p>
                My focus has always been on helping people feel at ease in the dentist&apos;s chair, 
                especially those who&apos;ve had difficult experiences in the past. Whether you&apos;re coming 
                for a routine check-up or something more involved, my goal is to ensure you feel 
                informed, respected, and confident every step of the way.
              </p>
              <p>
                I take time to explain everything in plain terms, answer your questions honestly, and 
                create a treatment plan that genuinely fits your needs, not just a one-size-fits-all approach.
              </p>
            </div>
            
            {/* Credentials */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {credentials.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
