"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const treatments = [
  "General Check-up",
  "Hygiene Appointment",
  "Teeth Whitening",
  "Cosmetic Consultation",
  "Emergency Appointment",
  "Family Appointment",
]

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
]

const dates = [
  { day: "Mon", date: "15", month: "Apr" },
  { day: "Tue", date: "16", month: "Apr" },
  { day: "Wed", date: "17", month: "Apr" },
  { day: "Thu", date: "18", month: "Apr" },
  { day: "Fri", date: "19", month: "Apr" },
]

type BookingStep = "treatment" | "datetime" | "details" | "confirmation"

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("treatment")
  const [selectedTreatment, setSelectedTreatment] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleClose = () => {
    setStep("treatment")
    setSelectedTreatment("")
    setSelectedDate("")
    setSelectedTime("")
    setFormData({ name: "", email: "", phone: "" })
    onClose()
  }

  const goBack = () => {
    if (step === "datetime") setStep("treatment")
    else if (step === "details") setStep("datetime")
  }

  const renderTreatmentStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the type of appointment you&apos;d like to book.
      </p>
      <div className="grid gap-3">
        {treatments.map((treatment) => (
          <button
            key={treatment}
            onClick={() => {
              setSelectedTreatment(treatment)
              setStep("datetime")
            }}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedTreatment === treatment
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 bg-card"
            }`}
          >
            <span className="font-medium text-foreground">{treatment}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to treatments
      </button>

      <div>
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Select a date
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex-shrink-0 w-16 py-3 rounded-xl border text-center transition-all ${
                selectedDate === d.date
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/30 bg-card"
              }`}
            >
              <span className="block text-xs opacity-70">{d.day}</span>
              <span className="block text-lg font-semibold">{d.date}</span>
              <span className="block text-xs opacity-70">{d.month}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Select a time
        </p>
        <div className="grid grid-cols-3 gap-2">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedTime === time
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/30 bg-card text-foreground"
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
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 font-medium disabled:opacity-50"
      >
        Continue
      </Button>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to date & time
      </button>

      {/* Summary */}
      <div className="bg-accent rounded-xl p-4">
        <p className="text-sm font-medium text-foreground mb-2">Your appointment</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{selectedTreatment}</p>
          <p>April {selectedDate}, 2026 at {selectedTime}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
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
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <Button
        onClick={() => setStep("confirmation")}
        disabled={!formData.name || !formData.email || !formData.phone}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 font-medium disabled:opacity-50"
      >
        Confirm Booking
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By booking, you agree to our terms of service and privacy policy.
      </p>
    </div>
  )

  const renderConfirmation = () => (
    <div className="text-center py-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        Booking request received
      </h3>
      <p className="text-muted-foreground mb-6">
        Thank you for booking with Carter Dental Studio. 
        We&apos;ll confirm your appointment shortly.
      </p>

      <div className="bg-accent rounded-xl p-5 mb-6 text-left">
        <p className="text-sm font-medium text-foreground mb-3">Appointment details</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Treatment</span>
            <span className="text-foreground">{selectedTreatment}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span className="text-foreground">April {selectedDate}, 2026</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span className="text-foreground">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Name</span>
            <span className="text-foreground">{formData.name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <span>You&apos;ll receive a confirmation email within 24 hours</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Phone className="w-5 h-5 text-primary shrink-0" />
          <span>We may call to confirm your preferred time</span>
        </div>
      </div>

      <Button
        onClick={handleClose}
        className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 font-medium"
      >
        Done
      </Button>
    </div>
  )

  const getTitle = () => {
    switch (step) {
      case "treatment": return "Book your appointment"
      case "datetime": return "Choose date & time"
      case "details": return "Your details"
      case "confirmation": return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {step !== "confirmation" && (
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {getTitle()}
            </DialogTitle>
            {step === "treatment" && (
              <DialogDescription>
                Carter Dental Studio, Manchester
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {step === "treatment" && renderTreatmentStep()}
        {step === "datetime" && renderDateTimeStep()}
        {step === "details" && renderDetailsStep()}
        {step === "confirmation" && renderConfirmation()}
      </DialogContent>
    </Dialog>
  )
}
