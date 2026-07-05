// Lightweight helpers over Payload's Lexical JSON tree.
// We deliberately don't import Lexical types — the shape is stable and a structural
// walk avoids pulling editor packages into RSC code paths.

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalDoc = { root?: LexicalNode } | null | undefined

export type TocItem = { id: string; level: 2 | 3; text: string }

function walk(node: LexicalNode | undefined, visit: (n: LexicalNode) => void): void {
  if (!node) return
  visit(node)
  if (Array.isArray(node.children)) {
    for (const c of node.children) walk(c, visit)
  }
}

function nodeText(node: LexicalNode): string {
  let out = ''
  walk(node, (n) => {
    if (typeof n.text === 'string') out += n.text
  })
  return out
}

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function extractToc(doc: LexicalDoc): TocItem[] {
  if (!doc?.root) return []
  const items: TocItem[] = []
  const seen = new Map<string, number>()

  walk(doc.root, (n) => {
    if (n.type !== 'heading') return
    const tag = typeof n.tag === 'string' ? n.tag.toLowerCase() : ''
    if (tag !== 'h2' && tag !== 'h3') return
    const text = nodeText(n).trim()
    if (!text) return
    const base = slugify(text)
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    const id = count === 1 ? base : `${base}-${count}`
    items.push({ id, level: tag === 'h2' ? 2 : 3, text })
  })

  return items
}

export function wordCount(doc: LexicalDoc): number {
  if (!doc?.root) return 0
  let text = ''
  walk(doc.root, (n) => {
    if (typeof n.text === 'string') text += ' ' + n.text
  })
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function readingTimeMin(doc: LexicalDoc, wpm = 220): number {
  const wc = wordCount(doc)
  if (wc === 0) return 0
  return Math.max(1, Math.ceil(wc / wpm))
}
