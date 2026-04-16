'use client'

/**
 * Carter Dental Studio ships as a light, warm UI. `next-themes` is available if you add
 * a toggle later; the root layout does not wrap children in ThemeProvider, so `.dark`
 * styles in shared primitives are effectively unused unless you wire this up.
 */
import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
