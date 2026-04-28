import Link from 'next/link'
import type { Category } from '@/payload-types'

export function CategoryTile({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/spirits/${cat.slug}`}
      className="card"
      style={{ padding: 20, display: 'block', cursor: 'pointer' }}
    >
      <div
        className="row"
        style={{ justifyContent: 'space-between', alignItems: 'baseline' }}
      >
        <span className="serif" style={{ fontSize: 22, fontWeight: 500 }}>
          {cat.name}
        </span>
        {cat.count != null && (
          <span className="mono dim" style={{ fontSize: 11 }}>
            {cat.count}
          </span>
        )}
      </div>
      {cat.blurb && (
        <p className="muted" style={{ fontSize: 12, margin: '6px 0 0' }}>
          {cat.blurb}
        </p>
      )}
    </Link>
  )
}
