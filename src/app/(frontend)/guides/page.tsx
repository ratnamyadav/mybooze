import { getPayload } from '@/lib/payload'
import { Crumbs } from '@/components/Crumbs'
import { ArticleCard } from '@/components/ArticleCard'
import { JsonLd, breadcrumbSchema } from '@/lib/schema'
import Link from 'next/link'

export const revalidate = 600

export const metadata = {
  title: 'Honest guides for curious drinkers',
  description:
    'Buying guides, beginner explainers, and city-by-city store rundowns. Written by people who actually drink the stuff.',
}

type SearchParams = Promise<{ category?: string }>

export default async function GuidesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const payload = await getPayload()

  const filter = sp.category && sp.category !== 'All' ? sp.category : null

  const { docs } = await payload.find({
    collection: 'articles',
    where: filter ? { category: { equals: filter } } : {},
    limit: 24,
    sort: '-datePublished',
  })

  const featured = docs[0]
  const list = docs.slice(1, 5)
  const grid = docs.slice(5)

  const cats = ['All', 'Buying Guides', 'Education', 'City Guides']
  const crumbs = [{ label: 'Mybooz', href: '/' }, { label: 'Guides' }]

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div className="container" style={{ padding: '24px 32px 56px' }}>
          <Crumbs items={crumbs} />
          <span
            className="eyebrow"
            style={{ marginTop: 24, display: 'inline-block' }}
          >
            The Mybooz Library
          </span>
          <h1
            className="display"
            style={{
              fontSize: 'clamp(56px, 8vw, 104px)',
              margin: '12px 0 20px',
              maxWidth: '14ch',
            }}
          >
            Honest guides for curious drinkers.
          </h1>
          <p
            className="muted"
            style={{ fontSize: 18, maxWidth: '54ch', lineHeight: 1.55 }}
          >
            Buying guides, beginner explainers, city-by-city store rundowns. Written by people who
            actually drink the stuff, edited by people who don&apos;t take freebies.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          {featured && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: '5fr 7fr',
                gap: 32,
                marginBottom: 48,
              }}
            >
              <Link href={`/guides/${featured.slug}`} className="card" style={{ color: 'inherit' }}>
                <div
                  className="ph ph-wide"
                  data-label={`HERO — ${featured.category?.toUpperCase()}`}
                  style={{
                    borderRadius: 0,
                    borderTop: 0,
                    borderLeft: 0,
                    borderRight: 0,
                    aspectRatio: '5/4',
                  }}
                />
                <div className="card-pad">
                  <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
                    EDITOR&apos;S PICK · {featured.readMin} MIN
                  </span>
                  <h2
                    className="serif"
                    style={{
                      fontSize: 32,
                      margin: '12px 0 12px',
                      fontWeight: 500,
                      lineHeight: 1.15,
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p className="muted" style={{ fontSize: 14 }}>
                    {featured.excerpt}
                  </p>
                </div>
              </Link>
              <div className="stack" style={{ '--stack': '0' } as React.CSSProperties}>
                {list.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="list" />
                ))}
              </div>
            </div>
          )}

          <div className="row gap-2" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
            {cats.map((c) => (
              <Link
                key={c}
                href={c === 'All' ? '/guides' : `/guides?category=${encodeURIComponent(c)}`}
                className={`chip ${(filter ?? 'All') === c ? 'active' : ''}`}
              >
                {c}
              </Link>
            ))}
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          >
            {grid.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
