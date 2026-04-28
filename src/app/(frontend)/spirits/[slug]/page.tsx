import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Crumbs } from '@/components/Crumbs'
import { BottleCard } from '@/components/BottleCard'
import { ArticleCard } from '@/components/ArticleCard'
import { StoreCard } from '@/components/StoreCard'
import { FAQ } from '@/components/FAQ'
import { CategoryTile } from '@/components/CategoryTile'
import { SectionHead } from '@/components/primitives/SectionHead'
import {
  JsonLd,
  breadcrumbSchema,
  categorySchema,
  faqSchema,
} from '@/lib/schema'

export const revalidate = 600

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const cat = docs[0]
  if (!cat) return { title: 'Category not found' }
  return {
    title: `${cat.name} — Buying guide & where to buy in Delhi NCR`,
    description: cat.blurb ?? `Browse ${cat.name} bottles available across Delhi NCR.`,
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()

  const { docs: catDocs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const cat = catDocs[0]
  if (!cat) notFound()

  const [bottles, articles, stores, faqs, otherCats] = await Promise.all([
    payload.find({
      collection: 'bottles',
      where: { category: { equals: cat.id } },
      limit: 8,
      sort: '-rating',
      depth: 1,
    }),
    payload.find({
      collection: 'articles',
      limit: 3,
      sort: '-datePublished',
    }),
    payload.find({ collection: 'stores', limit: 3, sort: '-rating' }),
    payload.find({
      collection: 'faqs',
      where: { and: [{ scope: { equals: 'category' } }, { category: { equals: cat.id } }] },
      sort: 'order',
    }),
    payload.find({
      collection: 'categories',
      where: { id: { not_equals: cat.id } },
      limit: 8,
      sort: 'name',
    }),
  ])

  const crumbs = [
    { label: 'Mybooz', href: '/' },
    { label: 'Spirits', href: '/spirits' },
    { label: cat.name },
  ]

  return (
    <main>
      <JsonLd data={categorySchema(cat)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {faqs.docs.length > 0 && <JsonLd data={faqSchema(faqs.docs)} />}

      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div className="container" style={{ padding: '24px 32px 56px' }}>
          <Crumbs items={crumbs} />
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1.4fr 1fr',
              gap: 56,
              marginTop: 24,
              alignItems: 'flex-end',
            }}
          >
            <div>
              <span className="eyebrow">
                {cat.count ?? 0} bottles · {stores.totalDocs}+ stocking stores
              </span>
              <h1
                className="display"
                style={{
                  fontSize: 'clamp(64px, 9vw, 128px)',
                  margin: '14px 0 16px',
                  lineHeight: 0.95,
                }}
              >
                {cat.name}
                <span style={{ color: 'var(--accent)' }}>.</span>
              </h1>
              {cat.blurb && (
                <p
                  style={{
                    fontSize: 18,
                    color: 'var(--fg-2)',
                    maxWidth: '52ch',
                    lineHeight: 1.55,
                  }}
                >
                  {cat.blurb}
                </p>
              )}
            </div>
            <div
              className="ph"
              data-label={`${cat.name?.toUpperCase()} — EDITORIAL`}
              style={{ aspectRatio: '4/3', borderRadius: 10 }}
            />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <h2
            className="serif"
            style={{ fontSize: 28, fontWeight: 500, marginBottom: 24 }}
          >
            Popular {cat.name?.toLowerCase()} bottles
          </h2>
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}
          >
            {bottles.docs.map((b) => (
              <BottleCard key={b.id} bottle={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Shop by budget" title="What ₹X actually buys you" />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginTop: 32,
            }}
          >
            {[
              {
                tag: 'Under ₹2,000',
                desc: 'Honest blends and entry-level malts. Good for everyday pours and cocktails.',
              },
              {
                tag: '₹2,000–₹5,000',
                desc: 'Sweet spot. Most well-known single malts and Indian premium whiskies live here.',
              },
              {
                tag: '₹5,000–₹10,000',
                desc: 'Aged 12–15 years, distinct regional character. Worth pouring neat.',
              },
              {
                tag: '₹10,000+',
                desc: 'Collector territory. Old Islays, single casks, limited editions.',
              },
            ].map((b, i) => (
              <div key={i} className="card card-pad">
                <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
                  {b.tag}
                </span>
                <p
                  style={{
                    fontSize: 14,
                    margin: '8px 0 0',
                    color: 'var(--fg-2)',
                    lineHeight: 1.5,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead
            eyebrow="Read first"
            title={`${cat.name} guides`}
            link="All guides"
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

      <section className="section-tight">
        <div className="container">
          <SectionHead
            eyebrow="Where to buy"
            title={`Stores stocking ${cat.name?.toLowerCase()}`}
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

      {faqs.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div
              className="grid"
              style={{ gridTemplateColumns: '1fr 1.6fr', gap: 56 }}
            >
              <div>
                <span className="eyebrow">FAQ</span>
                <h2 className="display" style={{ fontSize: 40, margin: '14px 0 0' }}>
                  {cat.name}, explained.
                </h2>
              </div>
              <FAQ items={faqs.docs.map((f) => ({ question: f.question, answer: f.answer }))} />
            </div>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container">
          <h3
            className="serif"
            style={{ fontSize: 24, fontWeight: 500, marginBottom: 20 }}
          >
            Related categories
          </h3>
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
          >
            {otherCats.docs.map((c) => (
              <CategoryTile key={c.id} cat={c} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
