"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield, Eye, Heart } from "lucide-react"

const faqs = [
  {
    question: "What happens after I request the free audit?",
    answer:
      "We review your clinic website URL and email you specific recommendations within 2 business days. There is no charge for the initial audit — you decide if you want to move forward with a rebuild or smaller fixes.",
  },
  {
    question: "Do you work with our existing branding and content?",
    answer:
      "Yes. We build around your practice name, team photos, treatments, and tone of voice. Your site should feel like your clinic, not a generic template.",
  },
  {
    question: "How long does a typical clinic website rebuild take?",
    answer:
      "Most private practice sites take a few weeks from kickoff to launch, depending on how much content you already have and how many pages you need. We agree milestones upfront so you are never guessing.",
  },
  {
    question: "Will this work with our current booking system?",
    answer:
      "We integrate with the tools you already use — online booking links, enquiry forms, Denplan, SOE, and similar — so patients reach your team without extra friction on your site.",
  },
  {
    question: "What if we only need fixes, not a full rebuild?",
    answer:
      "The free audit highlights what matters most for your clinic. We can scope a smaller project — mobile UX, booking path, speed, or trust sections — if a full rebuild is not the right fit yet.",
  },
  {
    question: "Who hosts the site after launch?",
    answer:
      "We set up fast, reliable hosting and hand over access you control. You keep ownership of your domain and content; we stay available for updates when you need them.",
  },
  {
    question: "Is the audit really free — is there a hard sales call?",
    answer:
      "The initial audit is free with no obligation. We may offer a short call to walk through findings if you want one, but the written report is yours to use either way.",
  },
  {
    question: "What does Standout Group do vs what I am seeing on this demo page?",
    answer:
      "This Carter Dental Studio page is a live demo of our work. Standout Group designs and builds conversion-led websites for UK private dental practices — your audit reviews your real URL, not this fictional example.",
  },
]

const reassuranceCards = [
  {
    icon: Shield,
    title: "No pressure on your timeline",
    description:
      "We explain what we found on your site clearly. You choose whether to fix one thing or rebuild — no hard sell on the free audit.",
  },
  {
    icon: Eye,
    title: "Built for private practices",
    description:
      "Layouts, copy patterns, and booking flows tuned for how patients actually choose a dentist online — on mobile first.",
  },
  {
    icon: Heart,
    title: "Your clinic, your brand",
    description:
      "We implement trust signals, team profiles, and treatment pages that reflect your practice — not a one-size-fits-all brochure.",
  },
]

const concerns = [
  {
    concern: "We do not have time for a big website project.",
    response:
      "The free audit prioritises quick wins on your existing site. We can phase work so your team is not buried.",
  },
  {
    concern: "We are not sure a new site will pay for itself.",
    response:
      "We focus on measurable goals — more enquiries, clearer booking paths, less wasted ad spend — and scope work to match your budget.",
  },
  {
    concern: "Our site looks fine on desktop but fails on mobile.",
    response:
      "Most patients browse on phones. We rebuild mobile UX so your clinic site converts where the traffic actually is.",
  },
  {
    concern: "We are worried about disruption during a rebuild.",
    response:
      "We launch on a staging URL first, then switch when you are happy. Your current site stays live until you approve the new one.",
  },
  {
    concern: "We already pay for ads — the site is the weak link.",
    response:
      "That is exactly what the free audit targets: where paid traffic lands, where visitors drop off, and what to fix on your clinic site first.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-28 md:scroll-mt-32 py-10 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Questions practice owners ask before a rebuild
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-4 lg:order-1">
            {reassuranceCards.map((card, index) => (
              <div key={index} className="bg-card rounded-2xl p-5 border border-border">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 lg:order-2">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-5 data-[state=open]:border-primary/20"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-16 bg-card rounded-3xl p-8 md:p-10 border border-border">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            What stops practices from fixing their site — and how we help
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerns.map((item, index) => (
              <div key={index} className="space-y-2">
                <p className="font-medium text-foreground text-sm">{item.concern}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
