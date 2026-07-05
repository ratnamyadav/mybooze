import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { revalidateOnPublish } from '../hooks/revalidate'
import { slugifyFrom } from '../hooks/slugify'
import { statusField } from '../fields/status'

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'area', 'verified', 'status'],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: publishedOrLoggedIn,
    create: isEditorOrAdmin,
    // Editors/admins can update any store. Owners can update only their own claimed stores.
    update: ({ req: { user } }) => {
      if (!user) return false
      if ('role' in user && (user.role === 'admin' || user.role === 'editor')) return true
      if (user.collection === 'owners') return { owner: { equals: user.id } }
      return false
    },
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
    { name: 'tagline', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'area', type: 'text', required: true },
        { name: 'city', type: 'text', required: true, index: true },
      ],
    },
    { name: 'address', type: 'textarea', required: true },
    { name: 'phone', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'rating', type: 'number', min: 0, max: 5 },
        { name: 'reviewsCount', type: 'number', defaultValue: 0 },
        { name: 'distanceKm', type: 'number' },
      ],
    },
    {
      name: 'priceTier',
      type: 'select',
      options: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map((v) => ({ label: v, value: v })),
    },
    { name: 'license', type: 'text', admin: { description: 'e.g. L-1, L-2, FL-2' } },
    {
      type: 'row',
      fields: [
        { name: 'verified', type: 'checkbox', defaultValue: false },
        { name: 'openNow', type: 'checkbox', defaultValue: true },
        { name: 'pickup', type: 'checkbox', defaultValue: false },
        { name: 'delivery', type: 'checkbox', defaultValue: false },
        { name: 'parking', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((v) => ({
            label: v,
            value: v,
          })),
        },
        { name: 'open', type: 'text', admin: { description: 'e.g. 11:00 AM' } },
        { name: 'close', type: 'text', admin: { description: 'e.g. 11:00 PM' } },
      ],
    },
    {
      name: 'photos',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'payment',
      type: 'select',
      hasMany: true,
      options: ['Cash', 'UPI', 'Card', 'Wallet'].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'owners',
      hasMany: false,
      admin: {
        description: 'The owner account that has claimed this listing (if any).',
      },
      // Only admins can manually reassign ownership.
      access: {
        update: ({ req: { user } }) =>
          Boolean(user && 'role' in user && user.role === 'admin'),
      },
    },
    statusField,
  ],
  hooks: {
    afterChange: [
      revalidateOnPublish({
        paths: (doc) => [`/stores/${doc.slug}`, '/stores'],
      }),
    ],
  },
}
