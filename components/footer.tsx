"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin } from "lucide-react"

interface FooterProps {
  onBookClick: () => void
  onOpenSchedulingModal: () => void
}

const navLinks = [
  { label: "Treatments", href: "#treatments" },
  { label: "About", href: "#why-us" },
  { label: "Team", href: "#team" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
]

export function Footer({ onBookClick, onOpenSchedulingModal }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary font-bold text-lg">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-base tracking-tight leading-none">
                  Carter Dental
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">
                  Studio • Manchester
                </span>
              </div>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Modern private dental care that feels calm, clear, and easy to book. 
              Serving Manchester with a patient-first approach.
            </p>
            <div className="flex flex-col gap-2 sm:max-w-xs">
              <Button
                type="button"
                onClick={onOpenSchedulingModal}
                variant="cta"
                className="h-12 px-8 font-bold shadow-lg shadow-primary/20"
              >
                Book website audit
              </Button>
              <Button type="button" onClick={onOpenSchedulingModal} variant="outline" className="h-11 px-6">
                Request demo
              </Button>
              <Button onClick={onBookClick} variant="ghost" className="h-11 px-6 text-muted-foreground">
                Book a visit
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenSchedulingModal}
                  className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Book website audit
                </button>
              </li>
              <li>
                <Link
                  href="/book-a-call"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open scheduling page
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Dental+Street+Manchester+M1+2AB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  123 Dental Street<br />
                  Manchester, M1 2AB
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="tel:+441611234567"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  0161 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:hello@carterdentalstudio.co.uk"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@carterdentalstudio.co.uk
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Opening Hours</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>Mon - Fri: 8:00 - 18:00</p>
                  <p>Saturday: 9:00 - 14:00</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-3">Follow us</p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Facebook className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Carter Dental Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
