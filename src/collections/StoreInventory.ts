import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

// Owner-curated bottle list for a single store. One row per (store, bottle);
// uniqueness is enforced in the add server action (Payload has no composite-unique helper).
export const StoreInventory: CollectionConfig = {
  slug: 'store-inventory',
  admin: {
    useAsTitle: 'bottle',
    defaultColumns: ['store', 'bottle', 'priceInr', 'inStock', 'featured'],
    description: 'Per-store bottle availability curated by the store owner.',
  },
  access: {
    // Inventory is public — it renders on the store detail page.
    read: () => true,
    // Editors/admins can manage any row. Owners write through server actions
    // (overrideAccess: false + explicit store-ownership check); the Where filter
    // below scopes update/delete to rows whose store they own.
    create: isEditorOrAdmin,
    update: ({ req: { user } }) => {
      if (!user) return false
      if ('role' in user && (user.role === 'admin' || user.role === 'editor')) return true
      if (user.collection === 'owners') return { 'store.owner': { equals: user.id } }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if ('role' in user && (user.role === 'admin' || user.role === 'editor')) return true
      if (user.collection === 'owners') return { 'store.owner': { equals: user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      required: true,
      index: true,
    },
    {
      name: 'bottle',
      type: 'relationship',
      relationTo: 'bottles',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'priceInr', type: 'number', admin: { description: 'Shelf price at this store (₹)' } },
        { name: 'inStock', type: 'checkbox', defaultValue: true },
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { description: 'Highlight as a top seller' } },
      ],
    },
  ],
}
