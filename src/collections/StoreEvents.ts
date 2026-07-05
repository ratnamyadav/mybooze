import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const STORE_EVENT_TYPES = ['view', 'call', 'directions', 'whatsapp'] as const
export type StoreEventType = (typeof STORE_EVENT_TYPES)[number]

// Append-only first-party event log powering owner analytics. The public /api/track
// endpoint is the only writer; owners never read raw rows — the dashboard aggregates
// server-side with overrideAccess.
export const StoreEvents: CollectionConfig = {
  slug: 'store-events',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['store', 'type', 'createdAt'],
    description: 'Raw store-page interaction events (views, calls, directions, WhatsApp).',
  },
  access: {
    // Public create — the track endpoint writes here (cf. Reviews public create).
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: STORE_EVENT_TYPES.map((v) => ({ label: v, value: v })),
    },
  ],
}
