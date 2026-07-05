import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentOwner } from '@/lib/owner-auth'
import { getPayload } from '@/lib/payload'
import { StoreEditForm } from './StoreEditForm'
import { InventoryEditor, type InventoryRow } from './InventoryEditor'
import { CheckoutButton } from '../../CheckoutButton'
import { MetricCards } from '@/components/MetricCards'
import { Sparkline } from '@/components/Sparkline'
import { canSeeDetailedAnalytics, getStoreAnalytics } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'Edit store · Owner dashboard',
  robots: { index: false, follow: false },
}

type Params = Promise<{ id: string }>

export default async function EditStorePage({ params }: { params: Params }) {
  const owner = await getCurrentOwner()
  if (!owner) redirect('/owners/login')

  const { id } = await params
  const storeId = Number(id)
  if (!Number.isInteger(storeId)) notFound()

  const payload = await getPayload()
  const store = await payload.findByID({ collection: 'stores', id: storeId, depth: 0 }).catch(() => null)
  if (!store) notFound()

  const ownerId = typeof store.owner === 'object' && store.owner ? store.owner.id : store.owner
  if (ownerId !== owner.id) {
    redirect('/owners/dashboard')
  }

  const { docs: inventoryDocs } = await payload.find({
    collection: 'store-inventory',
    where: { store: { equals: store.id } },
    limit: 200,
    depth: 1,
    sort: '-featured',
  })
  const inventory: InventoryRow[] = inventoryDocs.map((it) => {
    const bottle = typeof it.bottle === 'object' && it.bottle ? it.bottle : null
    return {
      id: it.id,
      bottleId: bottle?.id ?? (typeof it.bottle === 'number' ? it.bottle : 0),
      bottleName: bottle?.name ?? 'Unknown bottle',
      bottleBrand: bottle?.brand ?? '',
      priceInr: it.priceInr ?? null,
      inStock: Boolean(it.inStock),
      featured: Boolean(it.featured),
    }
  })

  const detailed = canSeeDetailedAnalytics(owner.plan)
  const analytics = await getStoreAnalytics(payload, store.id, { windowDays: 30, detailed })
  const metrics = [
    { label: 'Profile views', value: analytics.totals.view, deltaPct: analytics.deltaPct.view },
    { label: 'Calls', value: analytics.totals.call, deltaPct: analytics.deltaPct.call },
    { label: 'Direction taps', value: analytics.totals.directions, deltaPct: analytics.deltaPct.directions },
    { label: 'WhatsApp', value: analytics.totals.whatsapp, deltaPct: analytics.deltaPct.whatsapp },
  ]

  return (
    <main className="container" style={{ padding: '40px 32px 120px', maxWidth: 720 }}>
      <Link href="/owners/dashboard" className="mono dim" style={{ fontSize: 12 }}>
        ← Back to dashboard
      </Link>
      <h1 className="display" style={{ fontSize: 32, margin: '12px 0 8px' }}>
        {store.name}
      </h1>
      <p className="mono dim" style={{ fontSize: 12, marginBottom: 24 }}>
        {store.area} · {store.city} · {store.verified ? '✓ verified' : 'pending verification'}
      </p>

      <section className="card card-pad" style={{ marginBottom: 32 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>
            Analytics
          </h2>
          <span className="mono dim" style={{ fontSize: 11 }}>
            Last {analytics.windowDays} days
          </span>
        </div>

        <MetricCards metrics={metrics} />

        <div style={{ marginTop: 20 }}>
          {detailed ? (
            <>
              <span className="mono dim" style={{ fontSize: 10 }}>
                PROFILE VIEWS TREND
              </span>
              <div style={{ marginTop: 6 }}>
                <Sparkline values={analytics.daily.map((d) => d.view)} />
              </div>
            </>
          ) : (
            <div
              className="row"
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                padding: 16,
                border: '1px dashed var(--line)',
                borderRadius: 10,
                background: 'var(--bg-3)',
              }}
            >
              <p className="muted" style={{ fontSize: 13, margin: 0, maxWidth: '46ch' }}>
                Unlock daily trends, per-source breakdowns and longer history with a Verified plan.
              </p>
              <CheckoutButton targetPlan="verified" />
            </div>
          )}
        </div>
      </section>

      <StoreEditForm
        storeId={store.id}
        initial={{
          tagline: store.tagline ?? '',
          phone: store.phone ?? '',
          address: store.address,
          openNow: Boolean(store.openNow),
          pickup: Boolean(store.pickup),
          delivery: Boolean(store.delivery),
          parking: Boolean(store.parking),
        }}
      />
      <InventoryEditor storeId={store.id} items={inventory} />
    </main>
  )
}
