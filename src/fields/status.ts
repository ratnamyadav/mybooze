import type { Field } from 'payload'
import { isAdminUser } from '../access/isAdmin'

export const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'draft',
  required: true,
  index: true,
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending review', value: 'pending' },
    { label: 'Published', value: 'published' },
  ],
  access: {
    update: ({ req: { user }, data }) => {
      if (data?.status === 'published') return isAdminUser(user)
      return Boolean(user)
    },
  },
  admin: {
    position: 'sidebar',
    description:
      'Editors can save Draft or submit for review (Pending). Only admins can publish.',
  },
}
