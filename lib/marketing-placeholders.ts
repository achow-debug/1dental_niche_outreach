/**
 * Stable remote imagery until real assets ship under `public/images/`.
 * Next is configured with `images.unoptimized`; these URLs load without local files.
 */
export const MARKETING_IMAGES = {
  clinicInterior:
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000',
  dentistPortrait:
    'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=1200',
  dentistProfessional:
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1200',
} as const

/** Paired “before / after” frames for results grids (cosmetic / hygiene storytelling). */
export const BEFORE_AFTER_PLACEHOLDER_PAIRS: ReadonlyArray<{ before: string; after: string }> = [
  {
    before:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=800',
  },
  {
    before:
      'https://images.unsplash.com/photo-1620775397926-f50f6e21ed2f?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1579684947550-22e945225d99?auto=format&fit=crop&q=80&w=800',
  },
  {
    before:
      'https://images.unsplash.com/photo-1606811971618-4486f14f3ea0?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
  },
  {
    before:
      'https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
  },
]
