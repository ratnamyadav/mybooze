'use client'

import { useState, useTransition } from 'react'
import { updateClaimedStore } from '../../actions'

type Props = {
  storeId: number
  initial: {
    tagline: string
    phone: string
    address: string
    openNow: boolean
    pickup: boolean
    delivery: boolean
    parking: boolean
  }
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 15,
  color: 'var(--fg)',
  width: '100%',
}

export function StoreEditForm({ storeId, initial }: Props) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const onSubmit = (formData: FormData) => {
    setMsg(null)
    startTransition(async () => {
      const result = await updateClaimedStore(storeId, formData)
      setMsg(
        result.ok
          ? { ok: true, text: 'Saved.' }
          : { ok: false, text: result.error ?? 'Could not save.' },
      )
    })
  }

  return (
    <form action={onSubmit} className="stack" style={{ gap: 16 }}>
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          TAGLINE
        </span>
        <input type="text" name="tagline" defaultValue={initial.tagline} style={inputStyle} />
      </label>
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          PHONE
        </span>
        <input type="tel" name="phone" defaultValue={initial.phone} style={inputStyle} />
      </label>
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          ADDRESS
        </span>
        <textarea
          name="address"
          defaultValue={initial.address}
          rows={3}
          required
          style={{ ...inputStyle, fontFamily: 'inherit' }}
        />
      </label>

      <fieldset
        style={{
          border: '1px solid var(--line)',
          borderRadius: 8,
          padding: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        <legend className="mono dim" style={{ fontSize: 11, padding: '0 6px' }}>
          OPERATIONS
        </legend>
        {(['openNow', 'pickup', 'delivery', 'parking'] as const).map((k) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" name={k} defaultChecked={initial[k]} />
            <span style={{ fontSize: 14 }}>
              {k === 'openNow' ? 'Open now' : k[0].toUpperCase() + k.slice(1)}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="submit" disabled={pending} className="btn primary">
          {pending ? 'Saving…' : 'Save changes'}
        </button>
        {msg && (
          <span
            className="mono"
            style={{
              fontSize: 12,
              color: msg.ok ? 'var(--good)' : 'var(--accent-2)',
            }}
          >
            {msg.text}
          </span>
        )}
      </div>
    </form>
  )
}
