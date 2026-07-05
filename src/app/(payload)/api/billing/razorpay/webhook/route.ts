import { NextResponse, type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { captureServer } from '@/lib/posthog'
import { verifyWebhookSignature, type Plan } from '@/lib/razorpay'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = childLogger({ scope: 'razorpay-webhook' })

type RazorpayEvent = {
  event: string
  payload: {
    subscription?: {
      entity: {
        id: string
        status: string
        plan_id: string
        notes?: Record<string, string>
        charge_at?: number
        current_end?: number
        end_at?: number
      }
    }
  }
}

const ACTIVE_STATUSES = new Set(['authenticated', 'active'])
const ENDED_STATUSES = new Set(['cancelled', 'completed', 'expired', 'halted'])

function planFromRazorpayPlan(planId: string): Plan | null {
  if (planId === process.env.RAZORPAY_PLAN_VERIFIED) return 'verified'
  if (planId === process.env.RAZORPAY_PLAN_FEATURED) return 'featured'
  return null
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''

  if (!verifyWebhookSignature(raw, signature)) {
    log.warn({ signaturePresent: Boolean(signature) }, 'invalid_webhook_signature')
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let evt: RazorpayEvent
  try {
    evt = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const sub = evt.payload?.subscription?.entity
  if (!sub) {
    log.debug({ event: evt.event }, 'webhook_no_subscription')
    return NextResponse.json({ ok: true, ignored: true })
  }

  const ownerId = sub.notes?.ownerId ? Number(sub.notes.ownerId) : null
  if (!ownerId) {
    log.warn({ subId: sub.id, event: evt.event }, 'webhook_no_owner_in_notes')
    return NextResponse.json({ ok: true, ignored: true })
  }

  const targetPlan = planFromRazorpayPlan(sub.plan_id)
  const becomingActive = ACTIVE_STATUSES.has(sub.status)
  const ending = ENDED_STATUSES.has(sub.status)

  try {
    const payload = await getPayload()
    const updateData: Record<string, unknown> = {
      razorpaySubscriptionId: sub.id,
    }

    if (becomingActive && targetPlan) {
      updateData.plan = targetPlan
      if (sub.current_end) {
        updateData.planRenewsAt = new Date(sub.current_end * 1000).toISOString()
      }
    } else if (ending) {
      updateData.plan = 'free'
      updateData.planRenewsAt = null
    }

    await payload.update({
      collection: 'owners',
      id: ownerId,
      data: updateData,
      overrideAccess: true,
    })

    log.info(
      { event: evt.event, ownerId, subId: sub.id, status: sub.status, targetPlan },
      'webhook_applied',
    )
    await captureServer(
      'razorpay_webhook',
      { event: evt.event, status: sub.status, plan: targetPlan },
      String(ownerId),
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    log.error({ err, ownerId, subId: sub.id, event: evt.event }, 'webhook_apply_failed')
    Sentry.captureException(err, {
      tags: { scope: 'razorpay-webhook', event: evt.event },
      extra: { ownerId, subId: sub.id },
    })
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
