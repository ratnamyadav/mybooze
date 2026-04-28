import Link from 'next/link'
import type { Article } from '@/payload-types'
import { Placeholder } from './Placeholder'

type Props = {
  article: Article
  variant?: 'default' | 'list'
}

const formatDate = (d?: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ArticleCard({ article, variant = 'default' }: Props) {
  if (variant === 'list') {
    return (
      <article
        className="row gap-4"
        style={{ padding: '20px 0', borderBottom: '1px solid var(--line-soft)' }}
      >
        <Link
          href={`/guides/${article.slug}`}
          style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'inherit', flex: 1 }}
        >
          <Placeholder
            label={`HERO — ${article.category?.toUpperCase() ?? 'ARTICLE'}`}
            image={article.heroImage as never}
            style={{ width: 140, height: 100, flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
              {article.category} · {article.readMin} min read
            </span>
            <h3
              className="serif"
              style={{ fontSize: 22, margin: '6px 0 6px', fontWeight: 500 }}
            >
              {article.title}
            </h3>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              {article.excerpt}
            </p>
            <span
              className="mono dim"
              style={{ fontSize: 10, marginTop: 8, display: 'inline-block' }}
            >
              {formatDate(article.datePublished)}
            </span>
          </div>
        </Link>
      </article>
    )
  }
  return (
    <article className="card">
      <Link
        href={`/guides/${article.slug}`}
        style={{ display: 'block', color: 'inherit' }}
      >
        <Placeholder
          label={`HERO — ${article.category?.toUpperCase() ?? 'ARTICLE'}`}
          image={article.heroImage as never}
          aspectRatio="16/9"
          style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}
        />
        <div className="card-pad">
          <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
            {article.category} · {article.readMin} min
          </span>
          <h3
            className="serif"
            style={{
              fontSize: 20,
              margin: '8px 0 8px',
              fontWeight: 500,
              lineHeight: 1.25,
            }}
          >
            {article.title}
          </h3>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            {article.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
