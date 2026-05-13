"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { MagneticCTAButton } from "@/components/ui/magnetic-cta-button"
import type { LeadSchedulingIntent } from "@/lib/leads/lead-questions"

interface FooterProps {
  onBookClick: () => void
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
]

const socialLinks = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "YouTube", href: "#", Icon: Youtube },
] as const

export function Footer({ onBookClick: _onBookClick, onOpenSchedulingModal }: FooterProps) {
  return (
    <footer
      className="border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--glass-bg)]"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 text-center sm:px-6 md:py-16">
        <Link href="/" className="flex items-center gap-3" aria-label="Carter Dental home">
          <Image src="/logo-mark.svg" alt="" width={44} height={44} className="h-11 w-11" />
          <span className="text-lg font-bold tracking-tight text-foreground">Carter Dental</span>
        </Link>

        <p className="max-w-md text-pretty text-sm text-muted-foreground">
          A 10-minute audit shows exactly why your dental site is costing you patients — and how to fix it.
        </p>

        <MagneticCTAButton
          type="button"
          onClick={() => onOpenSchedulingModal("website_audit")}
          variant="cta"
          className="h-12 px-8 text-sm font-semibold"
        >
          Book Website Audit
        </MagneticCTAButton>

        <ul className="flex items-center justify-center gap-3" aria-label="Carter Dental on social media">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (opens in new tab)`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-background/80 text-foreground/80 transition-colors hover:text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <link.Icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-3 pt-2 text-xs text-muted-foreground sm:flex-row sm:gap-6">
          <p>© {new Date().getFullYear()} Carter Dental Studio</p>
          <ul className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
