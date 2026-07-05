import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentOwner } from '@/lib/owner-auth'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Create owner account · Mybooz',
  description: 'Register as a store owner to claim and manage your Mybooz listing.',
  robots: { index: false, follow: false },
}

export default async function OwnerRegisterPage() {
  const owner = await getCurrentOwner()
  if (owner) redirect('/owners/dashboard')

  return (
    <main className="container" style={{ padding: '40px 32px 120px', maxWidth: 480 }}>
      <span className="eyebrow">For owners</span>
      <h1 className="display" style={{ fontSize: 40, margin: '12px 0 16px' }}>
        Create an owner account
      </h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>
        Free to register. We&apos;ll email you a secure sign-in link — no password needed. After
        signing up, submit a claim against one of your store listings to unlock self-serve editing.
      </p>
      <RegisterForm />
      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        Already have an account? <Link href="/owners/login">Sign in</Link>.
      </p>
    </main>
  )
}
