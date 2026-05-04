"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeaderAuthSection } from "@/components/header-auth-section"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Treatments", href: "#treatments" },
  { label: "About", href: "#why-us" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
]

interface HeaderProps {
  onBookClick: () => void
  onOpenSchedulingModal: () => void
}

export function Header({ onBookClick, onOpenSchedulingModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openScheduling = () => {
    setIsMobileMenuOpen(false)
    onOpenSchedulingModal()
  }

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl md:mx-auto md:max-w-5xl ${
        isScrolled
          ? "glass-surface py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-primary font-bold text-lg">C</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground text-base tracking-tight leading-none truncate">
                Carter Dental
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5 truncate">
                Studio • Manchester
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-7 xl:gap-8 shrink min-w-0 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-all text-sm font-medium tracking-wide relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <HeaderAuthSection variant="desktop" />
            <Button
              type="button"
              onClick={openScheduling}
              variant="outline"
              className="h-11 px-4 text-sm whitespace-nowrap"
            >
              Request demo
            </Button>
            <Button
              type="button"
              onClick={openScheduling}
              variant="cta"
              className="h-11 px-4 text-sm whitespace-nowrap"
            >
              Book website audit
            </Button>
            <Button
              type="button"
              onClick={onBookClick}
              variant="ghost"
              className="h-11 px-3 text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Book a visit
            </Button>
          </div>

          {/* Mobile: profile + hamburger */}
          <div className="flex items-center gap-1.5 md:hidden">
            <HeaderAuthSection variant="mobile-toolbar" onNavigate={() => setIsMobileMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="shrink-0 rounded-xl bg-secondary/50 p-2.5 text-foreground transition-colors hover:bg-secondary"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 glass-surface rounded-2xl p-6 border-none shadow-2xl animate-fade-in-up">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-foreground hover:text-primary transition-colors text-lg font-medium py-3 border-b border-border/50"
              >
                {link.label}
              </Link>
            ))}
            <HeaderAuthSection variant="mobile-drawer" onNavigate={() => setIsMobileMenuOpen(false)} />
            <Button
              type="button"
              onClick={openScheduling}
              variant="outline"
              className="mt-2 h-12 w-full rounded-2xl text-base"
            >
              Request demo
            </Button>
            <Button
              type="button"
              onClick={openScheduling}
              variant="cta"
              className="h-14 w-full rounded-2xl text-base shadow-lg shadow-primary/20"
            >
              Book website audit
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onBookClick()
              }}
              variant="ghost"
              className="h-12 w-full rounded-2xl text-base text-muted-foreground"
            >
              Book a visit
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
