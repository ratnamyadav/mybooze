'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

type Props = {
  initialQuery?: string
  initialCity?: string
  compact?: boolean
}

type Hit = {
  id: number
  kind: 'store' | 'bottle' | 'guide' | 'category'
  title: string
  subtitle?: string
  href: string
}

const KIND_LABEL: Record<Hit['kind'], string> = {
  store: 'Store',
  bottle: 'Bottle',
  guide: 'Guide',
  category: 'Spirit',
}

const DEBOUNCE_MS = 180

export function SearchBox({ initialQuery = '', initialCity = 'gnoida', compact = false }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const [hits, setHits] = useState<Hit[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const wrapRef = useRef<HTMLFormElement | null>(null)
  const listboxId = useId()

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([])
      setOpen(false)
      return
    }
    const ctl = new AbortController()
    abortRef.current?.abort()
    abortRef.current = ctl
    setLoading(true)
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((data: { hits: Hit[] }) => {
          setHits(data.hits ?? [])
          setOpen(true)
          setActive(-1)
        })
        .catch(() => {
          /* aborted or network — silent */
        })
        .finally(() => setLoading(false))
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(t)
      ctl.abort()
    }
  }, [q])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (active >= 0 && hits[active]) {
      router.push(hits[active].href)
      setOpen(false)
      return
    }
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    router.push(`/stores?${params.toString()}`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || hits.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % hits.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? hits.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const grouped = useMemo(() => {
    const byKind = new Map<Hit['kind'], Hit[]>()
    for (const h of hits) {
      const arr = byKind.get(h.kind) ?? []
      arr.push(h)
      byKind.set(h.kind, arr)
    }
    return Array.from(byKind.entries())
  }, [hits])

  return (
    <form
      ref={wrapRef}
      className="row"
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: compact ? 6 : 10,
        padding: compact ? '4px 4px 4px 14px' : '8px 8px 8px 20px',
        gap: 10,
        position: 'relative',
      }}
      onSubmit={submit}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-owns={listboxId}
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
        placeholder="Search stores, bottles, brands or guides…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => hits.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        aria-label="Search query"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={active >= 0 ? `${listboxId}-opt-${active}` : undefined}
        autoComplete="off"
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

      {open && (hits.length > 0 || loading) && (
        <div
          id={listboxId}
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
            maxHeight: 420,
            overflowY: 'auto',
            zIndex: 30,
            padding: 6,
          }}
        >
          {loading && hits.length === 0 && (
            <div className="mono dim" style={{ padding: 12, fontSize: 12 }}>
              Searching…
            </div>
          )}
          {grouped.map(([kind, items], gi) => (
            <div key={kind} style={{ paddingTop: gi === 0 ? 0 : 6 }}>
              <div
                className="mono dim"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '8px 10px 4px',
                }}
              >
                {KIND_LABEL[kind]}s
              </div>
              {items.map((h) => {
                const idx = hits.indexOf(h)
                return (
                  <button
                    key={`${h.kind}-${h.id}`}
                    type="button"
                    id={`${listboxId}-opt-${idx}`}
                    role="option"
                    aria-selected={active === idx}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => {
                      router.push(h.href)
                      setOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      width: '100%',
                      padding: '10px 10px',
                      background: active === idx ? 'var(--bg-3)' : 'transparent',
                      border: 0,
                      borderRadius: 8,
                      color: 'var(--fg)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{h.title}</span>
                    {h.subtitle && (
                      <span className="mono dim" style={{ fontSize: 11 }}>
                        {h.subtitle}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </form>
  )
}
