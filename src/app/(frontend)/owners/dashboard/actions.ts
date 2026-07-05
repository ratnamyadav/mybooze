'use server'

import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { captureServer } from '@/lib/posthog'
import { getCurrentOwner, issueMagicLink } from '@/lib/owner-auth'
import type { Owner } from '@/payload-types'

const log = childLogger({ scope: 'owner-actions' })

const COOKIE = 'payload-token'

export type AuthState = { ok: boolean; sent?: boolean; error?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Login: email-only. We always return the same "check your email" result so the
 * form never reveals whether an account exists.
 */
export async function requestOwnerMagicLink(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' }

  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'owners',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    const owner = docs[0] as Owner | undefined
    if (owner) await issueMagicLink(owner)
    await captureServer('owner_magic_link_requested', { email }, email)
    log.info({ email, found: Boolean(owner) }, 'owner_magic_link_requested')
  } catch (err) {
    log.error({ err, email }, 'owner_magic_link_request_failed')
    Sentry.captureException(err, { tags: { action: 'requestOwnerMagicLink' } })
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
  return { ok: true, sent: true }
}

/**
 * Register: create the owner with an unused random password (keeps Payload's
 * local strategy valid), then email a sign-in link.
 */
export async function registerOwner(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()

  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' }
  if (!name) return { ok: false, error: 'Your name is required.' }

  try {
    const payload = await getPayload()
    const owner = (await payload.create({
      collection: 'owners',
      data: {
        email,
        password: crypto.randomBytes(24).toString('hex'),
        name,
        phone,
        plan: 'free',
      },
    })) as Owner
    await issueMagicLink(owner)
    await captureServer('owner_registered', { email })
    log.info({ email }, 'owner_registered')
  } catch (err: unknown) {
    const msg =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Could not create account.'
    log.warn({ email, err: msg }, 'owner_register_failed')
    Sentry.captureException(err, { tags: { action: 'registerOwner' } })
    return { ok: false, error: msg }
  }
  return { ok: true, sent: true }
}

export async function ownerLogout() {
  const jar = await cookies()
  jar.delete(COOKIE)
  redirect('/owners/login')
}

export async function updateClaimedStore(storeId: number, formData: FormData) {
  const owner = await getCurrentOwner()
  if (!owner) return { ok: false, error: 'Not authenticated.' }

  const payload = await getPayload()

  // Verify the store belongs to this owner before allowing the update.
  const store = await payload.findByID({ collection: 'stores', id: storeId, depth: 0 })
  const ownerId = typeof store.owner === 'object' && store.owner ? store.owner.id : store.owner
  if (ownerId !== owner.id) {
    log.warn({ storeId, ownerId: owner.id }, 'unauthorized_store_edit_blocked')
    return { ok: false, error: 'You do not own this listing.' }
  }

  const data: Record<string, unknown> = {
    tagline: String(formData.get('tagline') ?? '').trim() || undefined,
    phone: String(formData.get('phone') ?? '').trim() || undefined,
    address: String(formData.get('address') ?? '').trim() || store.address,
    openNow: formData.get('openNow') === 'on',
    pickup: formData.get('pickup') === 'on',
    delivery: formData.get('delivery') === 'on',
    parking: formData.get('parking') === 'on',
  }

  try {
    await payload.update({
      collection: 'stores',
      id: storeId,
      data,
      overrideAccess: false,
      user: owner as unknown as Parameters<typeof payload.update>[0]['user'],
    })
    log.info({ storeId, ownerId: owner.id }, 'store_updated_by_owner')
    await captureServer('store_updated_by_owner', { storeId }, String(owner.id))
    return { ok: true }
  } catch (err) {
    log.error({ err, storeId }, 'store_update_failed')
    Sentry.captureException(err, { tags: { action: 'updateClaimedStore', storeId } })
    return { ok: false, error: 'Update failed.' }
  }
}
