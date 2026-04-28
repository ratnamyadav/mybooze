type Props = { label: string; value: string }

export function Stat({ label, value }: Props) {
  return (
    <div>
      <div className="display" style={{ fontSize: 36, color: 'var(--accent)' }}>
        {value}
      </div>
      <div className="mono dim" style={{ fontSize: 11, marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}
