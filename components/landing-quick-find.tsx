const LINKS = [
  { href: '#why-us', label: 'Why us' },
  { href: '#results', label: 'Results' },
  { href: '#treatments', label: 'Treatments' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#process', label: 'Process' },
  { href: '#team', label: 'Team' },
  { href: '#reassurance', label: 'Nervous patients' },
  { href: '#faq', label: 'FAQ' },
] as const

export function LandingQuickFind() {
  return (
    <nav
      aria-label="Jump to section"
      className="border-y border-border/60 bg-muted/40 md:bg-muted/25"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 md:mb-0 md:inline md:mr-3 md:align-middle">
          Quick find
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap md:overflow-visible md:inline-flex md:align-middle md:max-w-none [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
