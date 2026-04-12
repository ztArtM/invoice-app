export type InfoRoute = 'privacy' | 'terms' | 'contact' | 'cookies'

/** Path segment for each legal route (no leading slash). */
export const INFO_ROUTE_PATH: Record<InfoRoute, string> = {
  privacy: 'privacy',
  terms: 'terms',
  contact: 'contact',
  cookies: 'cookies',
}

export function pathForInfoRoute(route: InfoRoute): string {
  return `/${INFO_ROUTE_PATH[route]}`
}

export function getLegacyInfoRouteFromHash(hash: string): InfoRoute | null {
  const clean = hash.replace(/^#/, '').trim().toLowerCase()
  if (clean === 'privacy') return 'privacy'
  if (clean === 'terms') return 'terms'
  if (clean === 'contact') return 'contact'
  if (clean === 'cookies') return 'cookies'
  return null
}

export function getLegalRouteFromPath(pathname: string): InfoRoute | null {
  const p = pathname.replace(/\/$/, '') || '/'
  if (p === '/privacy') return 'privacy'
  if (p === '/terms') return 'terms'
  if (p === '/contact') return 'contact'
  if (p === '/cookies') return 'cookies'
  return null
}

