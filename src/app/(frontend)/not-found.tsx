import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '120px 32px', textAlign: 'center' }}>
      <span className="eyebrow">404</span>
      <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 80px)', margin: '14px 0 16px' }}>
        Empty bottle.
      </h1>
      <p className="muted" style={{ fontSize: 17, marginBottom: 28 }}>
        We couldn&apos;t find that page. Try the directory or read a guide.
      </p>
      <div className="row gap-3" style={{ justifyContent: 'center' }}>
        <Link href="/stores" className="btn primary">
          Browse stores
        </Link>
        <Link href="/guides" className="btn">
          Read guides
        </Link>
      </div>
    </main>
  )
}
