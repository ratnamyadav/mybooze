import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy · Mybooz',
  description:
    'How Mybooz Directory, a product of Nextfly Technologies, collects, uses, and protects information when you browse and contact stores listed on our platform.',
}

const LAST_UPDATED = 'April 28, 2026'

export default function PrivacyPage() {
  return (
    <LegalPage
      slug="privacy"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="This policy explains what information Mybooz Directory collects when you visit our site, how we use it, and the choices you have. Mybooz is a discovery and content platform — we do not sell or deliver alcohol."
      sections={[
        {
          heading: '1. Who we are',
          body: (
            <p>
              &ldquo;Mybooz&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo; refers to the Mybooz
              Directory product, owned and operated by{' '}
              <strong>Nextfly Technologies Pvt. Ltd.</strong> (&ldquo;Nextfly&rdquo;), with offices
              in Greater Noida, Uttar Pradesh, India.
            </p>
          ),
        },
        {
          heading: '2. Information we collect',
          body: (
            <ul style={{ paddingLeft: 20 }}>
              <li>
                <strong>Browsing data</strong> — pages visited, device, browser, approximate
                location (city-level, derived from IP), and timestamps. Used for analytics and
                fraud detection.
              </li>
              <li>
                <strong>Age-gate confirmation</strong> — a non-identifying cookie
                (<code>mybooz_age_ok</code>) recording that you confirmed you are of legal drinking
                age. Cookie expires after 30 days.
              </li>
              <li>
                <strong>Reviews and submissions</strong> — name, email (if provided), and the
                content you submit when posting a review or submitting a store-claim form via the
                Owners page.
              </li>
              <li>
                <strong>Store-owner submissions</strong> — business name, address, license number,
                contact details when you submit a claim request.
              </li>
            </ul>
          ),
        },
        {
          heading: '3. How we use information',
          body: (
            <ul style={{ paddingLeft: 20 }}>
              <li>To operate the directory, surface relevant stores and content.</li>
              <li>To verify store-owner claims against publicly available licensing records.</li>
              <li>To moderate user-submitted reviews for spam, abuse, and policy violations.</li>
              <li>To improve site performance and editorial coverage.</li>
              <li>
                To send transactional emails (e.g. claim status updates) — we do not send marketing
                email without explicit opt-in.
              </li>
            </ul>
          ),
        },
        {
          heading: '4. Sharing',
          body: (
            <p>
              We do not sell personal information. We share data only with infrastructure
              processors required to operate the service (hosting, database, object storage,
              email delivery). Payment processors are not used — Mybooz does not transact in
              alcohol.
            </p>
          ),
        },
        {
          heading: '5. Cookies',
          body: (
            <p>
              We use essential cookies for the age gate and editorial admin sessions. We do not
              currently use third-party advertising or marketing cookies. You can clear cookies
              from your browser at any time; the age gate will reappear on your next visit.
            </p>
          ),
        },
        {
          heading: '6. Data retention',
          body: (
            <p>
              Browsing logs are retained for 90 days. User-submitted reviews and store-claim
              records are retained for as long as the listing remains active. You may request
              deletion of your account or submissions by emailing the address below.
            </p>
          ),
        },
        {
          heading: '7. Your rights',
          body: (
            <p>
              You may request access to, correction of, or deletion of any personal information
              we hold about you, subject to applicable law. Email{' '}
              <a href="mailto:privacy@mybooz.in">privacy@mybooz.in</a> with your request.
            </p>
          ),
        },
        {
          heading: '8. Children',
          body: (
            <p>
              Mybooz is for adults of legal drinking age in their state of residence (21+ in most
              Indian states). We do not knowingly collect information from minors. If you believe
              we have, contact us immediately and we will delete it.
            </p>
          ),
        },
        {
          heading: '9. Changes to this policy',
          body: (
            <p>
              We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at
              the top of this page indicates when the most recent changes were made. Material
              changes will be announced via a banner on the homepage for at least 14 days.
            </p>
          ),
        },
      ]}
    />
  )
}
