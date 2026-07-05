import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentOwner } from '@/lib/owner-auth'
import { getPayload } from '@/lib/payload'
import { ownerLogout } from './actions'
import { CheckoutButton } from './CheckoutButton'

export const metadata: Metadata = {
  title: 'Owner dashboard · Mybooz',
  robots: { index: false, follow: false },
}

const PLAN_LABEL: Record<string, string> = {
  free: 'Free Listing',
  verified: 'Verified',
  featured: 'Featured',
}

export default async function OwnerDashboard() {
  const owner = await getCurrentOwner()
  if (!owner) redirect('/owners/login')

  const payload = await getPayload()
  const { docs: claimedStores } = await payload.find({
    collection: 'stores',
    where: { owner: { equals: owner.id } },
    limit: 50,
    depth: 0,
  })

  return (
    <main className="container" style={{ padding: '40px 32px 120px', maxWidth: 960 }}>
      <div
        className="row"
        style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}
      >
        <div>
          <span className="eyebrow">Owner dashboard</span>
          <h1 className="display" style={{ fontSize: 40, margin: '8px 0 4px' }}>
            Welcome back{owner.name ? `, ${owner.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mono dim" style={{ fontSize: 12 }}>
            Signed in as {owner.email} · Plan: <strong>{PLAN_LABEL[owner.plan]}</strong>
          </p>
        </div>
        <form action={ownerLogout}>
          <button type="submit" className="btn" style={{ fontSize: 13 }}>
            Sign out
          </button>
        </form>
      </div>

      <section
        className="card card-pad"
        style={{
          marginBottom: 32,
          background:
            owner.plan === 'free'
              ? 'linear-gradient(135deg, var(--bg-2) 0%, color-mix(in oklab, var(--accent) 8%, var(--bg-2)) 100%)'
              : 'var(--bg-2)',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--accent)' }}>
              Current plan · {PLAN_LABEL[owner.plan]}
            </span>
            <h3 className="serif" style={{ fontSize: 22, margin: '8px 0 4px' }}>
              {owner.plan === 'free'
                ? 'Upgrade to Verified for ₹999/mo'
                : owner.plan === 'verified'
                  ? 'Upgrade to Featured for top placement'
                  : 'You are on the Featured plan'}
            </h3>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              {owner.plan === 'free'
                ? 'Get a verified badge, owner replies on reviews, and analytics.'
                : owner.plan === 'verified'
                  ? 'Featured stores appear in homepage rotation and at the top of city listings.'
                  : 'Thanks for supporting Mybooz. Renews automatically.'}
            </p>
          </div>
          {owner.plan !== 'featured' && (
            <CheckoutButton targetPlan={owner.plan === 'free' ? 'verified' : 'featured'} />
          )}
        </div>
      </section>

      <h2 className="serif" style={{ fontSize: 22, marginBottom: 16 }}>
        Your claimed stores ({claimedStores.length})
      </h2>

      {claimedStores.length === 0 ? (
        <div className="card card-pad">
          <p style={{ margin: '0 0 12px' }}>
            You haven&apos;t claimed any stores yet. Submit a claim through the public Owners form
            and our admin team will link it to your account within 1–2 business days.
          </p>
          <Link href="/owners" className="btn primary">
            Submit a claim
          </Link>
        </div>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          {claimedStores.map((s) => (
            <Link
              key={s.id}
              href={`/owners/dashboard/stores/${s.id}`}
              className="card card-pad"
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{s.name}</strong>
                  <div className="mono dim" style={{ fontSize: 12, marginTop: 4 }}>
                    {s.area} · {s.city} · {s.verified ? '✓ verified' : 'pending verification'}
                  </div>
                </div>
                <span className="mono dim">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
