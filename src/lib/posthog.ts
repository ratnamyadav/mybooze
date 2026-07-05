import 'server-only'
import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function posthogServer(): PostHog | null {
  const key = process.env.POSTHOG_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null

  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return client
}

export async function captureServer(
  event: string,
  properties?: Record<string, unknown>,
  distinctId = 'server',
) {
  const ph = posthogServer()
  if (!ph) return
  ph.capture({ distinctId, event, properties })
  await ph.flush().catch(() => {})
}
