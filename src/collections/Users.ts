import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField } from '../access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'role'] },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    update: ({ req: { user }, id }) => {
      if (user?.role === 'admin') return true
      return user?.id === id
    },
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: isAdminField },
    },
  ],
}
