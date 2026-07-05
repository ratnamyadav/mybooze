import type { TocItem } from '@/lib/lexical'

export function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null

  return (
    <nav
      aria-label="In this article"
      className="card"
      style={{
        padding: '18px 22px',
        margin: '0 0 32px',
        background: 'var(--bg-2)',
        borderRadius: 14,
      }}
    >
      <span
        className="eyebrow"
        style={{ display: 'block', marginBottom: 10, color: 'var(--accent)' }}
      >
        In this article
      </span>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {items.map((it) => (
          <li
            key={it.id}
            style={{ paddingLeft: it.level === 3 ? 18 : 0, fontSize: 14, lineHeight: 1.5 }}
          >
            <a
              href={`#${it.id}`}
              style={{
                color: 'var(--fg-2)',
                textDecoration: 'none',
              }}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
