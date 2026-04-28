'use client'

import { useState, useTransition } from 'react'
import { submitClaim } from './claimAction'

function Input({
  name,
  label,
  placeholder,
  required,
}: {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label style={{ display: 'block' }}>
      <span
        className="mono dim"
        style={{ fontSize: 10, display: 'block', marginBottom: 6 }}
      >
        {label.toUpperCase()}
        {required && ' *'}
      </span>
      <input className="field" name={name} placeholder={placeholder} required={required} />
    </label>
  )
}

export function ClaimForm() {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null)

  return (
    <form
      className="card card-pad"
      style={{ padding: 32 }}
      action={(formData) =>
        start(async () => {
          const r = await submitClaim(formData)
          setResult(r)
        })
      }
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}
      >
        <Input name="name" label="Store name" placeholder="e.g. The Cellar" required />
        <Input name="license" label="License number" placeholder="L-1 / L-2 / FL-2" />
        <Input name="city" label="City" placeholder="Greater Noida" required />
        <Input name="area" label="Area" placeholder="Pari Chowk" required />
        <Input name="ownerName" label="Owner name" placeholder="Full name" />
        <Input name="phone" label="Phone" placeholder="+91" />
        <div style={{ gridColumn: 'span 2' }}>
          <Input name="address" label="Address" placeholder="Full registered address" required />
        </div>
      </div>
      <label
        className="row gap-2"
        style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 20 }}
      >
        <input type="checkbox" name="consent" required /> I confirm I am the owner / authorised
        manager and hold a valid license.
      </label>
      <button
        type="submit"
        className="btn primary lg"
        style={{ marginTop: 20, width: '100%' }}
        disabled={pending}
      >
        {pending ? 'Submitting…' : 'Submit for verification'}
      </button>
      {result?.ok && (
        <p
          className="rd-notice"
          style={{ marginTop: 20, borderLeftColor: 'var(--good)' }}
        >
          Thank you — your submission is pending review. We&apos;ll verify your license within
          24–48 hours.
        </p>
      )}
      {result && !result.ok && (
        <p className="rd-notice" style={{ marginTop: 20 }}>
          {result.error ?? 'Something went wrong. Please try again.'}
        </p>
      )}
    </form>
  )
}
