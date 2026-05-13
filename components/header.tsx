"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MagneticCTAButton } from "@/components/ui/magnetic-cta-button"
import { HeaderAuthSection } from "@/components/header-auth-section"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { LeadSchedulingIntent } from "@/lib/leads/lead-questions"
import { ChevronDown, Menu, X } from "lucide-react"

type MoreLink = {
  label: string
  href: string
}

const moreLinks: MoreLink[] = [
  { label: "Treatments", href: "#treatments" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#proof" },
]

interface HeaderProps {
  onBookClick: () => void
  onOpenSchedulingModal: (intent: LeadSchedulingIntent) => void
}

export function Header({ onBookClick: _onBookClick, onOpenSchedulingModal }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll while the mobile glass sheet is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMobileMenuOpen])

  const openAuditModal = () => {
    setIsMobileMenuOpen(false)
    onOpenSchedulingModal("website_audit")
  }

  const openLoginModal = useCallback(() => {
    setIsMobileMenuOpen(false)
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("login", "1")
    const search = params.toString()
    router.replace(`${pathname}${search ? `?${search}` : ""}`, { scroll: false })
  }, [pathname, router, searchParams])

  return (
    <>
      <header
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl md:mx-auto md:max-w-5xl ${
          isScrolled ? "glass-surface py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 md:h-16 gap-2">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0 min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Carter Dental home"
            >
              <Image
                src="/logo-mark.svg"
                alt=""
                width={40}
                height={40}
                priority
                className="h-10 w-10 transition-transform group-hover:scale-105"
              />
              <span className="font-bold text-foreground text-base tracking-tight leading-none truncate hidden sm:inline">
                Carter Dental
              </span>
            </Link>

            {/* Desktop: More ▾ + CTA */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 min-w-[44px] px-4 text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    More
                    <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={10} className="w-52 rounded-2xl glass-surface border-none p-2">
                  {moreLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild className="min-h-11 cursor-pointer rounded-xl px-3 text-sm">
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    className="min-h-11 cursor-pointer rounded-xl px-3 text-sm"
                    onSelect={(e) => {
                      e.preventDefault()
                      openLoginModal()
                    }}
                  >
                    Log in
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <HeaderAuthSection variant="desktop" />
              <MagneticCTAButton
                type="button"
                onClick={openAuditModal}
                variant="cta"
                className="h-11 min-w-[44px] px-5 text-sm font-semibold whitespace-nowrap"
              >
                Book Website Audit
              </MagneticCTAButton>
            </div>

            {/* Mobile: compact CTA + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <HeaderAuthSection variant="mobile-toolbar" onNavigate={() => setIsMobileMenuOpen(false)} />
              <MagneticCTAButton
                type="button"
                onClick={openAuditModal}
                variant="cta"
                className="h-11 min-h-[44px] px-3 text-xs font-semibold whitespace-nowrap"
              >
                Book Website Audit
              </MagneticCTAButton>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="shrink-0 inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-secondary/50 text-foreground transition-colors hover:bg-secondary"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-sheet"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-height glass sheet */}
      {isMobileMenuOpen ? (
        <div
          id="mobile-nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="md:hidden fixed inset-0 z-[60] flex flex-col"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative glass-surface mx-3 mt-3 mb-3 flex flex-1 flex-col rounded-3xl border-none p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
                aria-label="Carter Dental home"
              >
                <Image src="/logo-mark.svg" alt="" width={40} height={40} className="h-10 w-10" />
                <span className="font-bold text-foreground text-lg tracking-tight">Carter Dental</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/50 text-foreground transition-colors hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-[52px] items-center rounded-xl px-3 text-lg font-medium text-foreground transition-colors hover:bg-secondary/40"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={openLoginModal}
                className="flex min-h-[52px] items-center rounded-xl px-3 text-left text-lg font-medium text-foreground transition-colors hover:bg-secondary/40"
              >
                Log in
              </button>
            </nav>

            <div className="mt-auto pt-6">
              <MagneticCTAButton
                type="button"
                onClick={openAuditModal}
                variant="cta"
                className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
              >
                Book Website Audit
              </MagneticCTAButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
