import 'server-only'
import { Resend } from 'resend'
import * as Sentry from '@sentry/nextjs'
import { childLogger } from '@/lib/logger'

const log = childLogger({ scope: 'email' })

let client: Resend | null = null

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

function resend(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY!)
  }
  return client
}

/**
 * Send a passwordless sign-in link.
 *
 * Without RESEND_API_KEY + EMAIL_FROM the link is logged to the console so the
 * flow stays usable in development (mirrors the razorpay/posthog no-op pattern).
 */
export async function sendMagicLink({ to, url }: { to: string; url: string }): Promise<void> {
  if (!isEmailConfigured()) {
    log.info({ to, url }, 'magic_link_dev')
    return
  }

  try {
    const { error } = await resend().emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: 'Your Mybooz sign-in link',
      text: `Click the link below to sign in to your Mybooz owner account.\n\n${url}\n\nThis link expires in 15 minutes. If you didn't request it, you can ignore this email.`,
      html: `
        <p>Click the link below to sign in to your Mybooz owner account.</p>
        <p><a href="${url}">Sign in to Mybooz</a></p>
        <p style="color:#888;font-size:13px">This link expires in 15 minutes. If you didn't request it, you can ignore this email.</p>
      `,
    })
    if (error) throw error
    log.info({ to }, 'magic_link_sent')
  } catch (err) {
    log.error({ err, to }, 'magic_link_send_failed')
    Sentry.captureException(err, { tags: { action: 'sendMagicLink' } })
    throw new Error('Could not send the sign-in email. Please try again.')
  }
}
