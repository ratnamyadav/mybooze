export type Metric = {
  label: string
  value: number
  /** Percentage change vs the previous window; null = no prior baseline. */
  deltaPct: number | null
}

function deltaText(deltaPct: number | null): { text: string; color: string } {
  if (deltaPct === null) return { text: '—', color: 'var(--fg-3, var(--fg-2))' }
  const sign = deltaPct > 0 ? '+' : ''
  const color = deltaPct > 0 ? 'var(--good)' : deltaPct < 0 ? 'var(--accent-2)' : 'var(--fg-2)'
  return { text: `${sign}${deltaPct}%`, color }
}

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: 12 }}
    >
      {metrics.map((m) => {
        const d = deltaText(m.deltaPct)
        return (
          <div key={m.label}>
            <span className="mono dim" style={{ fontSize: 10 }}>
              {m.label.toUpperCase()}
            </span>
            <p className="display" style={{ fontSize: 24, margin: '4px 0 0' }}>
              {m.value.toLocaleString('en-IN')}
            </p>
            <span className="mono" style={{ fontSize: 10, color: d.color }}>
              {d.text}
            </span>
          </div>
        )
      })}
    </div>
  )
}
