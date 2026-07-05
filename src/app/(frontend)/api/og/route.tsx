import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const KIND_LABEL: Record<string, string> = {
  store: 'Store',
  bottle: 'Bottle',
  guide: 'Guide',
  category: 'Spirit category',
  page: 'Mybooz',
}

const COLORS = {
  bg: '#1f1c17',
  bg2: '#272320',
  accent: '#d6a85a',
  accentInk: '#1f1c17',
  fg: '#f0e9dc',
  fg2: '#c5b9a3',
  fg3: '#8e8472',
  line: '#3a342c',
} as const

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'Mybooz').slice(0, 140)
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 180)
  const kind = (searchParams.get('kind') ?? 'page').toLowerCase()
  const eyebrow = (searchParams.get('eyebrow') ?? KIND_LABEL[kind] ?? 'Mybooz').slice(0, 60)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: COLORS.bg,
          backgroundImage: `radial-gradient(circle at 85% 15%, ${COLORS.bg2} 0%, ${COLORS.bg} 60%)`,
          color: COLORS.fg,
          padding: '64px 72px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: COLORS.accent,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              display: 'flex',
              width: 36,
              height: 36,
              borderRadius: 8,
              background: COLORS.accent,
              color: COLORS.accentInk,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            M
          </span>
          <span>Mybooz</span>
          <span style={{ color: COLORS.fg3, marginLeft: 16 }}>·</span>
          <span style={{ color: COLORS.fg3 }}>{eyebrow}</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            gap: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? 64 : 84,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              fontWeight: 600,
              color: COLORS.fg,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: COLORS.fg2,
                lineHeight: 1.35,
                maxWidth: '85%',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 28,
            borderTop: `1px solid ${COLORS.line}`,
            color: COLORS.fg3,
            fontSize: 22,
          }}
        >
          <span>mybooz.in</span>
          <span style={{ color: COLORS.accent }}>India's editorial liquor directory</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
