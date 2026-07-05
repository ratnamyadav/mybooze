import type { Payload, Where } from 'payload'
import { STORE_EVENT_TYPES, type StoreEventType } from '@/collections/StoreEvents'

export type MetricTotals = Record<StoreEventType, number>

export type DailyPoint = { date: string } & MetricTotals

export type StoreAnalytics = {
  windowDays: number
  totals: MetricTotals
  /** Percentage change vs the previous equal-length window; null when the prior window had zero. */
  deltaPct: Record<StoreEventType, number | null>
  /** One entry per day across the window (oldest → newest). Only populated for detailed view. */
  daily: DailyPoint[]
}

const emptyTotals = (): MetricTotals =>
  Object.fromEntries(STORE_EVENT_TYPES.map((t) => [t, 0])) as MetricTotals

/** Paid plans unlock trend charts + per-day breakdowns; free plans see totals only. */
export function canSeeDetailedAnalytics(plan: string | null | undefined): boolean {
  return plan === 'verified' || plan === 'featured'
}

function countWhere(storeId: number, type: StoreEventType, gte: Date, lt?: Date): Where {
  const createdAt: Record<string, string> = { greater_than_equal: gte.toISOString() }
  if (lt) createdAt.less_than = lt.toISOString()
  return {
    and: [{ store: { equals: storeId } }, { type: { equals: type } }, { createdAt }],
  }
}

export async function getStoreAnalytics(
  payload: Payload,
  storeId: number,
  opts: { windowDays?: number; detailed?: boolean } = {},
): Promise<StoreAnalytics> {
  const windowDays = opts.windowDays ?? 30
  const now = new Date()
  const since = new Date(now.getTime() - windowDays * 86_400_000)
  const prevSince = new Date(now.getTime() - windowDays * 2 * 86_400_000)

  const totals = emptyTotals()
  const previous = emptyTotals()

  // Accurate headline numbers via filtered counts (8 cheap COUNT queries).
  await Promise.all(
    STORE_EVENT_TYPES.flatMap((type) => [
      payload
        .count({ collection: 'store-events', where: countWhere(storeId, type, since) })
        .then((r) => {
          totals[type] = r.totalDocs
        }),
      payload
        .count({ collection: 'store-events', where: countWhere(storeId, type, prevSince, since) })
        .then((r) => {
          previous[type] = r.totalDocs
        }),
    ]),
  )

  const deltaPct = Object.fromEntries(
    STORE_EVENT_TYPES.map((type) => {
      const prev = previous[type]
      const value = prev === 0 ? null : Math.round(((totals[type] - prev) / prev) * 100)
      return [type, value]
    }),
  ) as Record<StoreEventType, number | null>

  let daily: DailyPoint[] = []
  if (opts.detailed) {
    daily = await buildDailySeries(payload, storeId, since, windowDays)
  }

  return { windowDays, totals, deltaPct, daily }
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

async function buildDailySeries(
  payload: Payload,
  storeId: number,
  since: Date,
  windowDays: number,
): Promise<DailyPoint[]> {
  // Seed an entry per day so the chart has a continuous x-axis even on quiet days.
  const buckets = new Map<string, MetricTotals>()
  for (let i = 0; i < windowDays; i++) {
    const d = new Date(since.getTime() + i * 86_400_000)
    buckets.set(dayKey(d), emptyTotals())
  }

  // Capped scan of raw events in the window — approximate is fine for a trend line.
  const { docs } = await payload.find({
    collection: 'store-events',
    where: {
      and: [{ store: { equals: storeId } }, { createdAt: { greater_than_equal: since.toISOString() } }],
    },
    limit: 10_000,
    depth: 0,
    select: { type: true, createdAt: true },
    sort: 'createdAt',
  })

  for (const doc of docs) {
    if (!doc.createdAt || !doc.type) continue
    const key = dayKey(new Date(doc.createdAt))
    const bucket = buckets.get(key)
    if (bucket) bucket[doc.type as StoreEventType] += 1
  }

  return [...buckets.entries()].map(([date, counts]) => ({ date, ...counts }))
}
