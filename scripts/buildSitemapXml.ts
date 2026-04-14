/**
 * Builds a valid https://www.sitemaps.org/schemas/sitemap/0.9 `urlset` document.
 * Used at build time by Vite (`vite.config.ts`).
 * Only real path URLs — no hash fragments.
 */

export type SitemapChangefreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export type SitemapUrlEntry = {
  /** Path after origin, e.g. `/` or `/privacy`. */
  path: string
  changefreq: SitemapChangefreq
  /** 0.0–1.0 */
  priority: number
}

/**
 * Canonical indexable paths (no `#` fragments).
 * Built into `dist/sitemap.xml` at bundle time (`vite.config.ts`).
 * SEO paths included: marketing landings + article guides below + `/builder` + legal.
 */
export const PUBLIC_SITEMAP_ENTRIES: SitemapUrlEntry[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/en/', changefreq: 'weekly', priority: 1.0 },
  { path: '/gratis-faktura-program', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/free-invoice-software', changefreq: 'monthly', priority: 0.85 },
  { path: '/lav-faktura-online', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/create-invoice-online', changefreq: 'monthly', priority: 0.85 },
  { path: '/faktura-skabelon', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/invoice-template', changefreq: 'monthly', priority: 0.85 },
  { path: '/gratis-faktura-skabelon', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/free-invoice-template', changefreq: 'monthly', priority: 0.85 },
  { path: '/hvordan-laver-man-en-faktura', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/how-to-make-an-invoice', changefreq: 'monthly', priority: 0.85 },
  { path: '/hvad-skal-en-faktura-indeholde', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/what-should-an-invoice-include', changefreq: 'monthly', priority: 0.85 },
  { path: '/faktura-uden-cvr', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/invoice-without-cvr', changefreq: 'monthly', priority: 0.85 },
  { path: '/faktura-til-freelancer', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/invoice-for-freelancers', changefreq: 'monthly', priority: 0.85 },
  { path: '/tilbud-skabelon', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/quote-template', changefreq: 'monthly', priority: 0.85 },
  { path: '/tilbud-vs-faktura', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/quote-vs-invoice', changefreq: 'monthly', priority: 0.85 },
  { path: '/faktura-skabelon-vs-online-faktura-program', changefreq: 'monthly', priority: 0.85 },
  { path: '/en/invoice-template-vs-online-invoicing', changefreq: 'monthly', priority: 0.85 },
  { path: '/builder', changefreq: 'weekly', priority: 0.9 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.6 },
  { path: '/terms', changefreq: 'yearly', priority: 0.6 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
  { path: '/cookies', changefreq: 'yearly', priority: 0.5 },
]

function escapeXmlText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function normalizeBaseUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, '')
}

function joinOriginAndPath(origin: string, path: string): string {
  if (path === '/') {
    return `${origin}/`
  }
  if (path.startsWith('/')) {
    return `${origin}${path}`
  }
  return `${origin}/${path}`
}

/**
 * @param lastmod - W3C date (YYYY-MM-DD recommended for sitemaps)
 */
export function buildSitemapXml(options: {
  siteUrl: string
  entries?: SitemapUrlEntry[]
  lastmod?: string
}): string {
  const origin = normalizeBaseUrl(options.siteUrl)
  const entries = options.entries ?? PUBLIC_SITEMAP_ENTRIES
  const lastmod = options.lastmod ?? new Date().toISOString().slice(0, 10)

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ]

  const seen = new Set<string>()
  for (const e of entries) {
    const loc = joinOriginAndPath(origin, e.path)
    if (seen.has(loc)) continue
    seen.add(loc)
    const priority = Math.min(1, Math.max(0, e.priority))
    const priorityOut = (Math.round(priority * 100) / 100).toFixed(2).replace(/\.?0+$/, '') || '0'
    lines.push(`  <url>`)
    lines.push(`    <loc>${escapeXmlText(loc)}</loc>`)
    lines.push(`    <lastmod>${escapeXmlText(lastmod)}</lastmod>`)
    lines.push(`    <changefreq>${e.changefreq}</changefreq>`)
    lines.push(`    <priority>${priorityOut}</priority>`)
    lines.push(`  </url>`)
  }

  lines.push(`</urlset>`)
  lines.push('')
  return lines.join('\n')
}
