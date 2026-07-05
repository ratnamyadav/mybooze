import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from '@/lib/payload'
import { captureServer } from '@/lib/posthog'
import { childLogger } from '@/lib/logger'
import { STORE_EVENT_TYPES, type StoreEventType } from '@/collections/StoreEvents'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = childLogger({ scope: 'track' })

const isEventType = (v: unknown): v is StoreEventType =>
  typeof v === 'string' && (STORE_EVENT_TYPES as readonly string[]).includes(v)

// First-party capture for store-page interactions. Never throws to the client —
// bad input is silently dropped so a tracking failure can't break navigation.
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  const { storeId, type } = (body ?? {}) as { storeId?: unknown; type?: unknown }
  const storeIdNum = Number(storeId)
  if (!Number.isInteger(storeIdNum) || !isEventType(type)) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'store-events',
      data: { store: storeIdNum, type },
    })
    // Mirror to PostHog for product analytics — fire-and-forget.
    captureServer(`store_${type}`, { storeId: storeIdNum }).catch(() => {})
  } catch (err) {
    // A missing/invalid store FK or DB hiccup must not surface to the user.
    log.debug({ err, storeId: storeIdNum, type }, 'track_event_dropped')
  }

  return new NextResponse(null, { status: 204 })
}
