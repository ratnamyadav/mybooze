const R = 6371 // earth radius in km

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(x))
}

export function directionsUrl(lat: number, lng: number, label?: string): string {
  const dest = `${lat},${lng}`
  const q = label ? `&destination_place_id=${encodeURIComponent(label)}` : ''
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}${q}`
}

export function parseLatLng(s: string | null): { lat: number; lng: number } | null {
  if (!s) return null
  const [latS, lngS] = s.split(',')
  const lat = Number.parseFloat(latS)
  const lng = Number.parseFloat(lngS)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return { lat, lng }
}
