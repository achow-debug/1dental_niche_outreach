import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold text-foreground">
              My account
            </Link>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Marketing site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  )
}
