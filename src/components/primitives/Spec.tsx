type Props = { label: string; value: string }

export function Spec({ label, value }: Props) {
  return (
    <div>
      <span className="mono dim" style={{ fontSize: 10 }}>
        {label.toUpperCase()}
      </span>
      <p style={{ fontSize: 14, margin: '4px 0 0', color: 'var(--fg)' }}>{value}</p>
    </div>
  )
}
