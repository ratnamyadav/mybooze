import { getPayload } from '@/lib/payload'
import { SearchBox } from '@/components/SearchBox'
import { CategoryTile } from '@/components/CategoryTile'
import { StoreCard } from '@/components/StoreCard'
import { BottleCard } from '@/components/BottleCard'
import { ArticleCard } from '@/components/ArticleCard'
import { FAQ } from '@/components/FAQ'
import { SectionHead } from '@/components/primitives/SectionHead'
import { Stat } from '@/components/primitives/Stat'
import { JsonLd, faqSchema } from '@/lib/schema'
import Link from 'next/link'

export const revalidate = 300

export default async function HomePage() {
  const payload = await getPayload()

  const [categories, stores, bottles, articles, faqs, page] = await Promise.all([
    payload.find({ collection: 'categories', limit: 8, sort: '-count' }),
    payload.find({ collection: 'stores', limit: 3, sort: '-rating' }),
    payload.find({ collection: 'bottles', limit: 4, sort: '-rating' }),
    payload.find({ collection: 'articles', limit: 3, sort: '-datePublished' }),
    payload.find({
      collection: 'faqs',
      where: { scope: { equals: 'home' } },
      sort: 'order',
    }),
    payload
      .find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
      .then((r) => r.docs[0] ?? null),
  ])

  const heroEyebrow = page?.hero?.eyebrow ?? 'Vol. 04 · Issue 02 · Apr 2026'
  const heroHeading =
    page?.hero?.heading ?? 'Discover trusted liquor stores & spirits near you.'
  const heroSub =
    page?.hero?.subheading ??
    "A curated directory of verified retailers across Delhi NCR — with reviews, food pairings, expert tasting notes and beginner guides. We don't sell. We help you find."
  const stats = page?.stats?.length
    ? page.stats
    : [
        { label: 'Verified stores', value: '2,100+' },
        { label: 'Cities covered', value: '14' },
        { label: 'Spirit categories', value: '12' },
        { label: 'Tasting notes', value: '3,800+' },
      ]
  const variant = page?.hero?.variant ?? 'editorial'

  return (
    <main>
      {variant === 'editorial' ? (
        <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
          <div className="container" style={{ padding: '64px 32px 48px' }}>
            <div className="row gap-3" style={{ marginBottom: 32 }}>
              <span className="eyebrow">{heroEyebrow}</span>
              <span className="mono dim">·</span>
              <span className="mono dim" style={{ fontSize: 11 }}>
                Greater Noida edition
              </span>
            </div>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(56px, 8vw, 116px)',
                margin: '0 0 24px',
                maxWidth: '14ch',
              }}
            >
              {heroHeading}
            </h1>
            <p
              className="muted"
              style={{
                fontSize: 19,
                maxWidth: '52ch',
                margin: '0 0 36px',
                lineHeight: 1.5,
              }}
            >
              {heroSub}
            </p>
            <div style={{ maxWidth: 820 }}>
              <SearchBox />
            </div>
            <div className="row gap-4" style={{ marginTop: 20, flexWrap: 'wrap' }}>
              <span className="mono dim" style={{ fontSize: 11 }}>
                Popular:
              </span>
              {['Whisky', 'Single malt', 'Indian craft gin', 'Wine shops near me', 'Open now'].map(
                (p) => (
                  <Link key={p} href="/stores" className="chip">
                    {p}
                  </Link>
                ),
              )}
            </div>
            <div className="row gap-8" style={{ marginTop: 56, flexWrap: 'wrap' }}>
              {stats.map((s, i) => (
                <Stat key={i} label={s.label ?? ''} value={s.value ?? ''} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section
          style={{
            position: 'relative',
            padding: '120px 0 80px',
            background:
              'linear-gradient(180deg, color-mix(in oklab, var(--accent) 8%, var(--bg)) 0%, var(--bg) 100%)',
          }}
        >
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="eyebrow">India&apos;s spirits directory</span>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(48px, 7vw, 96px)',
                margin: '20px auto 24px',
                maxWidth: '16ch',
              }}
            >
              {heroHeading}
            </h1>
            <p className="muted" style={{ fontSize: 18, maxWidth: '52ch', margin: '0 auto 36px' }}>
              {heroSub}
            </p>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <SearchBox />
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Browse by category"
            title="Twelve doors to the cabinet"
            link="See all categories"
            href="/spirits"
          />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginTop: 32,
            }}
          >
            {categories.docs.map((c) => (
              <CategoryTile key={c.id} cat={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead
            eyebrow="Top-rated this week"
            title="Stores worth the drive"
            link="See all stores"
            href="/stores"
          />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              marginTop: 32,
            }}
          >
            {stores.docs.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </div>
      </section>

      {articles.docs[0] && (
        <section className="section">
          <div className="container">
            <div
              className="grid"
              style={{
                gridTemplateColumns: '1.1fr 1fr',
                gap: 48,
                alignItems: 'center',
              }}
            >
              <div
                className="ph"
                data-label="EDITORIAL FEATURE — POURING WHISKY"
                style={{ aspectRatio: '4/5', borderRadius: 14 }}
              ></div>
              <div>
                <span className="eyebrow">This month&apos;s read</span>
                <h2 className="display" style={{ fontSize: 56, margin: '16px 0 20px' }}>
                  {articles.docs[0].title}
                </h2>
                <p className="muted" style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                  {articles.docs[0].excerpt}
                </p>
                <Link href={`/guides/${articles.docs[0].slug}`} className="btn lg">
                  Read the guide →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container">
          <SectionHead
            eyebrow="Popular this week"
            title="Bottles your neighbours are buying"
            link="Browse all spirits"
            href="/spirits"
          />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              marginTop: 32,
            }}
          >
            {bottles.docs.map((b) => (
              <BottleCard key={b.id} bottle={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="From the guides"
            title="Read before you pour"
            link="Visit guides hub"
            href="/guides"
          />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              marginTop: 32,
            }}
          >
            {articles.docs.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {faqs.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div
              className="grid"
              style={{ gridTemplateColumns: '1fr 1.6fr', gap: 56 }}
            >
              <div>
                <span className="eyebrow">Frequently asked</span>
                <h2 className="display" style={{ fontSize: 44, margin: '16px 0 12px' }}>
                  Questions, answered.
                </h2>
                <p className="muted" style={{ fontSize: 14 }}>
                  Mybooz operates within Indian state-by-state alcohol regulations. Here&apos;s how
                  that affects what you can do here.
                </p>
              </div>
              <FAQ items={faqs.docs.map((f) => ({ question: f.question, answer: f.answer }))} />
            </div>
          </div>
          <JsonLd data={faqSchema(faqs.docs)} />
        </section>
      )}

      <section
        style={{
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--line-soft)',
          borderBottom: '1px solid var(--line-soft)',
        }}
      >
        <div
          className="container row"
          style={{
            justifyContent: 'space-between',
            padding: '40px 32px',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <span className="eyebrow">Own a liquor store?</span>
            <h3 className="serif" style={{ fontSize: 28, margin: '8px 0 0', fontWeight: 500 }}>
              Reach 50,000 monthly searchers in Delhi NCR.
            </h3>
          </div>
          <div className="row gap-3">
            <Link href="/owners" className="btn">
              Learn more
            </Link>
            <Link href="/owners" className="btn primary">
              Claim your listing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
