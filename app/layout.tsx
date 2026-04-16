import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Carter Dental Studio | Private Dental Care in Manchester',
  description: 'Modern private dental care that feels calm, clear, and easy to book. Serving Manchester with gentle dentistry, cosmetic treatments, and same-week emergency appointments.',
  keywords: ['dentist manchester', 'private dentist', 'cosmetic dentistry', 'nervous patients dentist', 'emergency dentist'],
  authors: [{ name: 'Dr. Amelia Carter' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#5a9a9a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} bg-background`}>
      <body className="font-sans antialiased relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-4 focus:left-4 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <div className="film-grain" aria-hidden="true" />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
