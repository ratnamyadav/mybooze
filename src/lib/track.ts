import type { StoreEventType } from '@/collections/StoreEvents'

// Client-side helper: send a store interaction to /api/track. Uses sendBeacon so the
// request survives navigation (tel:, external maps, WhatsApp), falling back to a
// keepalive fetch. Never throws — tracking must never block the user's action.
export function trackStoreEvent(storeId: number, type: StoreEventType) {
  if (typeof navigator === 'undefined') return
  try {
    const body = JSON.stringify({ storeId, type })
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
      return
    }
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* ignore */
  }
}
