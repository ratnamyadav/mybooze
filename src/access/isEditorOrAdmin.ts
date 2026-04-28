import type { Access } from 'payload'

export const isEditorOrAdmin: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'
