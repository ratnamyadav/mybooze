import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/stores`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/spirits`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/guides`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE}/owners`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/cancellation`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const payload = await getPayload()
    const [stores, bottles, categories, articles] = await Promise.all([
      payload.find({ collection: 'stores', limit: 1000, depth: 0 }),
      payload.find({ collection: 'bottles', limit: 1000, depth: 0 }),
      payload.find({ collection: 'categories', limit: 100, depth: 0 }),
      payload.find({ collection: 'articles', limit: 1000, depth: 0 }),
    ])

    const dyn = [
      ...stores.docs.map((d) => ({ url: `${SITE}/stores/${d.slug}`, lastModified: d.updatedAt })),
      ...bottles.docs.map((d) => ({ url: `${SITE}/bottles/${d.slug}`, lastModified: d.updatedAt })),
      ...categories.docs.map((d) => ({
        url: `${SITE}/spirits/${d.slug}`,
        lastModified: d.updatedAt,
      })),
      ...articles.docs.map((d) => ({ url: `${SITE}/guides/${d.slug}`, lastModified: d.updatedAt })),
    ]

    return [...staticRoutes, ...dyn]
  } catch {
    return staticRoutes
  }
}
