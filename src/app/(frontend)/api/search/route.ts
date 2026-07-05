import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from '@/lib/payload'
import { captureServer } from '@/lib/posthog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Hit = {
  id: number
  kind: 'store' | 'bottle' | 'guide' | 'category'
  title: string
  subtitle?: string
  href: string
}

const LIMIT_PER_KIND = 5

// Minimal structural type for the postgres adapter's pg Pool (pg is a transitive
// dep, not directly importable under `bundler` module resolution).
type PgPool = {
  query: <T>(text: string, params: unknown[]) => Promise<{ rows: T[] }>
}

type StoreRow = { id: number; name: string; area: string; city: string; slug: string }
type BottleRow = { id: number; name: string; brand: string; region: string | null; slug: string }
type ArticleRow = { id: number; title: string; category: string | null; slug: string }
type CategoryRow = { id: number; name: string; blurb: string | null; slug: string }

/**
 * Build a safe `to_tsquery` lexeme string for prefix-autocomplete.
 * Strips every tsquery operator/punctuation char BEFORE assembling, so raw user
 * input can never inject tsquery syntax (and the value is still passed as a bound
 * parameter). "macal" -> "macal:*", "glen scot" -> "glen:* & scot:*".
 * Returns null when the query has no usable lexemes (e.g. all punctuation).
 */
function toPrefixTsQuery(raw: string): string | null {
  const terms = raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `${t}:*`)
  return terms.length ? terms.join(' & ') : null
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim()
  if (q.length < 2) {
    return NextResponse.json({ q, hits: [] satisfies Hit[] })
  }

  const payload = await getPayload()
  const pool = (payload.db as unknown as { pool: PgPool }).pool

  const tsq = toPrefixTsQuery(q) // may be null; the ILIKE fallback still applies
  const like = `%${q}%`
  // Param order per query: $1 tsq, $2 like, $3 raw q (for similarity()), $4 limit

  const [stores, bottles, articles, categories] = await Promise.all([
    pool.query<StoreRow>(
      `SELECT id, name, area, city, slug,
              COALESCE(ts_rank(search_vector, to_tsquery('simple', $1)), 0) AS rank,
              GREATEST(
                similarity(name, $3),
                similarity(COALESCE(area, ''), $3),
                similarity(COALESCE(city, ''), $3),
                similarity(COALESCE(tagline, ''), $3)
              ) AS sim
         FROM stores
        WHERE _status = 'published'
          AND ( search_vector @@ to_tsquery('simple', $1)
                OR name ILIKE $2 OR area ILIKE $2 OR city ILIKE $2 OR tagline ILIKE $2 )
        ORDER BY (rank > 0) DESC, rank DESC, sim DESC, rating DESC NULLS LAST
        LIMIT $4`,
      [tsq, like, q, LIMIT_PER_KIND],
    ),
    pool.query<BottleRow>(
      `SELECT id, name, brand, region, slug,
              COALESCE(ts_rank(search_vector, to_tsquery('simple', $1)), 0) AS rank,
              GREATEST(
                similarity(name, $3),
                similarity(COALESCE(brand, ''), $3),
                similarity(COALESCE(region, ''), $3)
              ) AS sim
         FROM bottles
        WHERE _status = 'published'
          AND ( search_vector @@ to_tsquery('simple', $1)
                OR name ILIKE $2 OR brand ILIKE $2 OR region ILIKE $2 )
        ORDER BY (rank > 0) DESC, rank DESC, sim DESC, rating DESC NULLS LAST
        LIMIT $4`,
      [tsq, like, q, LIMIT_PER_KIND],
    ),
    pool.query<ArticleRow>(
      `SELECT id, title, category, slug,
              COALESCE(ts_rank(search_vector, to_tsquery('simple', $1)), 0) AS rank,
              GREATEST(similarity(title, $3), similarity(COALESCE(excerpt, ''), $3)) AS sim
         FROM articles
        WHERE _status = 'published'
          AND ( search_vector @@ to_tsquery('simple', $1)
                OR title ILIKE $2 OR excerpt ILIKE $2 )
        ORDER BY (rank > 0) DESC, rank DESC, sim DESC, date_published DESC NULLS LAST
        LIMIT $4`,
      [tsq, like, q, LIMIT_PER_KIND],
    ),
    pool.query<CategoryRow>(
      `SELECT id, name, blurb, slug,
              COALESCE(ts_rank(search_vector, to_tsquery('simple', $1)), 0) AS rank,
              GREATEST(similarity(name, $3), similarity(COALESCE(blurb, ''), $3)) AS sim
         FROM categories
        WHERE _status = 'published'
          AND ( search_vector @@ to_tsquery('simple', $1)
                OR name ILIKE $2 OR blurb ILIKE $2 )
        ORDER BY (rank > 0) DESC, rank DESC, sim DESC
        LIMIT $4`,
      [tsq, like, q, 3],
    ),
  ])

  const hits: Hit[] = [
    ...stores.rows.map(
      (s): Hit => ({
        id: s.id,
        kind: 'store',
        title: s.name,
        subtitle: `${s.area} · ${s.city}`,
        href: `/stores/${s.slug}`,
      }),
    ),
    ...bottles.rows.map(
      (b): Hit => ({
        id: b.id,
        kind: 'bottle',
        title: b.name,
        subtitle: [b.brand, b.region].filter(Boolean).join(' · '),
        href: `/bottles/${b.slug}`,
      }),
    ),
    ...categories.rows.map(
      (c): Hit => ({
        id: c.id,
        kind: 'category',
        title: c.name,
        subtitle: c.blurb ?? 'Spirit category',
        href: `/spirits/${c.slug}`,
      }),
    ),
    ...articles.rows.map(
      (a): Hit => ({
        id: a.id,
        kind: 'guide',
        title: a.title,
        subtitle: a.category ?? 'Guide',
        href: `/guides/${a.slug}`,
      }),
    ),
  ]

  // Fire-and-forget — never block the response.
  captureServer('search', { q, hits: hits.length }).catch(() => {})

  return NextResponse.json({ q, hits })
}
