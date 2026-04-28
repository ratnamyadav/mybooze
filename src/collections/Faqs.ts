import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { statusField } from '../fields/status'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'scope', 'status'],
  },
  versions: { drafts: true, maxPerDoc: 10 },
  access: {
    read: publishedOrLoggedIn,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'home',
      options: [
        { label: 'Homepage', value: 'home' },
        { label: 'Spirit category', value: 'category' },
        { label: 'Bottle', value: 'bottle' },
        { label: 'Store', value: 'store' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (data) => data.scope === 'category',
        description: 'Only used when scope is "category"',
      },
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    statusField,
  ],
  hooks: {
    afterChange: [
      revalidateOnPublish({
        paths: () => ['/'],
      }),
    ],
  },
}
