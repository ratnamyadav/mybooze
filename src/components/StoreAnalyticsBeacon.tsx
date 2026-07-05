'use client'

import { useEffect, useRef } from 'react'
import { trackStoreEvent } from '@/lib/track'

// Fires a single `view` event when the store page mounts. The ref guards against
// React 18/19 StrictMode double-invocation in development.
export function StoreAnalyticsBeacon({ storeId }: { storeId: number }) {
  const sent = useRef(false)
  useEffect(() => {
    if (sent.current) return
    sent.current = true
    trackStoreEvent(storeId, 'view')
  }, [storeId])
  return null
}
