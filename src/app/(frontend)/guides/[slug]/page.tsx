import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from '@/lib/payload'
import { Crumbs } from '@/components/Crumbs'
import { ArticleCard } from '@/components/ArticleCard'
import { SectionHead } from '@/components/primitives/SectionHead'
import { ArticleToc } from '@/components/ArticleToc'
import { AuthorByline } from '@/components/AuthorByline'
import { JsonLd, articleSchema, breadcrumbSchema } from '@/lib/schema'
import { ogImageUrl } from '@/lib/og'
import { extractToc, readingTimeMin } from '@/lib/lexical'
import { articleConverters } from '@/lib/lexical-converters'
import type { User } from '@/payload-types'

export const revalidate = 600

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const a = docs[0]
  if (!a) return { title: 'Article not found' }
  const title = a.seo?.title ?? a.title
  const description = a.seo?.description ?? a.excerpt ?? undefined
  const og = ogImageUrl({
    title: a.title,
    subtitle: a.excerpt ?? undefined,
    kind: 'guide',
    eyebrow: a.category ?? 'Guide',
  })
  return {
    title,
    description,
    openGraph: { title, description, images: [og], type: 'article' },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  }
}

const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const a = docs[0]
  if (!a) notFound()

  const related = await payload.find({
    collection: 'articles',
    where: { id: { not_equals: a.id } },
    limit: 3,
    sort: '-datePublished',
  })

  const crumbs = [
    { label: 'Mybooz', href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: a.category ?? '' },
    { label: a.title.length > 40 ? a.title.slice(0, 40) + '…' : a.title },
  ]

  const toc = extractToc(a.body)
  const computedReadMin = readingTimeMin(a.body)
  const readMin = computedReadMin > 0 ? computedReadMin : a.readMin ?? 5
  const author = typeof a.author === 'object' ? (a.author as User | null) : null

  return (
    <main>
      <JsonLd data={articleSchema(a)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div
          className="container"
          style={{ padding: '24px 32px 0', maxWidth: 880 }}
        >
          <Crumbs items={crumbs} />
        </div>
      </section>

      <article
        className="container"
        style={{ padding: '40px 32px', maxWidth: 880 }}
      >
        <span className="eyebrow">
          {a.category} · {readMin} min read · {formatDate(a.datePublished)}
        </span>
        <h1
          className="display"
          style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            margin: '20px 0 20px',
            lineHeight: 1.1,
          }}
        >
          {a.title}
        </h1>
        <p
          style={{
            fontSize: 19,
            color: 'var(--fg-2)',
            lineHeight: 1.55,
            margin: '0 0 24px',
            maxWidth: '60ch',
          }}
        >
          {a.excerpt}
        </p>

        <AuthorByline author={author} date={a.datePublished} />

        <div
          className="ph ph-wide"
          data-label={`HERO — ${a.category?.toUpperCase()}`}
          style={{ aspectRatio: '16/9', borderRadius: 14, margin: '32px 0' }}
        />

        <ArticleToc items={toc} />

        <div
          className="article-body"
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 19,
            lineHeight: 1.7,
            color: 'var(--fg)',
            maxWidth: '65ch',
          }}
        >
          {a.body ? (
            <RichText data={a.body} converters={articleConverters} />
          ) : (
            <p>This article is being prepared. Check back soon.</p>
          )}
        </div>

        <div
          className="card card-pad"
          style={{
            margin: '40px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="eyebrow">Find a store</span>
            <p
              className="serif"
              style={{ fontSize: 22, margin: '8px 0 0', fontWeight: 500 }}
            >
              Ready to pour? Search verified shops near you.
            </p>
          </div>
          <Link href="/stores" className="btn primary">
            Browse stores →
          </Link>
        </div>
      </article>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Keep reading" title="Related guides" />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              marginTop: 32,
            }}
          >
            {related.docs.map((x) => (
              <ArticleCard key={x.id} article={x} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
