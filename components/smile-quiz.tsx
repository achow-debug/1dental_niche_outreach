"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, MessageSquare } from "lucide-react"

const steps = [
  {
    question: "What is your main concern?",
    options: [
      { label: "Straighter teeth", icon: "✨" },
      { label: "A whiter smile", icon: "💎" },
      { label: "Chips, gaps, or wear", icon: "🛠️" },
      { label: "General health & peace of mind", icon: "🩺" },
    ],
  },
  {
    question: "How soon would you like to see results?",
    options: [
      { label: "As soon as we can make it work", icon: "🚀" },
      { label: "Within the next few months", icon: "📅" },
      { label: "I'm happy to take my time", icon: "🌿" },
    ],
  },
  {
    question: "What would help you feel most at ease?",
    options: [
      { label: "Clear explanations, no rush", icon: "💬" },
      { label: "Extra time for nervous visits", icon: "🫶" },
      { label: "Flexible scheduling", icon: "⏰" },
      { label: "A calm, private setting", icon: "🌙" },
    ],
  },
]

interface SmileQuizProps {
  onBookClick: () => void
}

export function SmileQuiz({ onBookClick }: SmileQuizProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const handleOptionClick = (option: string) => {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers([])
    setIsFinished(false)
  }

  return (
    <div className="glass-surface rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border-none max-w-2xl mx-auto interactive-card-lift">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-3xl" />

      {!isFinished ? (
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              Smile assessment
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Question {currentStep + 1} of {steps.length}
            </span>
          </div>

          <h3 className="text-3xl font-bold mb-8 text-foreground tracking-tight leading-[1.1]">
            {steps[currentStep].question}
          </h3>

          <div className="grid gap-4">
            {steps[currentStep].options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => handleOptionClick(option.label)}
                className="flex items-center justify-between p-6 bg-white hover:bg-primary/5 border border-border hover:border-primary/50 transition-all rounded-2xl group text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl" aria-hidden>
                    {option.icon}
                  </span>
                  <span className="font-bold text-foreground">{option.label}</span>
                </div>
                <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                  <Check className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Here&apos;s a gentle next step</h3>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            From what you&apos;ve shared, a relaxed consultation is the kindest place to start — especially with{" "}
            <strong className="text-foreground font-semibold">{answers[0]?.toLowerCase()}</strong> in mind and a goal of{" "}
            <strong className="text-foreground font-semibold">{answers[1]?.toLowerCase()}</strong>.
          </p>

          <div className="bg-primary/5 rounded-2xl p-6 mb-8 text-left border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Your next step</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">1</span>
                </div>
                <span>
                  Meet with Dr. Carter to map a plan that respects your pace ({answers[1]?.toLowerCase()}) and what helps
                  you feel comfortable ({answers[2]?.toLowerCase()}).
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">2</span>
                </div>
                <span>See options clearly — no pressure, just honest guidance tailored to you.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              onClick={onBookClick}
              className="magnetic-btn flex-1 h-14 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90"
            >
              Book a visit <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <button
              type="button"
              onClick={resetQuiz}
              className="px-6 h-14 font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
