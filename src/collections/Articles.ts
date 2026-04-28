import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { slugifyFrom } from '../hooks/slugify'
import { statusField } from '../fields/status'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'datePublished', 'status'],
  },
  versions: { drafts: true, maxPerDoc: 30 },
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
      name: 'category',
      type: 'select',
      required: true,
      options: ['Buying Guides', 'Education', 'City Guides'].map((v) => ({
        label: v,
        value: v,
      })),
    },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'readMin', type: 'number', defaultValue: 5 },
    { name: 'datePublished', type: 'date', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxDepth: 1,
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
        paths: (doc) => [`/guides/${doc.slug}`, '/guides'],
      }),
    ],
  },
}
