type Pin = { x: number; y: number; label: string; href?: string }

type Props = {
  pins?: Pin[]
  height?: number | string
}

export function MapPlaceholder({ pins = [], height = 480 }: Props) {
  return (
    <div
      className="map-bg"
      style={{
        position: 'relative',
        height,
        borderRadius: 10,
        border: '1px solid var(--line-soft)',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 480"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--line)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="480" fill="url(#grid)" />
        <path
          d="M0 240 Q200 180 400 220 T800 200"
          stroke="var(--line)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0 320 Q300 280 500 310 T800 300"
          stroke="var(--line)"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
      </svg>
      {pins.map((p, i) => {
        const Pin = p.href ? 'a' : 'span'
        return (
          <Pin
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            href={p.href}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -100%)',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              padding: '4px 10px',
              borderRadius: 999,
              fontFamily: 'var(--mono)',
              fontSize: 11,
              fontWeight: 600,
              border: '2px solid var(--bg)',
              boxShadow: '0 4px 12px rgba(0,0,0,.3)',
              cursor: p.href ? 'pointer' : 'default',
              textDecoration: 'none',
            }}
          >
            {p.label}
          </Pin>
        )
      })}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          padding: '6px 10px',
          background: 'var(--bg)',
          borderRadius: 4,
          border: '1px solid var(--line)',
        }}
      >
        <span className="mono dim" style={{ fontSize: 10 }}>
          MAP — DELHI NCR
        </span>
      </div>
    </div>
  )
}
