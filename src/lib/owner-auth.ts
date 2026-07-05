import 'server-only'
import crypto from 'node:crypto'
import { cookies, headers as nextHeaders } from 'next/headers'
import { getFieldsToSign, jwtSign } from 'payload'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { sendMagicLink } from '@/lib/email'
import type { Owner } from '@/payload-types'

const log = childLogger({ scope: 'owner-auth' })

const COOKIE = 'payload-token'
const TOKEN_TTL_MS = 15 * 60 * 1000 // magic-link validity: 15 minutes

export async function getCurrentOwner(): Promise<Owner | null> {
  try {
    const payload = await getPayload()
    const headerList = await nextHeaders()
    const { user } = await payload.auth({ headers: headerList })
    if (!user || user.collection !== 'owners') return null
    return user as unknown as Owner
  } catch (err) {
    log.debug({ err }, 'auth_check_failed')
    return null
  }
}

export async function clearOwnerSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

type SessionEntry = { id: string; createdAt: string; expiresAt: string }

/**
 * Establish a Payload session for an owner without a password.
 *
 * Appends a session entry (Payload uses `useSessions`, so the JWT's `sid` must
 * exist in the owner's `sessions` array), then mints a session JWT with
 * Payload's own helpers and sets the `payload-token` cookie.
 */
export async function createOwnerSession(owner: Owner) {
  const payload = await getPayload()
  const collectionConfig = payload.collections['owners'].config
  const tokenExpiration = collectionConfig.auth.tokenExpiration // seconds

  // Refetch to get the current sessions array, then prune expired + append new.
  const fresh = await payload.findByID({ collection: 'owners', id: owner.id, depth: 0 })
  const now = new Date()
  const existing = ((fresh as unknown as { sessions?: SessionEntry[] }).sessions ?? []).filter(
    (s) => new Date(s.expiresAt) > now,
  )
  const sid = crypto.randomUUID()
  const expiresAt = new Date(now.getTime() + tokenExpiration * 1000)
  const sessions: SessionEntry[] = [
    ...existing,
    { id: sid, createdAt: now.toISOString(), expiresAt: expiresAt.toISOString() },
  ]

  // Write via the DB layer (mirrors Payload's own addSessionToUser) so the
  // internal `sessions` auth field isn't stripped by the local API.
  await payload.db.updateOne({
    collection: 'owners',
    id: owner.id,
    data: { ...fresh, sessions, updatedAt: null },
    returning: false,
  })

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: owner.email,
    sid,
    user: { ...fresh, collection: 'owners' } as Parameters<typeof getFieldsToSign>[0]['user'],
  })
  const { token } = await jwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration,
  })

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: tokenExpiration,
  })
}

/**
 * Generate a one-time magic-link token for an owner, persist its hash + expiry,
 * and email the sign-in link. Stores only the hash; the raw token lives only in
 * the emailed URL.
 */
export async function issueMagicLink(owner: Owner) {
  const payload = await getPayload()
  const raw = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString()

  await payload.update({
    collection: 'owners',
    id: owner.id,
    data: { loginTokenHash: hashToken(raw), loginTokenExpiresAt: expiresAt } as Record<
      string,
      unknown
    >,
    overrideAccess: true,
  })

  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  const url = `${base}/owners/verify?token=${raw}`
  await sendMagicLink({ to: owner.email, url })
}
