import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms & Conditions · Mybooz',
  description:
    'The terms governing your use of Mybooz Directory, a content and discovery platform owned by Nextfly Technologies. Mybooz does not sell or deliver alcohol.',
}

const LAST_UPDATED = 'April 28, 2026'

export default function TermsPage() {
  return (
    <LegalPage
      slug="terms"
      title="Terms & Conditions"
      lastUpdated={LAST_UPDATED}
      intro="These terms govern your use of the Mybooz Directory website. By browsing or submitting content to the site, you agree to these terms."
      sections={[
        {
          heading: '1. About Mybooz',
          body: (
            <p>
              Mybooz Directory (&ldquo;Mybooz&rdquo;, &ldquo;the Service&rdquo;) is a product
              owned and operated by <strong>Nextfly Technologies Pvt. Ltd.</strong>, an
              independent technology company. Mybooz is an editorial directory and content
              platform. Mybooz <strong>does not sell, deliver, or fulfill</strong> alcoholic
              beverages, and is not a party to any transaction between users and the licensed
              retail stores listed on the platform.
            </p>
          ),
        },
        {
          heading: '2. Eligibility',
          body: (
            <p>
              You must be of legal drinking age in your state of residence (21 years or older in
              most Indian states) to use this Service. By proceeding past the age gate, you
              represent that you meet this requirement.
            </p>
          ),
        },
        {
          heading: '3. User-submitted content',
          body: (
            <ul style={{ paddingLeft: 20 }}>
              <li>
                You retain ownership of reviews and submissions you make, but grant Mybooz a
                non-exclusive, worldwide, royalty-free licence to display and adapt them on the
                platform.
              </li>
              <li>
                You will not submit content that is unlawful, defamatory, infringing, hateful, or
                designed to deceive (including fake reviews, paid endorsements not disclosed, and
                automated submissions).
              </li>
              <li>
                We may remove or edit any submission, at our discretion, without prior notice.
              </li>
            </ul>
          ),
        },
        {
          heading: '4. Store listings and verification',
          body: (
            <p>
              Listings are compiled from publicly available licensing records and direct
              submissions. We make reasonable efforts to verify licensed retailers but cannot
              guarantee that listing details (hours, prices, stock) are current at any given
              moment. Always confirm with the store directly.
            </p>
          ),
        },
        {
          heading: '5. Pricing and availability',
          body: (
            <p>
              Prices shown are typical retail ranges sourced from public listings and store
              submissions. Actual prices vary by state, taxes, and store. Mybooz is not
              responsible for pricing discrepancies between the directory and the retailer at the
              time of purchase.
            </p>
          ),
        },
        {
          heading: '6. Editorial content',
          body: (
            <p>
              Tasting notes, guides, and recommendations are editorial opinion intended for
              consumer education. They are not professional advice. Excessive alcohol consumption
              is harmful to health.
            </p>
          ),
        },
        {
          heading: '7. Intellectual property',
          body: (
            <p>
              The Mybooz brand, design, editorial content, and software are owned by Nextfly
              Technologies Pvt. Ltd. or its licensors and are protected by Indian and
              international copyright and trademark law. You may not reproduce, redistribute, or
              create derivative works without written permission.
            </p>
          ),
        },
        {
          heading: '8. Disclaimers',
          body: (
            <p>
              The Service is provided on an &ldquo;as is&rdquo; basis. Mybooz makes no warranty as
              to the accuracy, completeness, or fitness for purpose of any listing or content. To
              the maximum extent permitted by law, Mybooz and Nextfly Technologies disclaim all
              implied warranties.
            </p>
          ),
        },
        {
          heading: '9. Limitation of liability',
          body: (
            <p>
              To the maximum extent permitted by law, Mybooz and Nextfly Technologies will not be
              liable for any indirect, incidental, special, consequential, or punitive damages
              arising from your use of the Service, including loss of profits, data, or goodwill.
            </p>
          ),
        },
        {
          heading: '10. Governing law',
          body: (
            <p>
              These terms are governed by the laws of India. Disputes will be subject to the
              exclusive jurisdiction of the courts of Gautam Buddh Nagar, Uttar Pradesh.
            </p>
          ),
        },
        {
          heading: '11. Changes',
          body: (
            <p>
              We may update these terms from time to time. Continued use of the Service after
              changes are posted constitutes acceptance of the revised terms. Material changes
              will be announced via a banner on the homepage for at least 14 days.
            </p>
          ),
        },
      ]}
    />
  )
}
