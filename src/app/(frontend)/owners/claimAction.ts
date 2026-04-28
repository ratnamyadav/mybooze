'use server'

import { getPayload } from '@/lib/payload'

export async function submitClaim(formData: FormData) {
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
    return { ok: false, error: 'Please fill all required fields and confirm ownership.' }
  }

  const slug = `${name}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  await payload.create({
    collection: 'stores',
    data: {
      name,
      slug,
      city,
      area,
      address,
      phone,
      license,
      tagline: ownerName ? `Submitted by ${ownerName}` : undefined,
      verified: false,
      openNow: true,
      status: 'pending',
    },
  })

  return { ok: true }
}
