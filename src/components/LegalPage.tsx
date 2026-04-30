import { Crumbs } from './Crumbs'

type Section = { heading: string; body: React.ReactNode }

type Props = {
  title: string
  intro: string
  lastUpdated: string
  sections: Section[]
  contactEmail?: string
  slug: 'privacy' | 'terms' | 'cancellation'
}

const LABELS: Record<Props['slug'], string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
  cancellation: 'Cancellation Policy',
}

export function LegalPage({
  title,
  intro,
  lastUpdated,
  sections,
  contactEmail = 'hello@mybooz.in',
  slug,
}: Props) {
  return (
    <main className="container" style={{ padding: '40px 32px 120px', maxWidth: 880 }}>
      <Crumbs items={[{ label: 'Home', href: '/' }, { label: LABELS[slug] }]} />

      <header style={{ margin: '24px 0 32px' }}>
        <span className="eyebrow">Legal</span>
        <h1
          className="display"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '12px 0 14px' }}
        >
          {title}
        </h1>
        <p className="muted" style={{ fontSize: 17, maxWidth: 640 }}>
          {intro}
        </p>
        <p className="mono dim" style={{ marginTop: 16, fontSize: 12 }}>
          Last updated: {lastUpdated}
        </p>
      </header>

      <div className="hr" style={{ margin: '8px 0 32px' }} />

      <article className="prose" style={{ display: 'grid', gap: 32 }}>
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>{s.heading}</h2>
            <div style={{ color: 'var(--fg-1)', lineHeight: 1.7 }}>{s.body}</div>
          </section>
        ))}

        <section>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>Contact</h2>
          <p style={{ color: 'var(--fg-1)', lineHeight: 1.7 }}>
            Questions about this policy? Email{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Mybooz Directory is a product of{' '}
            <a href="https://nextflytech.com" target="_blank" rel="noopener noreferrer">
              Nextfly Technologies
            </a>
            .
          </p>
        </section>
      </article>

      <aside
        style={{
          marginTop: 48,
          padding: 16,
          borderRadius: 12,
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          fontSize: 13,
          color: 'var(--fg-2)',
        }}
      >
        <strong style={{ color: 'var(--fg-1)' }}>Template notice.</strong> This text is a working
        draft. It must be reviewed by qualified legal counsel before public launch and tailored to
        the jurisdictions in which Mybooz operates.
      </aside>
    </main>
  )
}
