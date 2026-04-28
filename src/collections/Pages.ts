import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { slugifyFrom } from '../hooks/slugify'
import { statusField } from '../fields/status'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    description: 'Editable landing pages (Home hero copy, etc.)',
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: publishedOrLoggedIn,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [slugifyFrom('title')] },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'editorial',
          options: [
            { label: 'Editorial', value: 'editorial' },
            { label: 'Centered', value: 'centered' },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
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
        paths: (doc) => (doc.slug === 'home' ? ['/'] : [`/${doc.slug}`]),
      }),
    ],
  },
}
