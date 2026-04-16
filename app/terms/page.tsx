import Link from "next/link"

export default function TermsPage() {
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
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Terms of service</h1>
      <p className="mt-6 text-muted-foreground leading-relaxed">
        Replace this page with your terms of service, cancellation policy, and any site-specific conditions. This stub
        exists so footer navigation does not point at dead anchors.
      </p>
    </main>
  )
}
