import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SITE_URL } from '@/data/company'
import { bodyFont, displayFont, monoFont } from '@/lib/fonts'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { ThemeSync } from '@/components/ui/ThemeToggle'
import { THEME_COLORS, themeInitScript } from '@/lib/theme'
import './globals.css'

/**
 * The defaults every page starts from. Pages set their own title,
 * description, canonical and openGraph, and each carries an
 * `opengraph-image` file for its share image (a page's own `openGraph`
 * replaces this one, image and all). `metadataBase` is the www host, so every
 * canonical and og:url resolves to it.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Lee Enterprises Unlimited | AI Automation & Websites',
  description:
    'Lee Enterprises Unlimited builds websites that bring in customers and AI automations that answer every call, follow up and book the job.',
  authors: [{ name: 'Lee Enterprises Unlimited' }],
  creator: 'Lee Enterprises Unlimited',
  publisher: 'Lee Enterprises Unlimited',
  robots: 'index, follow',
  // No `url`: it would tell every page that inherits this its shares are the
  // homepage. A page that sets `openGraph` replaces this whole object.
  openGraph: {
    type: 'website',
    siteName: 'Lee Enterprises Unlimited',
    title: 'Lee Enterprises Unlimited',
    description:
      'Lee Enterprises Unlimited builds websites that bring in customers and AI automations that answer every call, follow up and book the job.',
  },
  // Every share image is 1200x630, so every page gets the large card.
  twitter: {
    card: 'summary_large_image',
  },
  // A 192px copy for the tab icon: the full logo used to be a 1.4 MB PNG and
  // every page fetched it just to draw a 16px favicon.
  icons: {
    icon: '/logos/leu-logo-192.png',
  },
}

export const viewport: Viewport = {
  // Dark by default. The theme switch moves both to light: CSS sets
  // `color-scheme` on <html>, and lib/theme.ts updates the theme-color meta.
  colorScheme: 'dark',
  themeColor: THEME_COLORS.dark,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // data-scroll-behavior lets Next switch html's `scroll-smooth` off for route
  // changes, so a new page starts at the top instead of scrolling up through
  // itself. In-page anchors stay smooth.
  //
  // data-theme is "dark" as served; the inline script in <head> switches it
  // to the visitor's saved choice before the first paint (lib/theme.ts), so
  // <html> carries suppressHydrationWarning for that one attribute.
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} bg-neutral-950`}
      data-scroll-behavior="smooth"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${bodyFont.className} antialiased bg-neutral-950 text-white`}
      >
        <ThemeSync />
        <SmoothScroll />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
