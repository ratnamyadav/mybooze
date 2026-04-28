import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Crumbs } from '@/components/Crumbs'
import { Stars } from '@/components/Stars'
import { StoreCard } from '@/components/StoreCard'
import { BottleCard } from '@/components/BottleCard'
import { MapPlaceholder } from '@/components/MapPlaceholder'
import { Spec } from '@/components/primitives/Spec'
import { SectionHead } from '@/components/primitives/SectionHead'
import { StoreTabs } from './StoreTabs'
import { JsonLd, breadcrumbSchema, localBusinessSchema } from '@/lib/schema'

export const revalidate = 300

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'stores',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const store = docs[0]
  if (!store) return { title: 'Store not found' }
  return {
    title: `${store.name} — ${store.area}, ${store.city}`,
    description: store.tagline ?? `Verified liquor store in ${store.city}.`,
  }
}

export default async function StorePage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'stores',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const store = docs[0]
  if (!store) notFound()

  const [reviewsRes, bottlesRes, similarRes] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: { store: { equals: store.id } },
      limit: 10,
      sort: '-createdAt',
    }),
    payload.find({ collection: 'bottles', limit: 6, sort: '-rating' }),
    payload.find({
      collection: 'stores',
      where: { id: { not_equals: store.id } },
      limit: 3,
      sort: '-rating',
    }),
  ])

  const crumbs = [
    { label: 'Mybooz', href: '/' },
    { label: 'Stores', href: '/stores' },
    { label: store.city, href: '/stores' },
    { label: store.name },
  ]

  return (
    <main>
      <JsonLd data={localBusinessSchema(store)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div className="container" style={{ padding: '24px 32px 0' }}>
          <Crumbs items={crumbs} />
        </div>
      </section>

      <section className="container" style={{ padding: '32px 32px 0' }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            className="ph"
            data-label="STOREFRONT — INTERIOR"
            style={{ aspectRatio: '16/10', borderRadius: 10 }}
          />
          <div
            className="ph"
            data-label="INTERIOR — RACKS"
            style={{ aspectRatio: '4/5', borderRadius: 10 }}
          />
          <div
            className="grid"
            style={{ gridTemplateRows: '1fr 1fr', gap: 8 }}
          >
            <div className="ph" data-label="BOTTLE WALL" style={{ borderRadius: 10 }} />
            <div className="ph" data-label="STAFF" style={{ borderRadius: 10 }} />
          </div>
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr 360px', gap: 56 }}
        >
          <div>
            <div
              className="row gap-2"
              style={{ marginBottom: 12, flexWrap: 'wrap' }}
            >
              {store.verified && (
                <span className="badge verified">
                  ✓ Verified · License {store.license ?? 'L-1'}
                </span>
              )}
              <span className={`badge ${store.openNow ? 'open' : 'closed'}`}>
                {store.openNow ? 'Open now' : 'Closed'}
              </span>
              {store.priceTier && <span className="badge">{store.priceTier}</span>}
            </div>
            <h1 className="display" style={{ fontSize: 64, margin: '8px 0 12px' }}>
              {store.name}
            </h1>
            {store.tagline && (
              <p style={{ fontSize: 18, color: 'var(--fg-2)', margin: '0 0 16px' }}>
                {store.tagline}
              </p>
            )}
            <div className="row gap-3" style={{ marginBottom: 24 }}>
              <Stars value={store.rating ?? 0} size={16} />
              <span style={{ fontSize: 15 }}>{(store.rating ?? 0).toFixed(1)}</span>
              <span className="dim">·</span>
              <span className="muted" style={{ fontSize: 14 }}>
                {store.reviewsCount ?? 0} reviews
              </span>
            </div>

            <StoreTabs
              overview={
                <div className="stack" style={{ '--stack': '24px' } as React.CSSProperties}>
                  <div>
                    <h3
                      className="serif"
                      style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}
                    >
                      About this store
                    </h3>
                    <p
                      style={{
                        color: 'var(--fg-2)',
                        fontSize: 15,
                        lineHeight: 1.7,
                        maxWidth: '64ch',
                      }}
                    >
                      {store.name} serves the {store.area} community with curated spirits and
                      attentive service. Walk in with a budget and an occasion — you&apos;ll walk
                      out with the right bottle.
                    </p>
                  </div>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}
                  >
                    {Array.isArray(store.categories) && store.categories.length > 0 && (
                      <Spec
                        label="Categories"
                        value={store.categories
                          .map((c) =>
                            typeof c === 'object' && c && 'name' in c ? c.name : '',
                          )
                          .filter(Boolean)
                          .join(' · ')}
                      />
                    )}
                    {Array.isArray(store.payment) && store.payment.length > 0 && (
                      <Spec label="Payment" value={store.payment.join(' · ')} />
                    )}
                    <Spec
                      label="Pickup available"
                      value={store.pickup ? 'Yes — call ahead' : 'No'}
                    />
                    <Spec
                      label="Parking"
                      value={store.parking ? 'Yes — free' : 'Street only'}
                    />
                    {store.license && <Spec label="License" value={store.license} />}
                  </div>
                  <div className="rd-notice">
                    <span className="mono">⚠</span>
                    <span>
                      Mybooz does not facilitate purchases or delivery. Visit the store or call to
                      confirm availability and price.
                    </span>
                  </div>
                </div>
              }
              bottles={
                <>
                  <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
                    Top sellers reported by this store · refreshed weekly
                  </p>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
                  >
                    {bottlesRes.docs.map((b) => (
                      <BottleCard key={b.id} bottle={b} />
                    ))}
                  </div>
                </>
              }
              reviews={
                <>
                  <div
                    className="row"
                    style={{
                      justifyContent: 'space-between',
                      marginBottom: 24,
                      alignItems: 'flex-end',
                    }}
                  >
                    <div>
                      <div
                        className="display"
                        style={{ fontSize: 56, lineHeight: 1, color: 'var(--accent)' }}
                      >
                        {(store.rating ?? 0).toFixed(1)}
                      </div>
                      <Stars value={store.rating ?? 0} size={14} />
                      <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                        Based on {store.reviewsCount ?? 0} verified reviews
                      </p>
                    </div>
                    <button className="btn">Write a review</button>
                  </div>
                  <div className="stack" style={{ '--stack': '20px' } as React.CSSProperties}>
                    {reviewsRes.docs.map((r) => (
                      <div key={r.id} className="card card-pad">
                        <div
                          className="row"
                          style={{ justifyContent: 'space-between', marginBottom: 8 }}
                        >
                          <strong style={{ fontSize: 14 }}>{r.authorName}</strong>
                          {r.when && (
                            <span className="mono dim" style={{ fontSize: 10 }}>
                              {r.when}
                            </span>
                          )}
                        </div>
                        <Stars value={r.stars} size={12} />
                        <p
                          style={{
                            fontSize: 14,
                            color: 'var(--fg-2)',
                            margin: '10px 0 0',
                            lineHeight: 1.6,
                          }}
                        >
                          {r.text}
                        </p>
                      </div>
                    ))}
                    {reviewsRes.docs.length === 0 && (
                      <p className="muted">No reviews yet — be the first.</p>
                    )}
                  </div>
                </>
              }
              hours={
                <>
                  <h3
                    className="serif"
                    style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}
                  >
                    Opening hours
                  </h3>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      maxWidth: 480,
                    }}
                  >
                    <tbody>
                      {(store.hours ?? []).map((h, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: '1px solid var(--line-soft)',
                          }}
                        >
                          <td
                            style={{
                              padding: '10px 0',
                              fontSize: 14,
                              color: 'var(--fg)',
                            }}
                          >
                            {h.day}
                          </td>
                          <td
                            style={{
                              padding: '10px 0',
                              fontSize: 14,
                              color: 'var(--fg-2)',
                              textAlign: 'right',
                            }}
                          >
                            {h.open} – {h.close}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              }
              pairing={
                <>
                  <h3
                    className="serif"
                    style={{ fontSize: 22, fontWeight: 500, margin: '0 0 16px' }}
                  >
                    Food pairings & occasions
                  </h3>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}
                  >
                    {[
                      'Whisky + dark chocolate',
                      'Gin + grilled fish',
                      'Wine + paneer tikka',
                      'Rum + spiced desserts',
                    ].map((p, i) => (
                      <div key={i} className="card card-pad" style={{ padding: 16 }}>
                        <span
                          className="mono"
                          style={{ color: 'var(--accent)', fontSize: 10 }}
                        >
                          PAIRING #{i + 1}
                        </span>
                        <p
                          className="serif"
                          style={{ fontSize: 18, margin: '6px 0 0', fontWeight: 500 }}
                        >
                          {p}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              }
            />
          </div>

          <aside>
            <div
              className="card card-pad"
              style={{ position: 'sticky', top: 96 }}
            >
              <div className="stack" style={{ '--stack': '14px' } as React.CSSProperties}>
                <div>
                  <span className="mono dim" style={{ fontSize: 10 }}>
                    ADDRESS
                  </span>
                  <p style={{ fontSize: 14, margin: '4px 0 0', lineHeight: 1.5 }}>
                    {store.address}
                  </p>
                </div>
                {store.phone && (
                  <div>
                    <span className="mono dim" style={{ fontSize: 10 }}>
                      PHONE
                    </span>
                    <p style={{ fontSize: 14, margin: '4px 0 0' }}>{store.phone}</p>
                  </div>
                )}
              </div>
              <div
                className="stack"
                style={{ '--stack': '8px', marginTop: 20 } as React.CSSProperties}
              >
                {store.phone && (
                  <a href={`tel:${store.phone}`} className="btn primary block">
                    📞 Call store
                  </a>
                )}
                <button className="btn block">🧭 Get directions</button>
                <button className="btn block">💬 WhatsApp inquiry</button>
              </div>
              <div className="hr" style={{ margin: '20px 0' }} />
              <MapPlaceholder pins={[{ x: 50, y: 50, label: '₹' }]} height={180} />
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Similar stores" title="You might also like" />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              marginTop: 32,
            }}
          >
            {similarRes.docs.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
