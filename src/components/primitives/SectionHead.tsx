import Link from 'next/link'

type Props = {
  eyebrow: string
  title: string
  link?: string
  href?: string
}

export function SectionHead({ eyebrow, title, link, href }: Props) {
  return (
    <div
      className="row"
      style={{
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="display" style={{ fontSize: 44, margin: '12px 0 0' }}>
          {title}
        </h2>
      </div>
      {link && href && (
        <Link href={href} className="btn ghost">
          {link} →
        </Link>
      )}
    </div>
  )
}
