import './globals.css'
import { Fraunces, JetBrains_Mono } from 'next/font/google'
import { getPayload } from '@/lib/payload'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { AgeGate } from '@/components/AgeGate'
import { JsonLd, websiteSchema } from '@/lib/schema'
import { PostHogProvider } from '@/components/Telemetry/PostHogProvider'
import { WebVitals } from '@/components/Telemetry/WebVitals'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Mybooz — Discover trusted liquor stores & spirits near you',
    template: '%s · Mybooz',
  },
  description:
    "Mybooz is India's curated directory for liquor stores, wine shops and premium spirits. Search by city, brand, budget. Reviews, guides, food pairings & expert notes.",
  openGraph: {
    type: 'website',
    siteName: 'Mybooz',
    locale: 'en_IN',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload()

  const [header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'header' }).catch(() => null),
    payload.findGlobal({ slug: 'footer' }).catch(() => null),
  ])

  const navItems =
    header?.items && header.items.length > 0
      ? header.items
      : [
          { key: 'home', label: 'Discover', href: '/' },
          { key: 'stores', label: 'Stores', href: '/stores' },
          { key: 'spirits', label: 'Spirits', href: '/spirits' },
          { key: 'guides', label: 'Guides', href: '/guides' },
          { key: 'claim', label: 'For Owners', href: '/owners' },
        ]

  const footerColumns = footer?.columns ?? []

  return (
    <html lang="en" className={`${fraunces.variable} ${mono.variable}`}>
      <body>
        <PostHogProvider>
          <WebVitals />
          <JsonLd data={websiteSchema()} />
          <AgeGate />
          <TopBar items={navItems as { key: string; label: string; href: string }[]} />
          {children}
          <Footer columns={footerColumns as { heading: string; links: { label: string; href: string }[] }[]} />
        </PostHogProvider>
      </body>
    </html>
  )
}
