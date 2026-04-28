'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const SPIRITS = ['All', 'Whisky', 'Wine', 'Beer', 'Gin', 'Rum', 'Vodka', 'Indian Craft', 'Cognac']
const PRICES = ['Any', '₹', '₹₹', '₹₹₹', '₹₹₹₹']
const SORTS = ['Recommended', 'Highest rated', 'Most reviewed', 'Distance', 'Newest']

export function StoreFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value == null || value === '' || value === 'All' || value === 'Any') next.delete(key)
      else next.set(key, value)
      router.replace(`/stores?${next.toString()}`, { scroll: false })
    },
    [params, router],
  )

  const toggle = useCallback(
    (key: string) => {
      const next = new URLSearchParams(params.toString())
      if (next.get(key) === '1') next.delete(key)
      else next.set(key, '1')
      router.replace(`/stores?${next.toString()}`, { scroll: false })
    },
    [params, router],
  )

  const spirit = params.get('spirit') ?? 'All'
  const price = params.get('price') ?? 'Any'
  const sort = params.get('sort') ?? 'Recommended'

  return (
    <div
      className="row gap-3"
      style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}
    >
      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
        <label
          className="row"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '4px 4px 4px 12px',
            fontSize: 12,
            gap: 6,
          }}
        >
          <span className="mono dim" style={{ fontSize: 10 }}>
            Spirit:
          </span>
          <select
            value={spirit}
            onChange={(e) => update('spirit', e.target.value)}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--fg)',
              padding: '4px 6px',
            }}
          >
            {SPIRITS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          className={`chip ${params.get('openNow') === '1' ? 'active' : ''}`}
          onClick={() => toggle('openNow')}
        >
          ● Open now
        </button>
        <button
          className={`chip ${params.get('verified') === '1' ? 'active' : ''}`}
          onClick={() => toggle('verified')}
        >
          ✓ Verified
        </button>
        <button
          className={`chip ${params.get('pickup') === '1' ? 'active' : ''}`}
          onClick={() => toggle('pickup')}
        >
          Pickup
        </button>
        <button
          className={`chip ${params.get('delivery') === '1' ? 'active' : ''}`}
          onClick={() => toggle('delivery')}
        >
          Delivery
        </button>
        <label
          className="row"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '4px 4px 4px 12px',
            fontSize: 12,
            gap: 6,
          }}
        >
          <span className="mono dim" style={{ fontSize: 10 }}>
            Price:
          </span>
          <select
            value={price}
            onChange={(e) => update('price', e.target.value)}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--fg)',
              padding: '4px 6px',
            }}
          >
            {PRICES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label
        className="row"
        style={{
          border: '1px solid var(--line)',
          borderRadius: 999,
          padding: '4px 4px 4px 12px',
          fontSize: 12,
          gap: 6,
        }}
      >
        <span className="mono dim" style={{ fontSize: 10 }}>
          Sort:
        </span>
        <select
          value={sort}
          onChange={(e) => update('sort', e.target.value)}
          style={{ background: 'transparent', border: 0, color: 'var(--fg)', padding: '4px 6px' }}
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
