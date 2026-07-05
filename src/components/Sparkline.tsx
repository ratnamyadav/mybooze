// Lightweight inline-SVG trend line — no charting dependency. Mirrors the hand-rolled
// sparkline used on the owners marketing page.
type Props = {
  values: number[]
  height?: number
}

export function Sparkline({ values, height = 80 }: Props) {
  const w = 300
  const h = height
  const n = values.length
  const max = Math.max(1, ...values)

  if (n === 0) {
    return (
      <div
        className="mono dim"
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          background: 'var(--bg-3)',
          borderRadius: 6,
        }}
      >
        No activity yet
      </div>
    )
  }

  const pts = values.map((v, i) => {
    const x = n <= 1 ? w / 2 : (i / (n - 1)) * w
    const y = h - (v / max) * (h - 8) - 4
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w} ${h} L0 ${h} Z`

  return (
    <div style={{ height, background: 'var(--bg-3)', borderRadius: 6, overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={area} fill="color-mix(in oklab, var(--accent) 15%, transparent)" />
        <path d={line} stroke="var(--accent)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}
