export type InfoRoute = 'privacy' | 'terms' | 'contact' | 'cookies'

export function getInfoRouteFromHash(hash: string): InfoRoute | null {
  const clean = hash.replace(/^#/, '').trim().toLowerCase()
  if (clean === 'privacy') return 'privacy'
  if (clean === 'terms') return 'terms'
  if (clean === 'contact') return 'contact'
  if (clean === 'cookies') return 'cookies'
  return null
}

export function setInfoRouteHash(route: InfoRoute | null) {
  if (typeof window === 'undefined') return
  window.location.hash = route ? `#${route}` : ''
}

