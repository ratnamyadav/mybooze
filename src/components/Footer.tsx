import Link from 'next/link'
import { Logo } from './Logo'

type FooterColumn = {
  heading: string
  links: { label: string; href: string }[]
}

type Props = {
  columns: FooterColumn[]
}

export function Footer({ columns }: Props) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p
              className="muted"
              style={{ marginTop: 16, fontSize: 13, maxWidth: 320 }}
            >
              India&apos;s directory for trusted liquor stores and curated spirits guidance. We do
              not sell alcohol directly.
            </p>
            <div className="rd-notice" style={{ marginTop: 16 }}>
              <span className="mono" style={{ color: 'var(--accent)' }}>
                Drink responsibly.
              </span>
              <span>Not for persons under the legal drinking age in your state.</span>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h5>{col.heading}</h5>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hr" style={{ margin: '40px 0 20px' }}></div>
        <nav
          aria-label="Legal"
          className="row mono dim"
          style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 16, fontSize: 12 }}
        >
          <Link href="/privacy">Privacy Policy</Link>
          <span aria-hidden>·</span>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <span aria-hidden>·</span>
          <Link href="/cancellation">Cancellation Policy</Link>
        </nav>
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 16,
          }}
        >
          <span className="mono dim">
            Mybooz Directory · A content &amp; discovery platform · Not a vendor
          </span>
          <span className="mono dim">
            Built with love in India <span aria-label="India">🇮🇳</span> ·{' '}
            <a
              href="https://nextflytech.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              © Nextfly Technologies
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
