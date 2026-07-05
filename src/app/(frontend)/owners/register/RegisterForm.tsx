'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { registerOwner, type AuthState } from '../dashboard/actions'

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
      {pending ? 'Creating…' : 'Create account'}
    </button>
  )
}

export default function RegisterForm() {
  const [state, formAction] = useActionState<AuthState | undefined, FormData>(
    registerOwner,
    undefined,
  )

  if (state?.sent) {
    return (
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
        Account created. Check your email for a sign-in link to finish logging in. It expires in 15
        minutes.
      </p>
    )
  }

  return (
    <form action={formAction} className="stack" style={{ gap: 14 }}>
      {state?.error && (
        <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13 }}>{state.error}</p>
      )}
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          FULL NAME
        </span>
        <input type="text" name="name" required style={inputStyle} />
      </label>
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          EMAIL
        </span>
        <input type="email" name="email" required autoComplete="email" style={inputStyle} />
      </label>
      <label className="stack" style={{ gap: 6 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>
          PHONE
        </span>
        <input type="tel" name="phone" autoComplete="tel" style={inputStyle} />
      </label>
      <SubmitButton />
    </form>
  )
}
