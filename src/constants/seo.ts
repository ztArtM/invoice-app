import { appMeta } from './appMeta'

/**
 * Canonical site URL for Open Graph, Twitter, sitemap, and JSON-LD.
 * Set `VITE_SITE_URL` in production (e.g. https://example.com — no trailing slash).
 */
export function getSiteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL?.trim()
  if (raw) return raw.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'http://localhost:5173'
}

/** Absolute URL for the single-page app root (trailing slash). */
export function getCanonicalSiteUrl(): string {
  return `${getSiteOrigin()}/`
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
