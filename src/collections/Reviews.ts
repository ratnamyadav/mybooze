import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { statusField } from '../fields/status'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'store', 'stars', 'status'],
  },
  versions: { drafts: true, maxPerDoc: 5 },
  access: {
    read: publishedOrLoggedIn,
    create: () => true, // public submission allowed; status defaults to 'pending'
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'authorName', type: 'text', required: true },
    { name: 'store', type: 'relationship', relationTo: 'stores', required: true },
    { name: 'stars', type: 'number', required: true, min: 1, max: 5 },
    { name: 'text', type: 'textarea', required: true },
    { name: 'when', type: 'text', admin: { description: 'e.g. "2 weeks ago"' } },
    { name: 'verified', type: 'checkbox', defaultValue: false },
    statusField,
  ],
  hooks: {
    afterChange: [
      revalidateOnPublish({
        paths: (doc) => {
          const storeSlug =
            typeof doc.store === 'object' && doc.store?.slug ? doc.store.slug : null
          return storeSlug ? [`/stores/${storeSlug}`] : []
        },
      }),
    ],
  },
}
