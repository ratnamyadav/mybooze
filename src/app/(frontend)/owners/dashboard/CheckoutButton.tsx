'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckoutSession } from './checkoutAction'
import type { Plan } from '@/lib/razorpay'

type Props = {
  targetPlan: Plan
}

const LABEL: Record<Plan, string> = {
  verified: 'Upgrade to Verified',
  featured: 'Upgrade to Featured',
}

const DESCRIPTION: Record<Plan, string> = {
  verified: 'Verified plan — ₹999/mo',
  featured: 'Featured plan — ₹2999/mo',
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

/** Inject checkout.js once and resolve when `window.Razorpay` is ready. */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SRC}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('script error')), {
        once: true,
      })
      // Already loaded between query and listener attach.
      if (window.Razorpay) resolve()
      return
    }
    const script = document.createElement('script')
    script.src = CHECKOUT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'))
    document.body.appendChild(script)
  })
}

export function CheckoutButton({ targetPlan }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const onClick = async () => {
    setErr(null)
    setNotice(null)
    setBusy(true)

    const result = await createCheckoutSession(targetPlan)
    if (!result.ok) {
      setErr(result.error)
      setBusy(false)
      return
    }

    try {
      await loadRazorpayScript()
    } catch {
      // Script blocked/failed — fall back to the hosted page.
      if (result.shortUrl) {
        window.open(result.shortUrl, '_blank', 'noopener,noreferrer')
      } else {
        setErr(
          `Subscription ${result.subscriptionId} created. Check your email for the payment link.`,
        )
      }
      setBusy(false)
      return
    }

    const rzp = new window.Razorpay({
      key: result.keyId,
      subscription_id: result.subscriptionId,
      name: 'Mybooz',
      description: DESCRIPTION[targetPlan],
      prefill: result.prefill,
      theme: { color: '#D4A537' },
      handler: () => {
        // The signed webhook is the source of truth for activation; just nudge the UI.
        setNotice('Payment received — activating your plan…')
        router.refresh()
        setBusy(false)
      },
      modal: {
        ondismiss: () => setBusy(false),
      },
    })
    rzp.open()
  }

  return (
    <div className="stack" style={{ gap: 6, alignItems: 'flex-end' }}>
      <button type="button" onClick={onClick} disabled={busy} className="btn primary">
        {busy ? 'Starting…' : LABEL[targetPlan]}
      </button>
      {notice && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', maxWidth: 280, textAlign: 'right' }}>
          {notice}
        </span>
      )}
      {err && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent-2)', maxWidth: 280, textAlign: 'right' }}>
          {err}
        </span>
      )}
    </div>
  )
}
