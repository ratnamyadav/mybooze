import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { slugifyFrom } from '../hooks/slugify'
import { statusField } from '../fields/status'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug', 'status'] },
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
    { name: 'blurb', type: 'textarea' },
    { name: 'count', type: 'number', admin: { description: 'Approx bottle count for display' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    statusField,
  ],
  hooks: {
    afterChange: [
      revalidateOnPublish({
        paths: (doc) => [`/spirits/${doc.slug}`, '/spirits'],
      }),
    ],
  },
}
