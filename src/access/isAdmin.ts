import type { Access, FieldAccess, PayloadRequest } from 'payload'

export const isAdminUser = (user: PayloadRequest['user']) =>
  user?.collection === 'users' && user.role === 'admin'

export const isAdmin: Access = ({ req: { user } }) => isAdminUser(user)

export const isAdminField: FieldAccess = ({ req: { user } }) => isAdminUser(user)
