import 'server-only'
import Razorpay from 'razorpay'
import crypto from 'node:crypto'

let client: Razorpay | null = null

export type Plan = 'verified' | 'featured'

const PLAN_TO_RAZORPAY_PLAN_ID: Record<Plan, string | undefined> = {
  verified: process.env.RAZORPAY_PLAN_VERIFIED,
  featured: process.env.RAZORPAY_PLAN_FEATURED,
}

export const PLAN_PRICE_INR: Record<Plan, number> = {
  verified: 999,
  featured: 2999,
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

export function razorpay(): Razorpay {
  if (!isRazorpayConfigured()) {
    throw new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable billing.',
    )
  }
  if (!client) {
    client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  }
  return client
}

export function razorpayPlanId(plan: Plan): string {
  const id = PLAN_TO_RAZORPAY_PLAN_ID[plan]
  if (!id) throw new Error(`Razorpay plan id for "${plan}" is not configured.`)
  return id
}

/**
 * Verify Razorpay's webhook signature. Returns true if the signature matches.
 * Razorpay signs the raw request body with HMAC-SHA256 using the webhook secret.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}
