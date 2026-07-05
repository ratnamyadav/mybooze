import Link from 'next/link'
import { Crumbs } from '@/components/Crumbs'
import { SectionHead } from '@/components/primitives/SectionHead'
import { ClaimForm } from './ClaimForm'
import { JsonLd, breadcrumbSchema } from '@/lib/schema'
import { getCurrentOwner } from '@/lib/owner-auth'

export const metadata = {
  title: 'For Owners — Claim your liquor store listing',
  description:
    'Free verified listing for licensed liquor stores in India. Reach 50,000 monthly searchers in Delhi NCR.',
}

export default async function OwnersPage() {
  const crumbs = [{ label: 'Mybooz', href: '/' }, { label: 'For Owners' }]
  const owner = await getCurrentOwner()

  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section style={{ borderBottom: '1px solid var(--line-soft)' }}>
        <div
          className="container row"
          style={{
            padding: '14px 32px 0',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Crumbs items={crumbs} />
          <div className="row" style={{ gap: 10, fontSize: 12 }}>
            {owner ? (
              <Link href="/owners/dashboard" className="btn sm">
                Open dashboard →
              </Link>
            ) : (
              <>
                <Link href="/owners/login" className="mono dim">
                  Sign in
                </Link>
                <Link href="/owners/register" className="btn sm">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="container" style={{ padding: '32px 32px 64px' }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1.2fr 1fr',
              gap: 56,
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">For liquor store owners</span>
              <h1
                className="display"
                style={{
                  fontSize: 'clamp(56px, 8vw, 96px)',
                  margin: '14px 0 20px',
                  lineHeight: 1.05,
                }}
              >
                Your store, in front of{' '}
                <span style={{ color: 'var(--accent)' }}>50,000</span> monthly searchers.
              </h1>
              <p
                className="muted"
                style={{
                  fontSize: 18,
                  lineHeight: 1.55,
                  maxWidth: '54ch',
                  marginBottom: 32,
                }}
              >
                Claim your free listing on Mybooz. Get found by buyers in your neighbourhood,
                respond to reviews, and run inquiries through WhatsApp. Verified license-holders
                only.
              </p>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--line-soft)',
                  background: 'var(--bg-3)',
                }}
              >
                <span className="mono dim" style={{ fontSize: 10 }}>
                  OWNER DASHBOARD — PREVIEW
                </span>
              </div>
              <div className="card-pad">
                <div
                  className="row"
                  style={{ justifyContent: 'space-between', marginBottom: 16 }}
                >
                  <strong className="serif" style={{ fontSize: 18, fontWeight: 500 }}>
                    The Cellar · Pari Chowk
                  </strong>
                  <span className="badge verified">✓ Verified</span>
                </div>
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {[
                    { label: 'Profile views', value: '4,217', delta: '+18%' },
                    { label: 'Calls', value: '312', delta: '+22%' },
                    { label: 'Direction taps', value: '1,488', delta: '+9%' },
                  ].map((s) => (
                    <div key={s.label}>
                      <span className="mono dim" style={{ fontSize: 10 }}>
                        {s.label.toUpperCase()}
                      </span>
                      <p className="display" style={{ fontSize: 24, margin: '4px 0 0' }}>
                        {s.value}
                      </p>
                      <span
                        className="mono"
                        style={{ fontSize: 10, color: 'var(--good)' }}
                      >
                        {s.delta}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    height: 80,
                    background: 'var(--bg-3)',
                    borderRadius: 6,
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: 16,
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <path
                      d="M0 60 L30 50 L60 55 L90 40 L120 42 L150 30 L180 32 L210 22 L240 25 L270 14 L300 18"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0 60 L30 50 L60 55 L90 40 L120 42 L150 30 L180 32 L210 22 L240 25 L270 14 L300 18 L300 80 L0 80 Z"
                      fill="color-mix(in oklab, var(--accent) 15%, transparent)"
                    />
                  </svg>
                </div>
                <div className="row gap-2">
                  <span className="badge">Edit hours</span>
                  <span className="badge">Add photos</span>
                  <span className="badge">Reply to 3 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How it works" title="Live in four steps." />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginTop: 40,
            }}
          >
            {[
              {
                t: 'Find your store',
                b: 'Search by store name, GST or your registered phone. New stores can submit details and our team adds them within 48 hours.',
              },
              {
                t: 'Verify your license',
                b: 'Upload a photo of your L-1, L-2 or FL-2 license. We cross-reference with your state excise department before approving.',
              },
              {
                t: 'Build your profile',
                b: 'Add photos, hours, payment options, popular bottles, and a short story about your shop.',
              },
              {
                t: 'Go live',
                b: 'Once approved, your verified listing appears in search results and category pages.',
              },
            ].map((s, i) => (
              <div key={i} className="card card-pad">
                <span className="mono" style={{ color: 'var(--accent)', fontSize: 10 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="serif"
                  style={{ fontSize: 20, fontWeight: 500, margin: '8px 0 8px' }}
                >
                  {s.t}
                </h3>
                <p
                  className="muted"
                  style={{ fontSize: 14, margin: 0, lineHeight: 1.55 }}
                >
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="section-tight">
        <div className="container">
          <SectionHead
            eyebrow="Plans"
            title="Free for everyone. Premium for growers."
          />
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginTop: 32,
            }}
          >
            {[
              {
                name: 'Starter',
                price: 'Free',
                sub: 'For every verified store',
                features: [
                  'Verified listing',
                  'Hours, photos, contact',
                  'Reply to reviews',
                  'Basic analytics',
                ],
              },
              {
                name: 'Growth',
                price: '₹1,499/mo',
                sub: 'Most popular',
                features: [
                  'Everything in Starter',
                  'Featured in search',
                  'WhatsApp inquiries',
                  'Detailed analytics',
                  'Priority support',
                ],
                featured: true,
              },
              {
                name: 'Premium',
                price: '₹3,999/mo',
                sub: 'For multi-location chains',
                features: [
                  'Everything in Growth',
                  'Sponsored placements',
                  'Multi-store dashboard',
                  'API access',
                  'Dedicated manager',
                ],
              },
            ].map((p) => (
              <div
                key={p.name}
                className="card card-pad"
                style={{
                  padding: 28,
                  border: p.featured ? '1px solid var(--accent)' : undefined,
                  position: 'relative',
                }}
              >
                {p.featured && (
                  <span
                    className="badge solid"
                    style={{ position: 'absolute', top: -12, left: 28 }}
                  >
                    Recommended
                  </span>
                )}
                <span className="mono" style={{ color: 'var(--accent)', fontSize: 11 }}>
                  {p.name.toUpperCase()}
                </span>
                <h3 className="display" style={{ fontSize: 36, margin: '12px 0 4px' }}>
                  {p.price}
                </h3>
                <p className="muted" style={{ fontSize: 13, margin: '0 0 20px' }}>
                  {p.sub}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14 }}>
                  {p.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        padding: '8px 0',
                        borderTop: '1px solid var(--line-soft)',
                        color: 'var(--fg-2)',
                      }}
                    >
                      <span style={{ color: 'var(--accent)', marginRight: 8 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${p.featured ? 'primary' : ''} block`}
                  style={{ marginTop: 20 }}
                >
                  Choose {p.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <span className="eyebrow">Quick start</span>
          <h2 className="display" style={{ fontSize: 44, margin: '14px 0 20px' }}>
            Tell us about your store.
          </h2>
          <ClaimForm />
        </div>
      </section>
    </main>
  )
}
