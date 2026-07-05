'use server'

import * as Sentry from '@sentry/nextjs'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { captureServer } from '@/lib/posthog'
import { getCurrentOwner } from '@/lib/owner-auth'
import {
  isRazorpayConfigured,
  razorpay,
  razorpayPlanId,
  type Plan,
} from '@/lib/razorpay'

const log = childLogger({ scope: 'checkout' })

export type CheckoutResult =
  | {
      ok: true
      subscriptionId: string
      keyId: string
      shortUrl?: string
      prefill: { name?: string; email: string; contact?: string }
    }
  | { ok: false; error: string }

export async function createCheckoutSession(plan: Plan): Promise<CheckoutResult> {
  const owner = await getCurrentOwner()
  if (!owner) return { ok: false, error: 'Not authenticated.' }

  if (!isRazorpayConfigured()) {
    return {
      ok: false,
      error:
        'Billing is not yet enabled in this environment. Ask an admin to set RAZORPAY_* env vars.',
    }
  }

  try {
    const rzp = razorpay()
    const planId = razorpayPlanId(plan)

    const sub = await rzp.subscriptions.create({
      plan_id: planId,
      total_count: 12, // monthly, 12 cycles
      quantity: 1,
      customer_notify: 1,
      notes: { ownerId: String(owner.id), email: owner.email, plan },
    })

    const payload = await getPayload()
    await payload.update({
      collection: 'owners',
      id: owner.id,
      data: { razorpaySubscriptionId: sub.id },
      overrideAccess: true,
    })

    log.info({ ownerId: owner.id, subId: sub.id, plan }, 'checkout_session_created')
    await captureServer('checkout_started', { plan, subscriptionId: sub.id }, String(owner.id))

    return {
      ok: true,
      subscriptionId: sub.id,
      keyId: process.env.RAZORPAY_KEY_ID!,
      shortUrl: sub.short_url,
      prefill: {
        name: owner.name ?? undefined,
        email: owner.email,
        contact: owner.phone ?? undefined,
      },
    }
  } catch (err: unknown) {
    log.error({ err, ownerId: owner.id, plan }, 'checkout_failed')
    Sentry.captureException(err, { tags: { action: 'createCheckoutSession', plan } })
    return {
      ok: false,
      error:
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Could not start checkout.',
    }
  }
}
