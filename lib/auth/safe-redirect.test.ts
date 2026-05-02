import { describe, expect, it } from 'vitest'
import { sanitizeRedirectPath } from '@/lib/auth/safe-redirect'

describe('sanitizeRedirectPath', () => {
  it('allows same-origin relative paths', () => {
    expect(sanitizeRedirectPath('/dashboard/book?treatment=hygiene-maintenance')).toBe(
      '/dashboard/book?treatment=hygiene-maintenance',
    )
  })

  it('rejects protocol-relative URLs', () => {
    expect(sanitizeRedirectPath('//evil.com/phish')).toBe('/dashboard')
  })

  it('rejects backslashes', () => {
    expect(sanitizeRedirectPath('/\\\\evil')).toBe('/dashboard')
  })

  it('uses fallback when empty', () => {
    expect(sanitizeRedirectPath(null)).toBe('/dashboard')
    expect(sanitizeRedirectPath('')).toBe('/dashboard')
  })
})
