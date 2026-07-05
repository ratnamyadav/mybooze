// Minimal ambient types for the Razorpay drop-in checkout (checkout.js).
// Loaded lazily at runtime; only the subset of options we use is declared.

export interface RazorpayOptions {
  key: string
  /** Use for subscription checkout (mutually exclusive with order_id). */
  subscription_id?: string
  order_id?: string
  name?: string
  description?: string
  image?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  handler?: (response: {
    razorpay_payment_id: string
    razorpay_subscription_id?: string
    razorpay_order_id?: string
    razorpay_signature: string
  }) => void
  modal?: {
    ondismiss?: () => void
    escape?: boolean
    backdropclose?: boolean
  }
}

export interface RazorpayInstance {
  open(): void
  close(): void
  on(event: string, handler: (response: unknown) => void): void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
