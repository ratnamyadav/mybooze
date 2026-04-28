import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { key: 'home', label: 'Discover', href: '/' },
        { key: 'stores', label: 'Stores', href: '/stores' },
        { key: 'spirits', label: 'Spirits', href: '/spirits' },
        { key: 'guides', label: 'Guides', href: '/guides' },
        { key: 'claim', label: 'For Owners', href: '/owners' },
      ],
    },
  ],
}
