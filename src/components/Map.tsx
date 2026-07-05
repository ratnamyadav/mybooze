'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { Marker, NavigationControl, Popup, type MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

const DEFAULT_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? 'https://demotiles.maplibre.org/style.json'

const DELHI_NCR = { longitude: 77.27, latitude: 28.55, zoom: 9.5 }

export type MapPin = {
  id: string | number
  lat: number
  lng: number
  label: string
  href?: string
  detail?: string
}

type Props = {
  pins: MapPin[]
  height?: number | string
  initialView?: { longitude: number; latitude: number; zoom: number }
  interactive?: boolean
  showNav?: boolean
}

function boundsFor(pins: MapPin[]): [[number, number], [number, number]] | null {
  if (pins.length === 0) return null
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity
  for (const p of pins) {
    if (p.lng < minLng) minLng = p.lng
    if (p.lat < minLat) minLat = p.lat
    if (p.lng > maxLng) maxLng = p.lng
    if (p.lat > maxLat) maxLat = p.lat
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}

export function StoreMap({
  pins,
  height = 480,
  initialView,
  interactive = true,
  showNav = true,
}: Props) {
  const mapRef = useRef<MapRef | null>(null)
  const [active, setActive] = useState<MapPin | null>(null)

  const validPins = useMemo(
    () => pins.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)),
    [pins],
  )

  const viewState = initialView ?? (validPins[0]
    ? { longitude: validPins[0].lng, latitude: validPins[0].lat, zoom: 12 }
    : DELHI_NCR)

  useEffect(() => {
    const map = mapRef.current
    if (!map || validPins.length < 2) return
    const bb = boundsFor(validPins)
    if (!bb) return
    map.fitBounds(bb, { padding: 60, duration: 600, maxZoom: 14 })
  }, [validPins])

  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid var(--line-soft)',
        background: 'var(--bg-2)',
      }}
    >
      <Map
        ref={mapRef}
        initialViewState={viewState}
        mapStyle={DEFAULT_STYLE}
        style={{ width: '100%', height: '100%' }}
        interactive={interactive}
        attributionControl={{ compact: true }}
      >
        {showNav && interactive && <NavigationControl position="top-right" showCompass={false} />}
        {validPins.map((p) => (
          <Marker
            key={p.id}
            longitude={p.lng}
            latitude={p.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setActive(p)
            }}
          >
            <button
              type="button"
              aria-label={p.label}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                background: 'var(--accent)',
                border: '2px solid var(--accent-ink)',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}
            />
          </Marker>
        ))}
        {active && (
          <Popup
            longitude={active.lng}
            latitude={active.lat}
            anchor="bottom"
            offset={28}
            onClose={() => setActive(null)}
            closeButton={false}
            closeOnClick={false}
            maxWidth="240px"
          >
            <div style={{ minWidth: 180, fontFamily: 'var(--sans, system-ui)' }}>
              <strong style={{ display: 'block', marginBottom: 4 }}>{active.label}</strong>
              {active.detail && (
                <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>{active.detail}</div>
              )}
              {active.href && (
                <a
                  href={active.href}
                  style={{ fontSize: 13, color: '#0066cc', textDecoration: 'underline' }}
                >
                  View store →
                </a>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
