'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { requestOwnerMagicLink, type AuthState } from '../dashboard/actions'

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 15,
  color: 'var(--fg)',
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn primary" style={{ marginTop: 8 }} disabled={pending}>
      {pending ? 'Sending…' : 'Email me a sign-in link'}
    </button>
  )
}

export default function LoginForm({ linkExpired }: { linkExpired?: boolean }) {
  const [state, formAction] = useActionState<AuthState | undefined, FormData>(
    requestOwnerMagicLink,
    undefined,
  )

  if (state?.sent) {
    return (
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
        Check your email for a sign-in link. It expires in 15 minutes. If you don&apos;t see it,
        check spam or try again.
      </p>
    )
  }

  return (
    <form action={formAction} className="stack" style={{ gap: 14 }}>
      {linkExpired && (
        <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13 }}>
          That sign-in link was invalid or expired. Request a new one below.
        </p>
      )}
      {state?.error && (
        <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13 }}>{state.error}</p>
      )}
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          EMAIL
        </span>
        <input type="email" name="email" required autoComplete="email" style={inputStyle} />
      </label>
      <SubmitButton />
    </form>
  )
}
