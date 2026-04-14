import { appMeta } from './appMeta'

/**
 * Canonical site origin for Open Graph, Twitter, JSON-LD, and hreflang/canonical URLs.
 *
 * Resolution order:
 * 1. `VITE_SITE_URL` from the build (set in production deploys) — stable in the bundle.
 * 2. In the browser when unset: `window.location.origin` — matches the live host (fine for deployed SPA).
 * 3. Last resort (tests / non-browser): `http://localhost:5173` — not used for real users in production.
 *
 * Set `VITE_SITE_URL` in hosting (no trailing slash) so build-time metadata and `dist/sitemap.xml` stay aligned.
 */
export function getSiteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL?.trim()
  if (raw) return raw.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'http://localhost:5173'
}

/** Absolute URL for the site root (`/`). */
export function getCanonicalSiteUrl(): string {
  return `${getSiteOrigin()}/`
}

/**
 * Canonical absolute URL for a pathname (e.g. `/privacy`, `/builder`).
 * Root `/` yields `origin/` with trailing slash.
 */
export function getCanonicalUrlForPath(pathname: string): string {
  const origin = getSiteOrigin()
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (path === '/') {
    return `${origin}/`
  }
  return `${origin}${path}`
}

/** Optional full URL to a PNG/JPG/WebP used for og:image and Twitter when set. */
export function getOgImageAbsoluteUrl(): string | null {
  const explicit = import.meta.env.VITE_OG_IMAGE_URL?.trim()
  if (explicit) return explicit
  return null
}

export const seoConstants = {
  /** Theme for browser chrome; keep in sync with `theme-color` meta. */
  themeColor: '#142f86',
  /** Twitter @username without @ — set via VITE_TWITTER_SITE when you have a handle. */
  twitterSite: import.meta.env.VITE_TWITTER_SITE?.trim()?.replace(/^@/, '') ?? '',
  /** Human-readable product name for structured data (uses app branding). */
  productName: appMeta.appName,
} as const
