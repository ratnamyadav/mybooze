import Link from 'next/link'

export type Crumb = { label: string; href?: string }

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          {i > 0 && <span className="sep">/</span>}
          {it.href ? (
            <Link href={it.href}>{it.label}</Link>
          ) : (
            <span style={{ color: 'var(--fg-2)' }}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
