import Link from "next/link"

export default function AccessibilityPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-2xl px-4 py-16 outline-none"
    >
      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Accessibility</h1>
      <p className="mt-6 text-muted-foreground leading-relaxed">
        Summarise your commitment to accessible care and digital accessibility (WCAG targets, feedback contact, and
        reasonable adjustments). Swap this copy when your accessibility statement is ready.
      </p>
    </main>
  )
}
