'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  initialQuery?: string
  initialCity?: string
  compact?: boolean
}

export function SearchBox({ initialQuery = '', initialCity = 'gnoida', compact = false }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    router.push(`/stores?${params.toString()}`)
  }

  return (
    <form
      className="row"
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: compact ? 6 : 10,
        padding: compact ? '4px 4px 4px 14px' : '8px 8px 8px 20px',
        gap: 10,
      }}
      onSubmit={submit}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        style={{ color: 'var(--fg-3)', flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
      <input
        className="field"
        style={{
          background: 'transparent',
          border: 0,
          padding: compact ? '8px 4px' : '14px 4px',
          flex: 1,
          fontSize: compact ? 14 : 17,
        }}
        placeholder="Search by city, area, store name, brand or spirit…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search query"
      />
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="field"
        style={{
          width: 160,
          background: 'transparent',
          border: 0,
          color: 'var(--fg-2)',
        }}
        aria-label="City"
      >
        <option value="gnoida">Greater Noida</option>
        <option value="noida">Noida</option>
        <option value="ndelhi">New Delhi</option>
        <option value="ggn">Gurugram</option>
      </select>
      <button type="submit" className={`btn primary ${compact ? 'sm' : 'lg'}`}>
        Search
      </button>
    </form>
  )
}
