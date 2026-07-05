'use client'

import { directionsUrl } from '@/lib/geo'
import { trackStoreEvent } from '@/lib/track'

type Props = {
  storeId: number
  name: string
  phone?: string | null
  lat?: number | null
  lng?: number | null
}

// Client version of the sidebar CTAs. Each action emits a first-party event before
// performing its normal navigation (tel:, Google Maps, WhatsApp).
export function StoreContactActions({ storeId, name, phone, lat, lng }: Props) {
  const hasGeo = typeof lat === 'number' && typeof lng === 'number'
  const whatsappNumber = phone ? phone.replace(/[^0-9]/g, '') : ''

  return (
    <div className="stack" style={{ '--stack': '8px', marginTop: 20 } as React.CSSProperties}>
      {phone && (
        <a
          href={`tel:${phone}`}
          className="btn primary block"
          onClick={() => trackStoreEvent(storeId, 'call')}
        >
          📞 Call store
        </a>
      )}
      {hasGeo ? (
        <a
          href={directionsUrl(lat as number, lng as number, name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn block"
          onClick={() => trackStoreEvent(storeId, 'directions')}
        >
          🧭 Get directions
        </a>
      ) : (
        <button className="btn block" disabled>
          🧭 Directions unavailable
        </button>
      )}
      {phone && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn block"
          onClick={() => trackStoreEvent(storeId, 'whatsapp')}
        >
          💬 WhatsApp inquiry
        </a>
      )}
    </div>
  )
}
