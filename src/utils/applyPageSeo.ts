export interface PageSeoPayload {
  title: string
  description: string
  /** Absolute URL for `<link rel="canonical">` (per-route, e.g. `/privacy`). */
  canonicalUrl: string
  /** If set, used for `og:url`; defaults to `canonicalUrl`. */
  ogUrl?: string
  /** robots directive, e.g. `index, follow` or `noindex, follow`. */
  robots: string
  siteName: string
  locale: string
  ogImageUrl: string | null
  twitterCard: 'summary' | 'summary_large_image'
  /** Optional @username for twitter:site (without @). */
  twitterSite?: string
  /** Open Graph type — default `website`. */
  ogType?: 'website' | 'article'
  /**
   * Bilingual alternates for `link[rel="alternate"][hreflang]`.
   * When empty or omitted, existing app-managed alternates are removed.
   */
  hreflangAlternates?: { hreflang: string; href: string }[]
}

const SEO_DATA_ATTR = 'data-app-seo'

function ensureMeta(attr: 'name' | 'property', key: string): HTMLMetaElement {
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(SEO_DATA_ATTR, '1')
    document.head.appendChild(el)
  } else if (!el.hasAttribute(SEO_DATA_ATTR)) {
    el.setAttribute(SEO_DATA_ATTR, '1')
  }
  return el
}

function setMetaName(name: string, content: string) {
  ensureMeta('name', name).setAttribute('content', content)
}

function setMetaProperty(property: string, content: string) {
  ensureMeta('property', property).setAttribute('content', content)
}

function ensureLinkRel(rel: string): HTMLLinkElement {
  const selector = `link[rel="${rel}"]`
  let el = document.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute(SEO_DATA_ATTR, '1')
    document.head.appendChild(el)
  } else if (!el.hasAttribute(SEO_DATA_ATTR)) {
    el.setAttribute(SEO_DATA_ATTR, '1')
  }
  return el
}

/**
 * Updates document title and core/link/meta tags for SPA route changes.
 * Idempotent; safe to call on every navigation.
 */
export function applyPageSeo(payload: PageSeoPayload) {
  document.title = payload.title

  setMetaName('description', payload.description)
  setMetaName('robots', payload.robots)

  setMetaProperty('og:type', payload.ogType ?? 'website')
  setMetaProperty('og:title', payload.title)
  setMetaProperty('og:description', payload.description)
  setMetaProperty('og:url', payload.ogUrl ?? payload.canonicalUrl)
  setMetaProperty('og:site_name', payload.siteName)
  setMetaProperty('og:locale', payload.locale.replace(/-/g, '_'))

  if (payload.ogImageUrl) {
    setMetaProperty('og:image', payload.ogImageUrl)
  } else {
    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage?.hasAttribute(SEO_DATA_ATTR)) ogImage.remove()
  }

  setMetaName('twitter:card', payload.twitterCard)
  setMetaName('twitter:title', payload.title)
  setMetaName('twitter:description', payload.description)

  if (payload.twitterSite) {
    setMetaName('twitter:site', `@${payload.twitterSite}`)
  } else {
    const tw = document.querySelector('meta[name="twitter:site"]')
    if (tw?.hasAttribute(SEO_DATA_ATTR)) tw.remove()
  }

  if (payload.ogImageUrl) {
    setMetaName('twitter:image', payload.ogImageUrl)
  } else {
    const tw = document.querySelector('meta[name="twitter:image"]')
    if (tw?.hasAttribute(SEO_DATA_ATTR)) tw.remove()
  }

  ensureLinkRel('canonical').setAttribute('href', payload.canonicalUrl)

  document.querySelectorAll('link[rel="alternate"][data-app-seo]').forEach((el) => el.remove())
  const alternates = payload.hreflangAlternates ?? []
  for (const alt of alternates) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', alt.hreflang)
    link.setAttribute('href', alt.href)
    link.setAttribute(SEO_DATA_ATTR, '1')
    document.head.appendChild(link)
  }
}
