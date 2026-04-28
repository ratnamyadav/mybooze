import type { FieldHook } from 'payload'

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const slugifyFrom =
  (sourceField: string): FieldHook =>
  ({ data, value, operation }) => {
    if (typeof value === 'string' && value.length > 0) return value
    if (operation === 'create' || operation === 'update') {
      const src = data?.[sourceField]
      if (typeof src === 'string' && src.length > 0) return toSlug(src)
    }
    return value
  }
