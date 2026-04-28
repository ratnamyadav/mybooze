import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { slugifyFrom } from '../hooks/slugify'
import { statusField } from '../fields/status'

export const Bottles: CollectionConfig = {
  slug: 'bottles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'category', 'priceLow', 'status'],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: publishedOrLoggedIn,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [slugifyFrom('name')] },
    },
    { name: 'brand', type: 'text', required: true },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    { name: 'region', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'abv', type: 'number', admin: { description: '% alcohol by volume' } },
        { name: 'volume', type: 'text', admin: { description: 'e.g. 750ml' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'priceLow', type: 'number', admin: { description: '₹' } },
        { name: 'priceHigh', type: 'number', admin: { description: '₹' } },
      ],
    },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    {
      name: 'tastingNotes',
      type: 'array',
      fields: [{ name: 'note', type: 'text' }],
    },
    {
      name: 'best',
      type: 'select',
      options: ['Sipping', 'Mixers', 'Cocktails', 'Pairing'].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'occasion',
      type: 'select',
      options: ['Everyday', 'Gifting', 'Collector', 'Party', 'Dinner'].map((v) => ({
        label: v,
        value: v,
      })),
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'availableAt',
      type: 'relationship',
      relationTo: 'stores',
      hasMany: true,
    },
    statusField,
  ],
  hooks: {
    afterChange: [
      revalidateOnPublish({
        paths: (doc) => [`/bottles/${doc.slug}`],
      }),
    ],
  },
}
