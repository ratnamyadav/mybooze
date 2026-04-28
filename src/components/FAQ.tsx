'use client'

import { useState } from 'react'

export type FaqItem = { question: string; answer: string }

type Props = {
  items: FaqItem[]
  schemaNote?: boolean
}

export function FAQ({ items, schemaNote = true }: Props) {
  const [open, setOpen] = useState(0)
  return (
    <div className="stack" style={{ '--stack': '8px' } as React.CSSProperties}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="card" style={{ borderRadius: 6 }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '18px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span className="serif" style={{ fontSize: 17 }}>
                {it.question}
              </span>
              <span className="mono" style={{ color: 'var(--accent)', flexShrink: 0 }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '0 20px 20px',
                  color: 'var(--fg-2)',
                  fontSize: 14,
                  maxWidth: '70ch',
                }}
                className="fade-in"
              >
                {it.answer}
              </div>
            )}
          </div>
        )
      })}
      {schemaNote && (
        <p className="mono dim" style={{ fontSize: 10, marginTop: 16 }}>
          ⓘ Marked up with schema.org/FAQPage for rich results
        </p>
      )}
    </div>
  )
}
