'use client'

import { useReportWebVitals } from 'next/web-vitals'
import posthog from 'posthog-js'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (!KEY) return
    posthog.capture('web_vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      navigation_type: metric.navigationType,
      path: window.location.pathname,
    })
  })
  return null
}
