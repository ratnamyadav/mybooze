import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type RevalidateConfig = {
  paths: (doc: any) => string[]
}

export const revalidateOnPublish =
  ({ paths }: RevalidateConfig): CollectionAfterChangeHook =>
  async ({ doc, previousDoc }) => {
    const wasPublished = previousDoc?.status === 'published'
    const isPublished = doc?.status === 'published'

    if (!isPublished && !wasPublished) return doc

    try {
      const { revalidatePath } = await import('next/cache')
      for (const p of paths(doc)) revalidatePath(p)
      if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug) {
        for (const p of paths(previousDoc)) revalidatePath(p)
      }
    } catch {
      // revalidatePath unavailable outside Next.js runtime (e.g. seed scripts) — ignore
    }

    return doc
  }

export const revalidateOnDelete =
  ({ paths }: RevalidateConfig): CollectionAfterDeleteHook =>
  async ({ doc }) => {
    try {
      const { revalidatePath } = await import('next/cache')
      for (const p of paths(doc)) revalidatePath(p)
    } catch {
      // ignore
    }
    return doc
  }
