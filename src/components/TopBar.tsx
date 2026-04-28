import Link from 'next/link'
import { Logo } from './Logo'

type NavItem = { key: string; label: string; href: string }

type Props = {
  items: NavItem[]
  active?: string
}

export function TopBar({ items, active }: Props) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Logo />
        <nav className="nav" aria-label="Primary">
          {items.map(({ key, label, href }) => (
            <Link key={key} href={href} className={active === key ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="row gap-3">
          <Link href="/stores" className="btn ghost sm" aria-label="Search stores">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            Search
          </Link>
          <Link href="/owners" className="btn sm">
            List your store
          </Link>
        </div>
      </div>
    </header>
  )
}
