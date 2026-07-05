import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function textOf(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[] }
  if (typeof n.text === 'string') return n.text
  if (Array.isArray(n.children)) return n.children.map(textOf).join('')
  return ''
}

export const articleConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    const text = textOf(node).trim()
    const id = text ? slugify(text) : undefined
    const children = nodesToJSX({ nodes: node.children })

    const Tag = tag
    return (
      <Tag id={id} style={{ scrollMarginTop: 96 }}>
        {children}
      </Tag>
    )
  },
})
