"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin } from "lucide-react"

interface FooterProps {
  onBookClick: () => void
}

const navLinks = [
  { label: "Treatments", href: "#treatments" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Accessibility", href: "#" },
]

export function Footer({ onBookClick }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">C</span>
              </div>
              <span className="font-semibold text-foreground text-lg tracking-tight">
                Carter Dental Studio
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Modern private dental care that feels calm, clear, and easy to book. 
              Serving Manchester with gentle dentistry.
            </p>
            <Button 
              onClick={onBookClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 h-10 font-medium"
            >
              Book Appointment
            </Button>
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
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Dental Street<br />
                  Manchester, M1 2AB
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">0161 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">hello@carterdentalstudio.co.uk</span>
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
