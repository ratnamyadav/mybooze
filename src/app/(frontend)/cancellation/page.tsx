import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Cancellation Policy · Mybooz',
  description:
    'Mybooz Directory does not sell alcohol. This page explains cancellation handling for store-owner subscriptions and editorial submissions on the platform.',
}

const LAST_UPDATED = 'April 28, 2026'

export default function CancellationPage() {
  return (
    <LegalPage
      slug="cancellation"
      title="Cancellation & Refund Policy"
      lastUpdated={LAST_UPDATED}
      intro="Mybooz Directory is a content and discovery platform — we do not sell or deliver alcohol. This policy covers cancellation handling for the services Mybooz does offer: store listings, owner subscriptions, and editorial submissions."
      sections={[
        {
          heading: '1. Mybooz does not sell alcohol',
          body: (
            <p>
              Mybooz is not a vendor. We do not process orders, accept payments for alcoholic
              beverages, or arrange delivery. Any purchase you make happens directly between you
              and a licensed retailer. Cancellation, refund, and return requests for actual
              purchases must be raised with the retailer directly under their policy.
            </p>
          ),
        },
        {
          heading: '2. Store-owner subscriptions',
          body: (
            <ul style={{ paddingLeft: 20 }}>
              <li>
                <strong>Free Listing tier</strong> — no charge, no cancellation required. You may
                request removal of your listing at any time by emailing{' '}
                <a href="mailto:owners@mybooz.in">owners@mybooz.in</a>.
              </li>
              <li>
                <strong>Verified and Featured tiers</strong> (paid plans, when available) — you
                may cancel at any time from your owner dashboard. Cancellation takes effect at
                the end of the current billing cycle.
              </li>
              <li>
                <strong>Refunds</strong> — paid plans are refundable on a pro-rata basis within
                7 days of payment if no Verified or Featured benefit has been activated.
                Activated plans are non-refundable for the current billing cycle, but you may
                cancel further renewals.
              </li>
            </ul>
          ),
        },
        {
          heading: '3. Editorial submissions',
          body: (
            <p>
              User-submitted reviews and store-claim requests can be withdrawn before publication
              by emailing the address below. Once a review or claim has been published, it can be
              taken down on request, but Mybooz reserves the right to retain a record of the
              submission for moderation and audit purposes.
            </p>
          ),
        },
        {
          heading: '4. Listing removal',
          body: (
            <p>
              If you are a verified owner of a listed store and wish to have your listing removed
              entirely from the directory, email{' '}
              <a href="mailto:owners@mybooz.in">owners@mybooz.in</a> from a domain or contact
              point that matches the verified listing. We aim to action verified removal requests
              within 7 working days.
            </p>
          ),
        },
        {
          heading: '5. Disputes',
          body: (
            <p>
              For any dispute regarding cancellation, refund, or removal, please first contact us
              at <a href="mailto:hello@mybooz.in">hello@mybooz.in</a>. If a resolution cannot be
              reached, the dispute will be governed by the Terms &amp; Conditions and the laws of
              India.
            </p>
          ),
        },
      ]}
    />
  )
}
