import Link from 'next/link'
import type { Bottle } from '@/payload-types'
import { Stars } from './Stars'
import { Placeholder } from './Placeholder'

type Props = {
  bottle: Bottle
}

export function BottleCard({ bottle }: Props) {
  const cat =
    typeof bottle.category === 'object' && bottle.category && 'name' in bottle.category
      ? bottle.category.name
      : ''
  const region = bottle.region?.split(',')[0] ?? ''

  return (
    <article className="card">
      <Link
        href={`/bottles/${bottle.slug}`}
        style={{ display: 'block', color: 'inherit' }}
      >
        <Placeholder
          label={`${bottle.name?.toUpperCase() ?? 'BOTTLE'}`}
          image={bottle.image as never}
          aspectRatio="4/5"
          style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}
        />
        <div className="card-pad" style={{ paddingTop: 16 }}>
          <div className="row gap-2" style={{ marginBottom: 6 }}>
            {cat && (
              <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
                {cat}
              </span>
            )}
            {region && (
              <span className="mono dim" style={{ fontSize: 10 }}>
                · {region}
              </span>
            )}
          </div>
          <h4
            className="serif"
            style={{ fontSize: 17, margin: 0, fontWeight: 500, lineHeight: 1.25 }}
          >
            {bottle.name}
          </h4>
          <div
            className="row gap-2"
            style={{ marginTop: 10, justifyContent: 'space-between' }}
          >
            <Stars value={bottle.rating ?? 0} size={11} />
            {bottle.priceLow != null && bottle.priceHigh != null && (
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--fg-2)' }}
              >
                ₹{bottle.priceLow.toLocaleString('en-IN')}–
                {bottle.priceHigh.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
