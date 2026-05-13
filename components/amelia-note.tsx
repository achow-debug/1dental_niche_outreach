import Image from 'next/image'

export function AmeliaNote() {
  return (
    <section
      aria-labelledby="amelia-note-heading"
      className="px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:gap-12">
        <div className="mx-auto w-full max-w-[360px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-muted shadow-xl">
            <Image
              src="/amelia.jpg"
              alt="Dr Amelia Carter, founder of Carter Dental Studio, smiling in a bright clinic."
              width={720}
              height={900}
              sizes="(max-width: 768px) 90vw, 360px"
              priority={false}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <figure>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            A note from the founder
          </span>
          <h2
            id="amelia-note-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Why I started Carter Dental.
          </h2>
          <blockquote className="mt-5 space-y-4 text-pretty text-lg leading-relaxed text-foreground/90">
            <p>
              I built this practice around the patients I felt let down by — the ones who couldn’t find a clear
              answer online before walking in.
            </p>
            <p>
              Every audit we run is the kind of report I wish I’d had when I opened my own door.
            </p>
            <p>
              If your site isn’t doing your clinic justice, I’d love to show you what we’d change.
            </p>
          </blockquote>
          <figcaption className="mt-6 text-sm font-semibold text-foreground">— Dr Amelia Carter</figcaption>
        </figure>
      </div>
    </section>
  )
}
