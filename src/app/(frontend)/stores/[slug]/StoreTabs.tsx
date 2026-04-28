'use client'

import { useState } from 'react'

type Tab = { id: string; label: string }

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'bottles', label: 'Popular bottles' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'hours', label: 'Hours' },
  { id: 'pairing', label: 'Pairing' },
]

export function StoreTabs({
  overview,
  bottles,
  reviews,
  hours,
  pairing,
}: {
  overview: React.ReactNode
  bottles: React.ReactNode
  reviews: React.ReactNode
  hours: React.ReactNode
  pairing: React.ReactNode
}) {
  const [tab, setTab] = useState('overview')

  return (
    <>
      <div
        style={{
          borderBottom: '1px solid var(--line-soft)',
          display: 'flex',
          gap: 24,
          marginBottom: 28,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '12px 0',
              fontSize: 13,
              color: tab === t.id ? 'var(--fg)' : 'var(--fg-3)',
              borderBottom: '2px solid ' + (tab === t.id ? 'var(--accent)' : 'transparent'),
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'overview' && <div className="fade-in">{overview}</div>}
      {tab === 'bottles' && <div className="fade-in">{bottles}</div>}
      {tab === 'reviews' && <div className="fade-in">{reviews}</div>}
      {tab === 'hours' && <div className="fade-in">{hours}</div>}
      {tab === 'pairing' && <div className="fade-in">{pairing}</div>}
    </>
  )
}
