import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { captureServer } from '@/lib/posthog'
import { createOwnerSession, hashToken } from '@/lib/owner-auth'
import type { Owner } from '@/payload-types'

const log = childLogger({ scope: 'owner-verify' })

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? req.nextUrl.origin
  const expired = NextResponse.redirect(new URL('/owners/login?error=link_expired', base))

  const token = req.nextUrl.searchParams.get('token')
  if (!token) return expired

  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'owners',
      where: {
        and: [
          { loginTokenHash: { equals: hashToken(token) } },
          { loginTokenExpiresAt: { greater_than: new Date().toISOString() } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    const owner = docs[0] as Owner | undefined
    if (!owner) {
      log.warn('magic_link_invalid')
      return expired
    }

    // Single-use: clear the token before establishing the session.
    await payload.update({
      collection: 'owners',
      id: owner.id,
      data: { loginTokenHash: null, loginTokenExpiresAt: null } as Record<string, unknown>,
      overrideAccess: true,
    })

    await createOwnerSession(owner)
    await captureServer('owner_magic_link_verified', { email: owner.email }, owner.email)
    log.info({ ownerId: owner.id }, 'owner_magic_link_verified')

    return NextResponse.redirect(new URL('/owners/dashboard', base))
  } catch (err) {
    log.error({ err }, 'magic_link_verify_failed')
    return expired
  }
}
