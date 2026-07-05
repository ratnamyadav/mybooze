import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentOwner } from '@/lib/owner-auth'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Owner login · Mybooz',
  description: 'Log in to manage your store listing on Mybooz.',
  robots: { index: false, follow: false },
}

export default async function OwnerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const owner = await getCurrentOwner()
  if (owner) redirect('/owners/dashboard')

  const { error } = await searchParams

  return (
    <main className="container" style={{ padding: '40px 32px 120px', maxWidth: 440 }}>
      <span className="eyebrow">For owners</span>
      <h1 className="display" style={{ fontSize: 40, margin: '12px 0 16px' }}>
        Owner sign in
      </h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>
        Enter your email and we&apos;ll send you a secure sign-in link — no password needed.
      </p>
      <LoginForm linkExpired={error === 'link_expired'} />
      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        New here? <Link href="/owners/register">Create an owner account</Link>.
      </p>
    </main>
  )
}
