const SITE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export type OgKind = 'store' | 'bottle' | 'guide' | 'category' | 'page'

export function ogImageUrl(opts: {
  title: string
  subtitle?: string
  kind: OgKind
  eyebrow?: string
}): string {
  const params = new URLSearchParams({ title: opts.title, kind: opts.kind })
  if (opts.subtitle) params.set('subtitle', opts.subtitle)
  if (opts.eyebrow) params.set('eyebrow', opts.eyebrow)
  return `${SITE}/api/og?${params.toString()}`
}
