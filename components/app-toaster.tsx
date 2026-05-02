'use client'

import { Toaster } from 'sonner'

/** Root toast host without `next-themes` (root layout does not wrap ThemeProvider). */
export function AppToaster() {
  return <Toaster richColors closeButton position="top-center" theme="light" />
}
