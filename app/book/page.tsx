"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, ArrowLeft, Sparkles, Shield, Heart } from "lucide-react"

const treatments = [
  { id: "checkup", name: "General Check-up", description: "Comprehensive examination and assessment", duration: "45 min", price: "£65" },
  { id: "new-patient", name: "New Patient Examination", description: "Full examination for first-time patients", duration: "60 min", price: "£95" },
  { id: "hygiene", name: "Hygiene Appointment", description: "Professional cleaning and oral health guidance", duration: "30 min", price: "£85" },
  { id: "whitening", name: "Teeth Whitening Consultation", description: "Discuss whitening options and suitability", duration: "30 min", price: "£75" },
  { id: "cosmetic", name: "Cosmetic Consultation", description: "Explore cosmetic treatment options", duration: "45 min", price: "£75" },
  { id: "emergency", name: "Emergency Appointment", description: "Urgent dental care when you need it", duration: "30 min", price: "£120" },
]

const dates = [
  { day: "Mon", date: "15", month: "Apr", full: "Monday 15 April" },
  { day: "Tue", date: "16", month: "Apr", full: "Tuesday 16 April" },
  { day: "Wed", date: "17", month: "Apr", full: "Wednesday 17 April" },
  { day: "Thu", date: "18", month: "Apr", full: "Thursday 18 April" },
  { day: "Fri", date: "19", month: "Apr", full: "Friday 19 April" },
  { day: "Sat", date: "20", month: "Apr", full: "Saturday 20 April" },
]

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
]

type BookingStep = "treatment" | "datetime" | "details" | "confirmation"

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>("treatment")
  const [selectedTreatment, setSelectedTreatment] = useState<typeof treatments[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<typeof dates[0] | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const goBack = () => {
    if (step === "datetime") setStep("treatment")
    else if (step === "details") setStep("datetime")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">C</span>
            </div>
            <span className="font-semibold text-foreground text-lg tracking-tight">
              Carter Dental Studio
            </span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to website
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Progress indicator */}
        {step !== "confirmation" && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "treatment" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>1</div>
              <div className={`h-0.5 flex-1 ${step === "treatment" ? "bg-border" : "bg-primary"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "datetime" ? "bg-primary text-primary-foreground" : step === "details" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>2</div>
              <div className={`h-0.5 flex-1 ${step === "details" ? "bg-primary" : "bg-border"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>3</div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Treatment</span>
              <span>Date & Time</span>
              <span>Your Details</span>
            </div>
          </div>
        )}

        {/* Step 1: Treatment Selection */}
        {step === "treatment" && (
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Book your appointment
            </h1>
            <p className="text-muted-foreground mb-8">
              Select the type of appointment you&apos;d like to book.
            </p>

            <div className="grid gap-4">
              {treatments.map((treatment) => (
                <button
                  key={treatment.id}
                  onClick={() => {
                    setSelectedTreatment(treatment)
                    setStep("datetime")
                  }}
                  className="w-full text-left p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {treatment.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {treatment.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {treatment.duration}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground">{treatment.price}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>Nervous patients welcome</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === "datetime" && selectedTreatment && (
          <div>
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Change treatment
            </button>

            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Choose your time
            </h1>
            <p className="text-muted-foreground mb-2">
              {selectedTreatment.name} · {selectedTreatment.duration}
            </p>

            {/* Date selection */}
            <div className="mt-8">
              <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Select a date
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d)}
                    className={`flex-shrink-0 w-20 py-4 rounded-2xl border text-center transition-all ${
                      selectedDate?.date === d.date
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="block text-xs opacity-70">{d.day}</span>
                    <span className="block text-2xl font-semibold">{d.date}</span>
                    <span className="block text-xs opacity-70">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time selection */}
            <div className="mt-8">
              <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Select a time
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/30 text-foreground"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("details")}
              disabled={!selectedDate || !selectedTime}
              size="lg"
              className="w-full mt-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 font-medium disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 3: Details */}
        {step === "details" && selectedTreatment && selectedDate && (
          <div>
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Change time
            </button>

            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Your details
            </h1>
            <p className="text-muted-foreground mb-8">
              Almost there. Just need a few details to confirm your booking.
            </p>

            {/* Appointment summary */}
            <div className="bg-accent rounded-2xl p-5 mb-8">
              <p className="text-sm font-medium text-foreground mb-2">Your appointment</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="text-foreground font-medium">{selectedTreatment.name}</p>
                <p>{selectedDate.full} at {selectedTime}</p>
                <p>{selectedTreatment.price}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full mt-2 px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full mt-2 px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full mt-2 px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2">
                  Additional notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anything you'd like us to know, such as concerns or specific questions"
                  rows={3}
                  className="w-full mt-2 px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep("confirmation")}
              disabled={!formData.name || !formData.email || !formData.phone}
              size="lg"
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 font-medium disabled:opacity-50"
            >
              Confirm Booking
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By booking, you agree to our terms of service and privacy policy.
            </p>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === "confirmation" && selectedTreatment && selectedDate && (
          <div className="text-center py-10">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="text-3xl font-semibold text-foreground mb-3">
              Booking request received
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
              Thank you for booking with Carter Dental Studio. 
              We&apos;ll confirm your appointment within 24 hours.
            </p>

            <div className="bg-card rounded-2xl p-6 mb-10 text-left max-w-md mx-auto border border-border">
              <p className="text-sm font-medium text-foreground mb-4">Appointment details</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Treatment</span>
                  <span className="text-foreground font-medium">{selectedTreatment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">{selectedDate.full}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-foreground font-medium">{selectedTreatment.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-md mx-auto text-left mb-10">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive a confirmation email at <span className="text-foreground">{formData.email}</span> within 24 hours.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  We may call to confirm your preferred time or discuss any questions.
                </p>
              </div>
            </div>

            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 font-medium"
              >
                Return to website
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
