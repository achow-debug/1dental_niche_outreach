"use client"

import { Star, Quote } from "lucide-react"
import { VideoTestimonialGrid } from "@/components/video-testimonial-grid"

const testimonials = [
  {
    quote: "I had put off going to the dentist for years because I was nervous, but Dr. Carter made everything feel calm and manageable from the start. Every step was explained clearly, and I never felt rushed.",
    author: "Sarah M.",
    treatment: "General dentistry"
  },
  {
    quote: "The whole experience felt modern, professional, and surprisingly stress-free. Booking was simple, the clinic was spotless, and I finally found a dentist I actually feel comfortable returning to.",
    author: "James T.",
    treatment: "Regular check-up"
  },
  {
    quote: "I came in for a hygiene appointment and left feeling like I'd found a practice that genuinely cares. Everything was clear, friendly, and easy to understand.",
    author: "Priya R.",
    treatment: "Hygiene appointment"
  },
  {
    quote: "I was worried about cosmetic treatment feeling pushy, but it was the complete opposite. I was given honest advice, clear options, and enough time to decide what was right for me.",
    author: "Chloe W.",
    treatment: "Cosmetic consultation"
  },
  {
    quote: "I needed an urgent appointment and was impressed by how smooth the whole process was. The team were kind, professional, and made a stressful situation feel much easier.",
    author: "Daniel K.",
    treatment: "Emergency care"
  },
  {
    quote: "As someone who gets anxious about dental visits, the calm approach here made a huge difference. I felt listened to, respected, and much more confident by the end of my appointment.",
    author: "Emma L.",
    treatment: "Nervous patient care"
  },
]

const results = [
  {
    title: "Whitening Result",
    description: "Subtle whitening result designed to look fresh, natural, and confident.",
    before: "Dull, uneven shade",
    after: "Brighter, cleaner-looking smile"
  },
  {
    title: "Cosmetic Bonding",
    description: "Composite bonding used to restore balance and improve smile confidence.",
    before: "Chipped front tooth",
    after: "Smoother, balanced smile line"
  },
  {
    title: "Hygiene Transformation",
    description: "Hygiene-focused care that makes a visible difference in both comfort and appearance.",
    before: "Visible staining and buildup",
    after: "Cleaner, healthier-looking teeth"
  },
  {
    title: "Smile Makeover",
    description: "A treatment journey built around confidence, clarity, and natural-looking improvement.",
    before: "Self-conscious about smiling",
    after: "Improved confidence"
  },
]

const stories = [
  {
    headline: "From years of avoidance to confident routine visits",
    body: "One patient came to Carter Dental Studio after avoiding dental appointments for several years due to anxiety and past bad experiences. With a slower, calmer approach and clear communication at every step, they were able to complete their treatment plan feeling informed, respected, and far more confident about future visits."
  },
  {
    headline: "A more confident smile without a pushy experience",
    body: "A busy professional wanted to improve the appearance of their smile before a major life event, but didn't want to feel pressured into unnecessary treatment. After a clear cosmetic consultation and a simple treatment plan, they achieved a fresher, more balanced smile and felt comfortable throughout the process."
  },
  {
    headline: "Urgent care handled with calm and clarity",
    body: "A patient booked in with discomfort and uncertainty about what treatment they might need. The team made the process feel calm from the first interaction, explained the options clearly, and helped them move from stress and uncertainty to relief and reassurance."
  },
]

export function SocialProof() {
  return (
    <section id="reviews" className="scroll-mt-28 md:scroll-mt-32 py-10 md:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Real patient experiences
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Hear from people who&apos;ve experienced our calm, professional approach — in writing and on camera.
          </p>
        </div>

        <VideoTestimonialGrid />

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 md:mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-all interactive-card-lift"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-primary/20 mb-3" />
              <p className="text-foreground leading-relaxed mb-4">
                {testimonial.quote}
              </p>
              <div className="pt-4 border-t border-border">
                <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{testimonial.treatment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="mb-10 md:mb-12">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-6 md:mb-8">
            Results that feel as good as they look
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl overflow-hidden border border-border"
              >
                {/* Before/After visual placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-accent to-muted flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span className="px-2 py-1 bg-card/80 rounded">Before</span>
                      <span>→</span>
                      <span className="px-2 py-1 bg-primary/10 rounded text-primary">After</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-foreground mb-2">{result.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transformation Stories */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground text-center mb-6 md:mb-8">
            Patient transformation stories
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-foreground text-lg mb-3 leading-snug">
                  {story.headline}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {story.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
