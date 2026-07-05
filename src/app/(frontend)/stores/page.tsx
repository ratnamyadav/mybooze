import { getPayload } from '@/lib/payload'
import { StoreCard } from '@/components/StoreCard'
import { Crumbs } from '@/components/Crumbs'
import { SearchBox } from '@/components/SearchBox'
import { StoreMap } from '@/components/Map'
import { NearMeButton } from '@/components/NearMeButton'
import { StoreFilters } from './StoreFilters'
import { JsonLd, breadcrumbSchema } from '@/lib/schema'
import { haversineKm, parseLatLng } from '@/lib/geo'
import type { Where } from 'payload'
import Link from 'next/link'

export const revalidate = 300

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const metadata = {
  title: 'Liquor stores in Greater Noida & Delhi NCR',
  description:
    'Browse verified liquor stores across Greater Noida, Noida, New Delhi and Gurugram. Filter by spirit, open now, verified license, and pickup.',
}

const sortMap: Record<string, string> = {
  Recommended: '-rating',
  'Highest rated': '-rating',
  'Most reviewed': '-reviewsCount',
  Distance: 'distanceKm',
  Newest: '-createdAt',
}

export default async function StoresPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const payload = await getPayload()

  const where: Where = { and: [] as Where[] }
  const and = where.and as Where[]

  const q = typeof sp.q === 'string' ? sp.q : null
  if (q) {
    and.push({
      or: [
        { name: { like: q } },
        { area: { like: q } },
        { city: { like: q } },
      ],
    })
  }
  if (sp.openNow === '1') and.push({ openNow: { equals: true } })
  if (sp.verified === '1') and.push({ verified: { equals: true } })
  if (sp.pickup === '1') and.push({ pickup: { equals: true } })
  if (sp.delivery === '1') and.push({ delivery: { equals: true } })
  if (typeof sp.price === 'string' && sp.price && sp.price !== 'Any') {
    and.push({ priceTier: { equals: sp.price } })
  }

  const sortKey = typeof sp.sort === 'string' ? sp.sort : 'Recommended'
  const sort = sortMap[sortKey] ?? '-rating'
  const near = parseLatLng(typeof sp.near === 'string' ? sp.near : null)
  const radiusKm = near ? Math.max(1, Math.min(50, Number(sp.radiusKm ?? 10))) : null

  if (near) {
    and.push({ lat: { exists: true } })
    and.push({ lng: { exists: true } })
  }

  const stores = await payload.find({
    collection: 'stores',
    where: and.length ? where : {},
    sort,
    limit: near ? 200 : 24,
    depth: 1,
  })

  let docs = stores.docs
  if (near) {
    docs = docs
      .filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number')
      .map((s) => ({
        ...s,
        distanceKm:
          typeof s.lat === 'number' && typeof s.lng === 'number'
            ? Number(haversineKm(near, { lat: s.lat, lng: s.lng }).toFixed(2))
            : null,
      }))
      .filter((s) => s.distanceKm !== null && s.distanceKm <= radiusKm!)
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
      .slice(0, 24)
  }

  const crumbs = [
    { label: 'Mybooz', href: '/' },
    { label: 'Stores', href: '/stores' },
    { label: 'Greater Noida' },
  ]

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section
        style={{
          borderBottom: '1px solid var(--line-soft)',
          background: 'var(--bg-2)',
        }}
      >
        <div className="container" style={{ padding: '24px 32px 28px' }}>
          <Crumbs items={crumbs} />
          <h1 className="display" style={{ fontSize: 52, margin: '14px 0 8px' }}>
            {near ? `Liquor stores within ${radiusKm} km` : 'Liquor stores in Greater Noida'}
          </h1>
          <p
            className="muted"
            style={{ fontSize: 15, margin: '0 0 20px', maxWidth: '60ch' }}
          >
            {near
              ? `${docs.length} retailers near your location, sorted by distance.`
              : `${stores.totalDocs} verified retailers — sorted by recommendation. All listings reviewed against state excise records before they appear here.`}
          </p>
          <div
            style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <SearchBox initialQuery={q ?? ''} compact />
            </div>
            <NearMeButton />
          </div>
        </div>
      </section>

      <section
        style={{
          borderBottom: '1px solid var(--line-soft)',
          position: 'sticky',
          top: 64,
          background: 'color-mix(in oklab, var(--bg) 92%, transparent)',
          backdropFilter: 'blur(8px)',
          zIndex: 20,
        }}
      >
        <div className="container" style={{ padding: '14px 32px' }}>
          <StoreFilters />
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1fr 380px',
              gap: 32,
              alignItems: 'flex-start',
            }}
          >
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}
            >
              {docs.map((s) => (
                <StoreCard key={s.id} store={s} />
              ))}
              {docs.length === 0 && (
                <p className="muted">No stores match your filters yet.</p>
              )}
            </div>
            <aside style={{ position: 'sticky', top: 140 }}>
              <StoreMap
                pins={docs
                  .filter(
                    (s): s is typeof s & { lat: number; lng: number } =>
                      typeof s.lat === 'number' && typeof s.lng === 'number',
                  )
                  .map((s) => ({
                    id: s.id,
                    lat: s.lat,
                    lng: s.lng,
                    label: s.name,
                    detail: `${s.area} · ${s.city}`,
                    href: `/stores/${s.slug}`,
                  }))}
                height={520}
              />
              <div className="rd-notice" style={{ marginTop: 16 }}>
                <span>
                  All retailers shown carry valid state excise licenses (L-1, L-2 or FL-2).
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h3
            className="serif"
            style={{ fontSize: 26, fontWeight: 500, marginBottom: 24 }}
          >
            Browse liquor stores by area
          </h3>
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
          >
            {[
              'Pari Chowk',
              'Alpha-1',
              'Alpha-2',
              'Beta-1',
              'Sector 18',
              'Sector 50',
              'Sector 76',
              'Sector 137',
              'Knowledge Park',
              'Surajpur',
              'Jagat Farm',
              'Omicron',
            ].map((a) => (
              <Link
                key={a}
                className="card card-pad"
                href={`/stores?q=${encodeURIComponent(a)}`}
                style={{ display: 'block', cursor: 'pointer', padding: 14 }}
              >
                <div
                  className="row"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span style={{ fontSize: 14 }}>Liquor stores in {a}</span>
                  <span className="mono dim" style={{ fontSize: 10 }}>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
