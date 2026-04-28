import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Mybooz home">
      <span>
        my<span className="dot"></span>booz
      </span>
      <small>directory · est. 2026</small>
    </Link>
  )
}
