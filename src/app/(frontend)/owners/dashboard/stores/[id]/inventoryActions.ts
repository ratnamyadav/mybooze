'use server'

import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { getPayload } from '@/lib/payload'
import { childLogger } from '@/lib/logger'
import { captureServer } from '@/lib/posthog'
import { getCurrentOwner } from '@/lib/owner-auth'
import type { Store, StoreInventory } from '@/payload-types'

const log = childLogger({ scope: 'owner-inventory' })

type ActionResult = { ok: true } | { ok: false; error: string }

function ownerIdOf(store: number | Store | null | undefined): number | null {
  if (!store || typeof store === 'number') return null
  const o = store.owner
  return typeof o === 'object' && o ? o.id : (o ?? null)
}

/** Verify the signed-in owner owns `storeId`; returns the store (depth 1) or null. */
async function loadOwnedStore(storeId: number) {
  const owner = await getCurrentOwner()
  if (!owner) return { owner: null, store: null }
  const payload = await getPayload()
  const store = await payload
    .findByID({ collection: 'stores', id: storeId, depth: 1 })
    .catch(() => null)
  if (!store || ownerIdOf(store) !== owner.id) return { owner, store: null }
  return { owner, store }
}

export async function addInventoryItem(storeId: number, bottleId: number): Promise<ActionResult> {
  const { owner, store } = await loadOwnedStore(storeId)
  if (!owner) return { ok: false, error: 'Not authenticated.' }
  if (!store) return { ok: false, error: 'You do not own this listing.' }
  if (!Number.isInteger(bottleId)) return { ok: false, error: 'Pick a bottle to add.' }

  const payload = await getPayload()
  try {
    // Enforce one row per (store, bottle).
    const existing = await payload.find({
      collection: 'store-inventory',
      where: { and: [{ store: { equals: storeId } }, { bottle: { equals: bottleId } }] },
      limit: 1,
      depth: 0,
    })
    if (existing.totalDocs > 0) return { ok: false, error: 'That bottle is already in your inventory.' }

    await payload.create({
      collection: 'store-inventory',
      // Store ownership was verified above; this is the trust boundary.
      data: { store: storeId, bottle: bottleId, inStock: true },
      overrideAccess: true,
    })
    revalidatePath(`/stores/${store.slug}`)
    log.info({ storeId, bottleId, ownerId: owner.id }, 'inventory_item_added')
    await captureServer('store_inventory_updated', { storeId, action: 'add' }, String(owner.id))
    return { ok: true }
  } catch (err) {
    log.error({ err, storeId, bottleId }, 'inventory_add_failed')
    Sentry.captureException(err, { tags: { action: 'addInventoryItem', storeId } })
    return { ok: false, error: 'Could not add bottle.' }
  }
}

export async function updateInventoryItem(
  itemId: number,
  patch: { priceInr?: number | null; inStock?: boolean; featured?: boolean },
): Promise<ActionResult> {
  const owner = await getCurrentOwner()
  if (!owner) return { ok: false, error: 'Not authenticated.' }

  const payload = await getPayload()
  const item = (await payload
    .findByID({ collection: 'store-inventory', id: itemId, depth: 2 })
    .catch(() => null)) as (StoreInventory & { store: Store }) | null
  if (!item || ownerIdOf(item.store) !== owner.id) {
    return { ok: false, error: 'You do not own this item.' }
  }

  try {
    await payload.update({
      collection: 'store-inventory',
      id: itemId,
      data: {
        priceInr: patch.priceInr ?? null,
        inStock: Boolean(patch.inStock),
        featured: Boolean(patch.featured),
      },
      // Access layer also scopes owners to their store's rows (defense in depth).
      overrideAccess: false,
      user: owner as unknown as Parameters<typeof payload.update>[0]['user'],
    })
    const slug = typeof item.store === 'object' ? item.store.slug : undefined
    if (slug) revalidatePath(`/stores/${slug}`)
    log.info({ itemId, ownerId: owner.id }, 'inventory_item_updated')
    await captureServer('store_inventory_updated', { itemId, action: 'update' }, String(owner.id))
    return { ok: true }
  } catch (err) {
    log.error({ err, itemId }, 'inventory_update_failed')
    Sentry.captureException(err, { tags: { action: 'updateInventoryItem', itemId } })
    return { ok: false, error: 'Update failed.' }
  }
}

export async function removeInventoryItem(itemId: number): Promise<ActionResult> {
  const owner = await getCurrentOwner()
  if (!owner) return { ok: false, error: 'Not authenticated.' }

  const payload = await getPayload()
  const item = (await payload
    .findByID({ collection: 'store-inventory', id: itemId, depth: 2 })
    .catch(() => null)) as (StoreInventory & { store: Store }) | null
  if (!item || ownerIdOf(item.store) !== owner.id) {
    return { ok: false, error: 'You do not own this item.' }
  }

  try {
    await payload.delete({
      collection: 'store-inventory',
      id: itemId,
      overrideAccess: false,
      user: owner as unknown as Parameters<typeof payload.delete>[0]['user'],
    })
    const slug = typeof item.store === 'object' ? item.store.slug : undefined
    if (slug) revalidatePath(`/stores/${slug}`)
    log.info({ itemId, ownerId: owner.id }, 'inventory_item_removed')
    await captureServer('store_inventory_updated', { itemId, action: 'remove' }, String(owner.id))
    return { ok: true }
  } catch (err) {
    log.error({ err, itemId }, 'inventory_remove_failed')
    Sentry.captureException(err, { tags: { action: 'removeInventoryItem', itemId } })
    return { ok: false, error: 'Remove failed.' }
  }
}
