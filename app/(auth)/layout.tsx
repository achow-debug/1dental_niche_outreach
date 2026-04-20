export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-10 text-center">
        <a href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
            C
          </span>
          <span className="text-left leading-tight">
            Carter Dental
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Studio
            </span>
          </span>
        </a>
      </div>
      {children}
    </div>
  )
}
