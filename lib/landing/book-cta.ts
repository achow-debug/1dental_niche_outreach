/** Landing sections use this handler so treatment cards can pre-select dashboard booking. */
export type LandingBookClickHandler = (treatmentSlug?: string) => void

/** Optional context callers can attach when opening the audit/scheduling modal. */
export type LeadSchedulingContext = {
  /** Free-text bottleneck captured from the Quick Find search bar. */
  bottleneck?: string
}
