import Image from 'next/image'
import type { Media, User } from '@/payload-types'

type Props = {
  author: User | number | null | undefined
  date?: string | null
}

const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

export function AuthorByline({ author, date }: Props) {
  if (!author || typeof author === 'number') {
    if (!date) return null
    return (
      <p className="muted mono" style={{ fontSize: 13, marginTop: 16 }}>
        Published {formatDate(date)}
      </p>
    )
  }

  const name = author.name ?? author.email
  const avatar = typeof author.avatar === 'object' ? (author.avatar as Media | null) : null
  const avatarUrl = avatar?.url ?? null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid var(--line-soft)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--bg-3)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={avatar?.alt ?? name} width={44} height={44} />
        ) : (
          <span className="mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{name}</span>
        <span className="mono dim" style={{ fontSize: 12 }}>
          {author.credentials ?? 'Contributor'}
          {date ? ` · ${formatDate(date)}` : ''}
        </span>
      </div>
    </div>
  )
}
