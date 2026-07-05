'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function NearMeButton({ radiusKm = 10 }: { radiusKm?: number }) {
  const router = useRouter()
  const params = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const hasLoc = params?.get('near')

  const onClick = () => {
    setErr(null)
    if (hasLoc) {
      const next = new URLSearchParams(params?.toString() ?? '')
      next.delete('near')
      next.delete('radiusKm')
      router.replace(`/stores${next.toString() ? `?${next.toString()}` : ''}`)
      return
    }
    if (!('geolocation' in navigator)) {
      setErr('Location unavailable in this browser.')
      return
    }
    setBusy(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = new URLSearchParams(params?.toString() ?? '')
        next.set('near', `${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`)
        next.set('radiusKm', String(radiusKm))
        next.set('sort', 'distance')
        router.replace(`/stores?${next.toString()}`)
        setBusy(false)
      },
      (e) => {
        setBusy(false)
        setErr(e.code === e.PERMISSION_DENIED ? 'Permission denied.' : 'Could not get location.')
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60_000 },
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="btn"
        aria-pressed={Boolean(hasLoc)}
      >
        {busy ? 'Locating…' : hasLoc ? '× Clear location' : '📍 Use my location'}
      </button>
      {err && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent-2)' }}>
          {err}
        </span>
      )}
    </div>
  )
}
