'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addInventoryItem, removeInventoryItem, updateInventoryItem } from './inventoryActions'

export type InventoryRow = {
  id: number
  bottleId: number
  bottleName: string
  bottleBrand: string
  priceInr: number | null
  inStock: boolean
  featured: boolean
}

type Props = {
  storeId: number
  items: InventoryRow[]
}

type SearchHit = { id: number; kind: string; title: string; subtitle?: string }

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 14,
  color: 'var(--fg)',
  width: '100%',
}

export function InventoryEditor({ storeId, items }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, okText: string) => {
    setMsg(null)
    startTransition(async () => {
      const res = await fn()
      setMsg(res.ok ? { ok: true, text: okText } : { ok: false, text: res.error ?? 'Failed.' })
      if (res.ok) router.refresh()
    })
  }

  return (
    <section className="card card-pad" style={{ marginTop: 32 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>
          Inventory
        </h2>
        {msg && (
          <span className="mono" style={{ fontSize: 12, color: msg.ok ? 'var(--good)' : 'var(--accent-2)' }}>
            {msg.text}
          </span>
        )}
      </div>
      <p className="muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
        Curate the bottles you stock. These appear on your public store page under the Bottles tab.
      </p>

      <AddBottle
        disabled={pending}
        onAdd={(bottleId) => run(() => addInventoryItem(storeId, bottleId), 'Bottle added.')}
      />

      <div className="stack" style={{ gap: 10, marginTop: 20 }}>
        {items.length === 0 && (
          <p className="muted" style={{ fontSize: 14 }}>
            No bottles yet — search above to add your first one.
          </p>
        )}
        {items.map((it) => (
          <InventoryItemRow
            key={it.id}
            row={it}
            disabled={pending}
            onSave={(patch) => run(() => updateInventoryItem(it.id, patch), 'Saved.')}
            onRemove={() => run(() => removeInventoryItem(it.id), 'Removed.')}
          />
        ))}
      </div>
    </section>
  )
}

function AddBottle({ disabled, onAdd }: { disabled: boolean; onAdd: (bottleId: number) => void }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) {
      setHits([])
      return
    }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        const data = (await res.json()) as { hits: SearchHit[] }
        setHits(data.hits.filter((h) => h.kind === 'bottle'))
        setOpen(true)
      } catch {
        /* aborted or failed — ignore */
      }
    }, 200)
    return () => {
      ctrl.abort()
      clearTimeout(t)
    }
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <span className="mono dim" style={{ fontSize: 11 }}>
        ADD A BOTTLE
      </span>
      <input
        type="text"
        value={q}
        disabled={disabled}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => hits.length > 0 && setOpen(true)}
        placeholder="Search the catalog by name or brand…"
        style={{ ...inputStyle, marginTop: 6 }}
      />
      {open && hits.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: '4px 0 0',
            padding: 4,
            position: 'absolute',
            zIndex: 10,
            left: 0,
            right: 0,
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            maxHeight: 240,
            overflowY: 'auto',
          }}
        >
          {hits.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onAdd(h.id)
                  setQ('')
                  setHits([])
                  setOpen(false)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--fg)',
                  padding: '8px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {h.title}
                {h.subtitle && (
                  <span className="mono dim" style={{ fontSize: 11, marginLeft: 8 }}>
                    {h.subtitle}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function InventoryItemRow({
  row,
  disabled,
  onSave,
  onRemove,
}: {
  row: InventoryRow
  disabled: boolean
  onSave: (patch: { priceInr: number | null; inStock: boolean; featured: boolean }) => void
  onRemove: () => void
}) {
  const [price, setPrice] = useState(row.priceInr != null ? String(row.priceInr) : '')
  const [inStock, setInStock] = useState(row.inStock)
  const [featured, setFeatured] = useState(row.featured)

  return (
    <div
      className="row"
      style={{
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
        border: '1px solid var(--line-soft)',
        borderRadius: 10,
        padding: '12px 14px',
      }}
    >
      <div style={{ flex: '1 1 180px', minWidth: 160 }}>
        <strong style={{ fontSize: 15 }}>{row.bottleName}</strong>
        <div className="mono dim" style={{ fontSize: 11 }}>
          {row.bottleBrand}
        </div>
      </div>
      <label className="row" style={{ gap: 6, alignItems: 'center' }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          ₹
        </span>
        <input
          type="number"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          style={{ ...inputStyle, width: 100 }}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        In stock
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Featured
      </label>
      <div className="row" style={{ gap: 8, marginLeft: 'auto' }}>
        <button
          type="button"
          className="btn sm"
          disabled={disabled}
          onClick={() => onSave({ priceInr: price.trim() === '' ? null : Number(price), inStock, featured })}
        >
          Save
        </button>
        <button
          type="button"
          className="btn sm"
          disabled={disabled}
          onClick={onRemove}
          style={{ color: 'var(--accent-2)' }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
