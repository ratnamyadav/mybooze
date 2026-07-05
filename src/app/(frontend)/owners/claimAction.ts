'use server'

import * as Sentry from '@sentry/nextjs'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { captureServer } from '@/lib/posthog'

const nullable = (s: string): string | undefined => (s.length > 0 ? s : undefined)

export async function submitClaim(formData: FormData) {
  const log = childLogger({ action: 'submitClaim' })
  const payload = await getPayload()

  const name = String(formData.get('name') ?? '').trim()
  const license = String(formData.get('license') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const area = String(formData.get('area') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const ownerName = String(formData.get('ownerName') ?? '').trim()
  const consent = formData.get('consent') === 'on'

  if (!name || !city || !area || !address || !consent) {
    log.info({ name, city, area, hasAddress: Boolean(address), consent }, 'claim_rejected_validation')
    await captureServer('owner_claim_rejected', { reason: 'validation', city, area })
    return { ok: false, error: 'Please fill all required fields and confirm ownership.' }
  }

  const slug = `${name}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  try {
    await payload.create({
      collection: 'stores',
      data: {
        name,
        slug,
        city,
        area,
        address,
        phone: nullable(phone),
        license: nullable(license),
        tagline: ownerName ? `Submitted by ${ownerName}` : undefined,
        verified: false,
        openNow: true,
        status: 'pending',
      },
    })

    log.info({ slug, city, area }, 'claim_submitted')
    await captureServer('owner_claim_submitted', { slug, city, area, hasLicense: Boolean(license) })
    return { ok: true }
  } catch (err) {
    log.error({ err, slug }, 'claim_failed')
    Sentry.captureException(err, { tags: { action: 'submitClaim' }, extra: { slug, city, area } })
    return { ok: false, error: 'Something went wrong saving your claim. Please try again.' }
  }
}
