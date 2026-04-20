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
}

export function Header({ onBookClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl md:mx-auto md:max-w-5xl ${
        isScrolled
          ? "glass-surface py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-all text-sm font-medium tracking-wide relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-10">
            <HeaderAuthSection variant="desktop" />
            <Button 
              onClick={onBookClick}
              variant="cta"
              className="h-11 px-7 text-sm"
            >
              Book a visit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-secondary/50 text-foreground transition-colors hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            <HeaderAuthSection variant="mobile" onNavigate={() => setIsMobileMenuOpen(false)} />
            <Button 
              onClick={() => {
                setIsMobileMenuOpen(false)
                onBookClick()
              }}
              variant="cta"
              className="mt-4 h-14 w-full rounded-2xl text-base shadow-lg shadow-primary/20"
            >
              Book a visit
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
