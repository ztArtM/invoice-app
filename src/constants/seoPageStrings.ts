import type { SeoLocale } from './seoLocaleRoutes'

/** Primary CTA on marketing SEO pages (matches route language, not global UI language). */
export function ctaStartInvoice(locale: SeoLocale): string {
  return locale === 'da' ? 'Lav faktura nu' : 'Create invoice'
}

export function ctaStartQuote(locale: SeoLocale): string {
  return locale === 'da' ? 'Lav tilbud nu' : 'Create quote'
}

/**
 * Honest, generic freshness line for article-style guides (no fabricated dates).
 * Use only on pages with `schema: 'article'` in `SEO_PAGE_DEFINITIONS`.
 */
export function getArticleFreshnessLine(locale: SeoLocale): string {
  return locale === 'da' ? 'Indholdet opdateres løbende.' : 'This guide is updated from time to time.'
}
