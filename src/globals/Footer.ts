import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
      defaultValue: [
        {
          heading: 'Discover',
          links: [
            { label: 'Liquor stores', href: '/stores' },
            { label: 'Spirit categories', href: '/spirits' },
            { label: 'Buying guides', href: '/guides' },
          ],
        },
        {
          heading: 'Cities',
          links: [
            { label: 'Greater Noida', href: '/stores?city=greater-noida' },
            { label: 'Noida', href: '/stores?city=noida' },
            { label: 'New Delhi', href: '/stores?city=new-delhi' },
          ],
        },
        {
          heading: 'For Owners',
          links: [
            { label: 'Claim your listing', href: '/owners' },
            { label: 'Subscription plans', href: '/owners#plans' },
          ],
        },
        {
          heading: 'Legal',
          links: [
            { label: 'Terms of use', href: '/legal/terms' },
            { label: 'Privacy policy', href: '/legal/privacy' },
            { label: 'Responsible drinking', href: '/legal/responsible-drinking' },
          ],
        },
      ],
    },
  ],
}
