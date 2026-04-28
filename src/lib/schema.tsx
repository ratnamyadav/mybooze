import type { Article, Bottle, Category, Faq, Store } from '@/payload-types'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mybooz',
  url: SITE,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE}/stores?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const breadcrumbSchema = (items: { label: string; href?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.label,
    ...(it.href ? { item: `${SITE}${it.href}` } : {}),
  })),
})

export const localBusinessSchema = (store: Store) => ({
  '@context': 'https://schema.org',
  '@type': 'LiquorStore',
  name: store.name,
  url: `${SITE}/stores/${store.slug}`,
  telephone: store.phone ?? undefined,
  address: {
    '@type': 'PostalAddress',
    streetAddress: store.address,
    addressLocality: store.city,
    addressRegion: store.area,
    addressCountry: 'IN',
  },
  geo:
    store.lat && store.lng
      ? { '@type': 'GeoCoordinates', latitude: store.lat, longitude: store.lng }
      : undefined,
  aggregateRating:
    store.rating && store.reviewsCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: store.rating,
          reviewCount: store.reviewsCount,
        }
      : undefined,
})

export const productSchema = (bottle: Bottle) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: bottle.name,
  brand: { '@type': 'Brand', name: bottle.brand },
  category:
    typeof bottle.category === 'object' && bottle.category && 'name' in bottle.category
      ? bottle.category.name
      : undefined,
  offers:
    bottle.priceLow != null
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: bottle.priceLow,
          highPrice: bottle.priceHigh ?? bottle.priceLow,
        }
      : undefined,
  aggregateRating: bottle.rating
    ? { '@type': 'AggregateRating', ratingValue: bottle.rating, ratingCount: 1 }
    : undefined,
})

export const articleSchema = (a: Article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.excerpt,
  datePublished: a.datePublished,
  author: {
    '@type': 'Person',
    name:
      typeof a.author === 'object' && a.author && 'name' in a.author && a.author.name
        ? a.author.name
        : 'Mybooz Editors',
  },
})

export const faqSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
})

export const categorySchema = (c: Category) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: c.name,
  description: c.blurb,
  url: `${SITE}/spirits/${c.slug}`,
})

export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)
