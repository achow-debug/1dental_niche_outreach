import { describe, expect, it } from 'vitest'
import { resolveUnsubscribedConfirmationUrl } from '@/lib/unsubscribe/resolve-confirmation-url'

describe('resolveUnsubscribedConfirmationUrl', () => {
  it('uses NEXT_PUBLIC_SITE_URL when valid', () => {
    expect(
      resolveUnsubscribedConfirmationUrl({
        requestUrl: 'http://localhost:3000/unsubscribe',
        siteUrlEnv: 'https://carterdental.example/',
      }),
    ).toBe('https://carterdental.example/unsubscribed')
  })

  it('falls back to request origin when env is missing', () => {
    expect(
      resolveUnsubscribedConfirmationUrl({
        requestUrl: 'https://app.example/unsubscribe?t=1',
      }),
    ).toBe('https://app.example/unsubscribed')
  })

  it('falls back when env is invalid', () => {
    expect(
      resolveUnsubscribedConfirmationUrl({
        requestUrl: 'https://ok.test/unsubscribe',
        siteUrlEnv: 'not a url',
      }),
    ).toBe('https://ok.test/unsubscribed')
  })
})
