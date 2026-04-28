import Link from 'next/link'
import type { Store } from '@/payload-types'
import { Stars } from './Stars'
import { Placeholder } from './Placeholder'

type Props = {
  store: Store
  variant?: 'default' | 'compact'
}

export function StoreCard({ store, variant = 'default' }: Props) {
  const compact = variant === 'compact'
  const heroPhoto =
    Array.isArray(store.photos) && store.photos[0]?.image ? store.photos[0].image : null

  return (
    <article className="card" style={{ display: 'block' }}>
      <Link href={`/stores/${store.slug}`} style={{ display: 'block', color: 'inherit' }}>
        <Placeholder
          label={`${store.name?.toUpperCase() ?? 'STORE'} — STOREFRONT`}
          image={heroPhoto as never}
          aspectRatio={compact ? '16/9' : '5/3'}
          style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}
        />
        <div className="card-pad">
          <div
            className="row gap-2"
            style={{ marginBottom: 8, flexWrap: 'wrap' }}
          >
            {store.verified && <span className="badge verified">✓ Verified</span>}
            <span className={`badge ${store.openNow ? 'open' : 'closed'}`}>
              {store.openNow ? 'Open now' : 'Closed'}
            </span>
            {store.priceTier && <span className="badge">{store.priceTier}</span>}
          </div>
          <h3
            className="serif"
            style={{ fontSize: 22, margin: '4px 0 4px', fontWeight: 500 }}
          >
            {store.name}
          </h3>
          {store.tagline && (
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              {store.tagline}
            </p>
          )}
          <div className="row gap-3" style={{ marginTop: 12 }}>
            <Stars value={store.rating ?? 0} />
            <span className="mono dim">
              {(store.rating ?? 0).toFixed(1)} · {store.reviewsCount ?? 0} reviews
            </span>
          </div>
          <div className="hr" style={{ margin: '14px 0' }}></div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="mono" style={{ color: 'var(--fg-2)', fontSize: 11 }}>
              {store.area}, {store.city}
            </span>
            {store.distanceKm != null && (
              <span className="mono dim" style={{ fontSize: 11 }}>
                {store.distanceKm.toFixed(1)} km
              </span>
            )}
          </div>
          {!compact && Array.isArray(store.categories) && store.categories.length > 0 && (
            <div
              className="row gap-2"
              style={{ marginTop: 12, flexWrap: 'wrap' }}
            >
              {store.categories.slice(0, 3).map((c, i) => {
                const name = typeof c === 'object' && c && 'name' in c ? c.name : null
                return name ? (
                  <span
                    key={i}
                    className="chip"
                    style={{ padding: '3px 9px', fontSize: 11, cursor: 'default' }}
                  >
                    {name}
                  </span>
                ) : null
              })}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
