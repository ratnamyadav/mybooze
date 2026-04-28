import type { Access } from 'payload'

export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}
