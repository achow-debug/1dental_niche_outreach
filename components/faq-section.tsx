"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield, Eye, Heart } from "lucide-react"

const faqs = [
  {
    question: "Do you accept nervous patients?",
    answer: "Yes. Many of our patients tell us they feel nervous before booking, especially if it has been a while since their last visit. We take a calm, respectful approach and explain everything clearly so you can feel more comfortable at every stage."
  },
  {
    question: "What happens at my first appointment?",
    answer: "Your first appointment is designed to feel clear and straightforward. We&apos;ll talk through any concerns you have, carry out an examination, and explain any recommended next steps so you know exactly where you stand."
  },
  {
    question: "How quickly can I get an appointment?",
    answer: "We aim to offer appointments as quickly as possible, including same-week availability for selected treatments and urgent dental concerns."
  },
  {
    question: "Do you offer emergency appointments?",
    answer: "Yes. We offer emergency appointment availability for urgent dental issues and aim to make the process feel as smooth and reassuring as possible."
  },
  {
    question: "Will I know the cost before treatment starts?",
    answer: "Yes. We believe in clear treatment recommendations and transparent pricing, so you&apos;ll understand your options before moving forward."
  },
  {
    question: "Are consultations pushy?",
    answer: "No. Our approach is based on clear advice, honest recommendations, and giving you the information you need without pressure."
  },
  {
    question: "What treatments do you offer?",
    answer: "We offer a range of private dental services including general dentistry, hygiene appointments, cosmetic treatments, whitening, and emergency dental care."
  },
  {
    question: "I haven't been to the dentist in years. Is that a problem?",
    answer: "Not at all. Many patients come to us after a long gap, and our role is simply to help you move forward with clear advice and supportive care."
  },
  {
    question: "Do you offer cosmetic treatments that still look natural?",
    answer: "Yes. Our cosmetic approach focuses on balanced, natural-looking improvements that suit your smile rather than making results look overdone."
  },
  {
    question: "Is online booking easy?",
    answer: "Yes. We aim to make booking as quick and straightforward as possible, with a clean, simple process designed to save you time."
  },
  {
    question: "Do you offer family appointments?",
    answer: "Yes. We offer family-friendly appointment options and can help make booking more convenient for households with busy schedules."
  },
  {
    question: "What if I'm unsure which treatment I need?",
    answer: "That's completely fine. You don't need to have everything figured out before booking. We can help guide you based on your concerns and explain the most suitable next steps."
  },
]

const reassuranceCards = [
  {
    icon: Shield,
    title: "No pressure, just clear advice",
    description: "We focus on helping patients understand their options clearly, so you can make decisions confidently and without feeling rushed."
  },
  {
    icon: Eye,
    title: "Transparent from the start",
    description: "From your first visit onward, we aim to keep recommendations, pricing, and next steps easy to understand."
  },
  {
    icon: Heart,
    title: "Designed for nervous patients",
    description: "If dental visits make you anxious, our calm and respectful approach is designed to help you feel more at ease."
  },
]

const concerns = [
  { concern: "I'm worried I'll be judged.", response: "Our role is to help, not lecture. Many patients come to us after time away from dental care." },
  { concern: "I'm worried I'll be pressured into treatment.", response: "We believe in honest recommendations and clear choices, not pressure." },
  { concern: "I'm worried about hidden costs.", response: "We focus on transparent pricing and clear next steps before treatment begins." },
  { concern: "I'm nervous about the experience.", response: "We make the process calmer by slowing things down, explaining everything clearly, and keeping the atmosphere respectful." },
  { concern: "I don't have time for a complicated process.", response: "We keep booking and communication simple, efficient, and easy to follow." },
]

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-28 md:scroll-mt-32 py-10 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight text-balance">
            Everything you need to know before booking
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We know choosing a dentist can come with a lot of questions, especially if you&apos;re booking somewhere new. 
            Here are some of the most common things patients want to know before they schedule an appointment.
          </p>
        </div>

        {/* Objection-handling intro */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <p className="text-muted-foreground italic">
            &ldquo;Booking should feel simple, not stressful. That&apos;s why we focus on clear advice, 
            transparent options, and a calm experience from the moment you get in touch.&rdquo;
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Reassurance Cards */}
          <div className="space-y-4 lg:order-1">
            {reassuranceCards.map((card, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
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

        {/* Common Concerns Section */}
        <div className="mt-16 bg-card rounded-3xl p-8 md:p-10 border border-border">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            What stops most patients from booking — and how we help
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerns.map((item, index) => (
              <div key={index} className="space-y-2">
                <p className="font-medium text-foreground text-sm">
                  {item.concern}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
