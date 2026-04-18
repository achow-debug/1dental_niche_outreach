# 1dental_niche_outreach

A **Next.js** marketing site for a private dental practice: long-form landing content (hero, treatments, social proof, pricing, FAQs), interactive sections (smile quiz, suitability checker, booking flow), and legal/accessibility pages. The current build targets **Carter Dental Studio** (Manchester); copy and metadata live in components and `app/layout.tsx`.

Originally scaffolded with [v0](https://v0.app); day-to-day development is standard Next.js in this repo.

## Stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | [React](https://react.dev) 19 |
| Language | [TypeScript](https://www.typescriptlang.org) (strict) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 + [PostCSS](https://postcss.org) |
| Components | [shadcn/ui](https://ui.shadcn.com) (New York style) — [Radix UI](https://www.radix-ui.com) primitives, [Lucide](https://lucide.dev) icons |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Forms / validation | [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev), [@hookform/resolvers](https://github.com/react-hook-form/resolvers) |
| Charts | [Recharts](https://recharts.org) |
| Carousels / drawers | [Embla Carousel](https://www.embla-carousel.com), [Vaul](https://github.com/emilkowalski/vaul) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) (+ Radix toast primitives in `components/ui`) |
| Analytics | [@vercel/analytics](https://vercel.com/docs/analytics) (production only in root layout) |
| Font | [Manrope](https://fonts.google.com/specimen/Manrope) via `next/font` |

Path alias: `@/*` → project root (see `tsconfig.json`).

## Project layout

- `app/` — App Router: `layout.tsx`, `globals.css`, routes (`page.tsx`, `book/`, `privacy/`, `terms/`, `accessibility/`).
- `components/` — Page sections (`hero`, `treatments`, `booking-modal`, etc.) and `components/ui/` (shadcn-style primitives).
- `lib/utils.ts` — Shared helpers (e.g. `cn` for class names).
- `hooks/` — Client hooks (e.g. mobile detection, toast).
- `public/` — Static assets (icons, media referenced by layout metadata).

## Scripts

```bash
pnpm install   # repo has pnpm-lock.yaml; npm/yarn also work
pnpm dev       # http://localhost:3000
pnpm build
pnpm start
pnpm lint      # `eslint .` per package.json
```

If `pnpm lint` fails with a missing `eslint` binary, add ESLint (and a config) to the project; the script is wired but not all tooling may be committed here.

## Build / config notes

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` — useful for quick deploys; tighten before production hardening.
- SEO defaults: `metadata` and `viewport` in `app/layout.tsx`.

## Optional: v0 & deploy

This repo can stay linked to a [v0](https://v0.app) project for UI iteration; merges to `main` may deploy depending on your Vercel (or other) setup.

[Continue working on v0 →](https://v0.app/chat/projects/prj_YIXdBu3MEluT6orRnihq7mawJaLZ)

[![Open in Kiro](https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true)](https://v0.app/chat/api/kiro/clone/achow-debug/1dental_niche_outreach)

## Learn more

- [Next.js docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [v0 docs](https://v0.app/docs)
