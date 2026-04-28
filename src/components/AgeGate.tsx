'use client'

import { useEffect, useState } from 'react'

const COOKIE = 'mybooz_age_ok'

function readCookie(name: string) {
  if (typeof document === 'undefined') return null
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1]
}

export function AgeGate() {
  const [ready, setReady] = useState(false)
  const [agreed, setAgreed] = useState(true)

  useEffect(() => {
    setAgreed(readCookie(COOKIE) === '1')
    setReady(true)
  }, [])

  if (!ready || agreed) return null

  const accept = () => {
    document.cookie = `${COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    setAgreed(true)
  }

  const reject = () => {
    alert('You must be of legal drinking age in your state to continue.')
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="modal fade-in">
        <div style={{ padding: '32px 32px 8px' }}>
          <span className="eyebrow">Age verification</span>
          <h2 id="age-gate-title" className="display" style={{ fontSize: 36, margin: '12px 0 8px' }}>
            Are you of legal drinking age?
          </h2>
          <p className="muted" style={{ fontSize: 14, margin: 0 }}>
            Mybooz is a directory for liquor retailers and spirits content. The legal drinking age
            in your state may be 21 or 25. By continuing you confirm you are above that age.
          </p>
        </div>
        <div
          style={{
            padding: 24,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <button className="btn block lg" onClick={reject}>
            I am under age
          </button>
          <button className="btn primary block lg" onClick={accept}>
            Yes, I am 21+
          </button>
        </div>
        <div
          style={{
            background: 'var(--bg-2)',
            padding: '14px 24px',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          <span className="mono dim" style={{ fontSize: 10 }}>
            Drink responsibly · Not intended for minors · We do not sell alcohol directly
          </span>
        </div>
      </div>
    </div>
  )
}
