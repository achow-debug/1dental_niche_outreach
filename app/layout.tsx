import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AppToaster } from '@/components/app-toaster'

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

const auditServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Dental practice website audit',
  name: 'Dental Website Audit',
  description:
    "A 10-minute audit of a private dental clinic's website that pinpoints why it's costing patients and how to fix it.",
  provider: {
    '@type': 'Organization',
    name: 'Carter Dental Studio',
    url: 'https://carterdentalstudio.co.uk',
  },
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom',
  },
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Private dental clinics',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: '0',
    availability: 'https://schema.org/InStock',
  },
} as const

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://carterdentalstudio.co.uk'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Carter Dental Studio | Dental Website Audits for UK Private Clinics',
  description:
    'Free website audit for your dental clinic — see why your site is costing you patients and what to fix. Conversion-led sites for UK private practices.',
  keywords: [
    'dental website audit',
    'dentist website redesign',
    'dental marketing audit',
    'website speed audit',
    'dental SEO audit',
  ],
  openGraph: {
    title: 'Free Website Audit for Dental Clinics | Carter Dental',
    description:
      'Request a free audit of your clinic website — conversion, booking flow, and mobile UX for UK private practices.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Audit for Dental Clinics | Carter Dental',
    description:
      'Request a free audit of your clinic website — conversion, booking flow, and mobile UX for UK private practices.',
  },
  authors: [{ name: 'Standout Group' }],
  icons: {
    icon: [
      {
        url: '/logo-mark.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
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
    <html lang="en-GB" className={`${manrope.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(auditServiceJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-4 focus:left-4 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <div className="film-grain" aria-hidden="true" />
        {children}
        <AppToaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
