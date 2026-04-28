import { getPayload } from '@/lib/payload'
import { CategoryTile } from '@/components/CategoryTile'
import { Crumbs } from '@/components/Crumbs'
import { JsonLd, breadcrumbSchema } from '@/lib/schema'

export const revalidate = 600

export const metadata = {
  title: 'Every bottle. Every story.',
  description:
    'Browse all 12 spirit categories on Mybooz — whisky, rum, gin, vodka, wine, and Indian craft.',
}

export default async function SpiritsHubPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({ collection: 'categories', limit: 50, sort: 'name' })

  const crumbs = [{ label: 'Mybooz', href: '/' }, { label: 'Spirits' }]

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div className="container" style={{ padding: '24px 32px 56px' }}>
          <Crumbs items={crumbs} />
          <span className="eyebrow" style={{ marginTop: 24, display: 'inline-block' }}>
            {docs.reduce((acc, c) => acc + (c.count ?? 0), 0)} bottles · {docs.length} categories
          </span>
          <h1
            className="display"
            style={{
              fontSize: 'clamp(64px, 9vw, 116px)',
              margin: '14px 0 20px',
              maxWidth: '14ch',
            }}
          >
            Every bottle. <span style={{ color: 'var(--accent)' }}>Every story.</span>
          </h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          >
            {docs.map((c) => (
              <CategoryTile key={c.id} cat={c} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
