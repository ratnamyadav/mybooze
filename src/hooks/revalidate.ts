import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { childLogger } from '@/lib/logger'

type RevalidateConfig = {
  paths: (doc: any) => string[]
}

const log = childLogger({ hook: 'revalidate' })

export const revalidateOnPublish =
  ({ paths }: RevalidateConfig): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, collection }) => {
    const wasPublished = previousDoc?.status === 'published'
    const isPublished = doc?.status === 'published'

    if (!isPublished && !wasPublished) return doc

    try {
      const { revalidatePath } = await import('next/cache')
      const targets = paths(doc)
      for (const p of targets) revalidatePath(p)
      if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug) {
        for (const p of paths(previousDoc)) revalidatePath(p)
      }
      if (targets.length > 0) {
        log.info(
          { collection: collection?.slug, id: doc?.id, slug: doc?.slug, paths: targets },
          'revalidated',
        )
      }
    } catch (err) {
      // revalidatePath unavailable outside Next.js runtime (e.g. seed scripts) — ignore.
      log.debug({ err, collection: collection?.slug }, 'revalidate_skipped')
    }

    return doc
  }

export const revalidateOnDelete =
  ({ paths }: RevalidateConfig): CollectionAfterDeleteHook =>
  async ({ doc, collection }) => {
    try {
      const { revalidatePath } = await import('next/cache')
      const targets = paths(doc)
      for (const p of targets) revalidatePath(p)
      if (targets.length > 0) {
        log.info(
          { collection: collection?.slug, id: doc?.id, slug: doc?.slug, paths: targets },
          'revalidated_delete',
        )
      }
    } catch (err) {
      log.debug({ err, collection: collection?.slug }, 'revalidate_skipped')
    }
    return doc
  }
