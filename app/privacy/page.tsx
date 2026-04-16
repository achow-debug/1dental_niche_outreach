import Link from "next/link"

export default function PrivacyPage() {
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
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Privacy policy</h1>
      <p className="mt-6 text-muted-foreground leading-relaxed">
        Replace this page with your practice&apos;s real privacy policy and data handling details. Until then, this
        placeholder confirms the footer link is wired for launch.
      </p>
    </main>
  )
}
