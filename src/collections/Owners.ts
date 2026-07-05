import type { CollectionConfig } from 'payload'

export const Owners: CollectionConfig = {
  slug: 'owners',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // 14 days
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'plan', 'createdAt'],
    description:
      'Store-owner accounts. Separate from staff users — owners log in via /owners/login, not /admin.',
  },
  access: {
    // Owners can read their own record; staff can read all.
    read: ({ req: { user } }) => {
      if (!user) return false
      if ('role' in user && (user.role === 'admin' || user.role === 'editor')) return true
      return { id: { equals: user.id } }
    },
    // Anyone can create an owner account (registration).
    create: () => true,
    // Owners update themselves; admins update any.
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if ('role' in user && user.role === 'admin') return true
      return user.id === id
    },
    delete: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'plan',
      type: 'select',
      defaultValue: 'free',
      required: true,
      options: [
        { label: 'Free Listing', value: 'free' },
        { label: 'Verified (paid)', value: 'verified' },
        { label: 'Featured (paid)', value: 'featured' },
      ],
      admin: {
        description:
          'Set by the Razorpay webhook after a successful subscription. Manual override allowed by admins.',
      },
      access: {
        // Owners cannot upgrade themselves directly — must go through checkout.
        update: ({ req: { user } }) =>
          Boolean(user && 'role' in user && user.role === 'admin'),
      },
    },
    {
      name: 'razorpayCustomerId',
      type: 'text',
      admin: { readOnly: true, description: 'Set after first checkout session.' },
    },
    {
      name: 'razorpaySubscriptionId',
      type: 'text',
      admin: { readOnly: true, description: 'Active Razorpay subscription id.' },
    },
    {
      name: 'planRenewsAt',
      type: 'date',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    // --- Magic-link sign-in (passwordless) ---
    // One-time token: only its SHA-256 hash is stored, never the raw value.
    {
      name: 'loginTokenHash',
      type: 'text',
      index: true,
      admin: { hidden: true },
      access: {
        read: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
        update: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
      },
    },
    {
      name: 'loginTokenExpiresAt',
      type: 'date',
      admin: { hidden: true },
      access: {
        read: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
        update: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
      },
    },
  ],
}
