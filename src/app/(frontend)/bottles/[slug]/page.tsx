import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Crumbs } from '@/components/Crumbs'
import { Stars } from '@/components/Stars'
import { BottleCard } from '@/components/BottleCard'
import { Spec } from '@/components/primitives/Spec'
import { SectionHead } from '@/components/primitives/SectionHead'
import { JsonLd, breadcrumbSchema, productSchema } from '@/lib/schema'
import { ogImageUrl } from '@/lib/og'

export const revalidate = 600

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'bottles',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const b = docs[0]
  if (!b) return { title: 'Bottle not found' }
  const title = `${b.name} — price, tasting notes, where to buy`
  const description = `${b.brand} ${b.name}. ABV ${b.abv ?? '—'}%. Price range and stockists across Delhi NCR.`
  const priceTag =
    b.priceLow && b.priceHigh ? `₹${b.priceLow.toLocaleString('en-IN')}–₹${b.priceHigh.toLocaleString('en-IN')}` : ''
  const og = ogImageUrl({
    title: b.name,
    subtitle: [b.brand, b.region, priceTag].filter(Boolean).join(' · '),
    kind: 'bottle',
    eyebrow: 'Bottle',
  })
  return {
    title,
    description,
    openGraph: { title, description, images: [og] },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  }
}

export default async function BottlePage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'bottles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const b = docs[0]
  if (!b) notFound()

  const stocking = (b.availableAt ?? []).filter((s) => typeof s === 'object') as never[]
  const similar = await payload.find({
    collection: 'bottles',
    where: { id: { not_equals: b.id } },
    limit: 4,
    sort: '-rating',
  })

  const catName =
    typeof b.category === 'object' && b.category && 'name' in b.category ? b.category.name : ''
  const catSlug =
    typeof b.category === 'object' && b.category && 'slug' in b.category ? b.category.slug : ''

  const crumbs = [
    { label: 'Mybooz', href: '/' },
    { label: 'Spirits', href: '/spirits' },
    ...(catSlug ? [{ label: catName ?? '', href: `/spirits/${catSlug}` }] : []),
    { label: b.name },
  ]

  return (
    <main>
      <JsonLd data={productSchema(b)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div className="container" style={{ padding: '24px 32px 0' }}>
          <Crumbs items={crumbs} />
        </div>
      </section>

      <section className="container" style={{ padding: '40px 32px 0' }}>
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr 1.3fr', gap: 56 }}
        >
          <div
            className="ph"
            data-label={`BOTTLE — ${b.name?.toUpperCase()}`}
            style={{
              aspectRatio: '3/4',
              borderRadius: 14,
              position: 'sticky',
              top: 96,
              alignSelf: 'flex-start',
            }}
          />

          <div>
            <span className="eyebrow">
              {catName} · {b.region}
            </span>
            <h1
              className="display"
              style={{ fontSize: 60, margin: '14px 0 12px', lineHeight: 1.05 }}
            >
              {b.name}
            </h1>
            <p style={{ fontSize: 17, color: 'var(--fg-2)', margin: '0 0 20px' }}>
              By {b.brand}
            </p>
            <div className="row gap-3" style={{ marginBottom: 24 }}>
              <Stars value={b.rating ?? 0} size={15} />
              <span style={{ fontSize: 14 }}>{(b.rating ?? 0).toFixed(1)} editor rating</span>
            </div>

            {b.priceLow != null && (
              <div className="card card-pad" style={{ marginBottom: 32 }}>
                <div
                  className="row"
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 8,
                  }}
                >
                  <span className="mono dim" style={{ fontSize: 10 }}>
                    TYPICAL PRICE RANGE · DELHI NCR
                  </span>
                  <span className="mono dim" style={{ fontSize: 10 }}>
                    UPDATED WEEKLY
                  </span>
                </div>
                <div className="display" style={{ fontSize: 40, color: 'var(--accent)' }}>
                  ₹{b.priceLow.toLocaleString('en-IN')}
                  {b.priceHigh != null && ` – ₹${b.priceHigh.toLocaleString('en-IN')}`}
                </div>
                <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>
                  Final price set by the retailer. Mybooz does not sell this bottle.
                </p>
              </div>
            )}

            {Array.isArray(b.tastingNotes) && b.tastingNotes.length > 0 && (
              <>
                <h3
                  className="serif"
                  style={{ fontSize: 22, fontWeight: 500, margin: '0 0 12px' }}
                >
                  Tasting notes
                </h3>
                <div className="row gap-2" style={{ flexWrap: 'wrap', marginBottom: 28 }}>
                  {b.tastingNotes.map((n, i) => (
                    <span
                      key={i}
                      className="chip"
                      style={{
                        cursor: 'default',
                        borderColor: 'color-mix(in oklab, var(--accent) 30%, var(--line))',
                        color: 'var(--accent)',
                      }}
                    >
                      {n.note}
                    </span>
                  ))}
                </div>
              </>
            )}

            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 32,
                padding: '20px 0',
                borderTop: '1px solid var(--line-soft)',
                borderBottom: '1px solid var(--line-soft)',
              }}
            >
              {b.abv != null && <Spec label="ABV" value={`${b.abv}%`} />}
              {b.volume && <Spec label="Volume" value={b.volume} />}
              {b.best && <Spec label="Best for" value={b.best} />}
              {b.region && <Spec label="Region" value={b.region} />}
              <Spec label="Brand" value={b.brand} />
              {b.occasion && <Spec label="Occasion" value={b.occasion} />}
            </div>

            <h3
              className="serif"
              style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}
            >
              Available at
            </h3>
            <div className="stack" style={{ '--stack': '8px' } as React.CSSProperties}>
              {(stocking as { id: string; slug: string; name: string; area: string; city: string; openNow: boolean; distanceKm?: number }[]).map(
                (s) => (
                  <Link
                    key={s.id}
                    href={`/stores/${s.slug}`}
                    className="card card-pad row"
                    style={{
                      padding: 16,
                      cursor: 'pointer',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 15 }}>{s.name}</strong>
                      <p
                        className="muted"
                        style={{ fontSize: 12, margin: '2px 0 0' }}
                      >
                        {s.area}, {s.city}
                        {s.distanceKm != null && ` · ${s.distanceKm.toFixed(1)} km`}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`badge ${s.openNow ? 'open' : 'closed'}`}
                      >
                        {s.openNow ? 'Open' : 'Closed'}
                      </span>
                      <p
                        className="mono"
                        style={{ fontSize: 11, margin: '6px 0 0', color: 'var(--accent)' }}
                      >
                        View store →
                      </p>
                    </div>
                  </Link>
                ),
              )}
              {stocking.length === 0 && (
                <p className="muted">No stocking stores listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Goes well with" title="Food & cocktail pairings" />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginTop: 32,
            }}
          >
            {[
              { t: 'Dark chocolate', d: '70% cacao or higher. Bitterness cuts the sweetness.' },
              { t: 'Smoked almonds', d: 'Salt and char echo the oak notes.' },
              { t: 'Aged cheddar', d: 'Sharp, crumbly, ideally 18+ months.' },
              { t: 'Cigar (mild)', d: 'A Connecticut-wrapped torpedo, lit slow.' },
            ].map((p, i) => (
              <div key={i} className="card card-pad">
                <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
                  PAIRING
                </span>
                <h4
                  className="serif"
                  style={{ fontSize: 18, margin: '6px 0 6px', fontWeight: 500 }}
                >
                  {p.t}
                </h4>
                <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow="If you liked this" title="Similar bottles" />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              marginTop: 32,
            }}
          >
            {similar.docs.map((x) => (
              <BottleCard key={x.id} bottle={x} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
