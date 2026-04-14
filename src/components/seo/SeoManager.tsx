import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { Language, TranslationMessages } from '../../constants/translations'
import { HOMEPAGE_FAQ_ITEMS } from '../../constants/homepageFaqDa'
import {
  buildHreflangAlternates,
  homeLocaleFromPath,
  isHomePath,
  resolveSeoPageFromPathname,
  SEO_PAGE_DEFINITIONS,
  type SeoLocale,
  type SeoPageId,
} from '../../constants/seoLocaleRoutes'
import { getCanonicalUrlForPath, getOgImageAbsoluteUrl, seoConstants } from '../../constants/seo'
import type { InfoRoute } from '../../utils/infoRoutes'
import { getLegalRouteFromPath } from '../../utils/infoRoutes'
import { applyPageSeo, type PageSeoPayload } from '../../utils/applyPageSeo'
import { StructuredData } from './StructuredData'

export interface SeoManagerProps {
  language: Language
  t: TranslationMessages
}

function ogLocale(language: Language): string {
  return language === 'da' ? 'da-DK' : 'en-US'
}

function legalPageCopy(
  route: InfoRoute,
  t: TranslationMessages,
): { title: string; description: string } {
  const pageTitle =
    route === 'privacy'
      ? t.legal.privacy.pageTitle
      : route === 'terms'
        ? t.legal.terms.pageTitle
        : route === 'contact'
          ? t.legal.contact.pageTitle
          : t.legal.cookies.pageTitle
  const pageDescription =
    route === 'privacy'
      ? t.seo.privacyDescription
      : route === 'terms'
        ? t.seo.termsDescription
        : route === 'contact'
          ? t.seo.contactDescription
          : t.seo.cookiesDescription
  return { title: pageTitle, description: pageDescription }
}

function buildPagePayload(props: SeoManagerProps & { pathname: string }): PageSeoPayload {
  const { pathname, language, t } = props
  const ogImage = getOgImageAbsoluteUrl()
  const twitterCard = ogImage ? 'summary_large_image' : 'summary'
  const site = t.seo.siteNameShort
  const locale = ogLocale(language)
  const tw = seoConstants.twitterSite || undefined

  const base = (partial: Partial<PageSeoPayload> & Pick<PageSeoPayload, 'title' | 'description' | 'canonicalUrl'>): PageSeoPayload => ({
    robots: 'index, follow',
    siteName: site,
    locale,
    ogImageUrl: ogImage,
    twitterCard,
    twitterSite: tw,
    ogUrl: partial.ogUrl ?? partial.canonicalUrl,
    ...partial,
  })

  if (isHomePath(pathname)) {
    const hl = homeLocaleFromPath(pathname)
    const pathForCanonical = SEO_PAGE_DEFINITIONS.home.paths[hl]
    const pageCanonical = getCanonicalUrlForPath(pathForCanonical)
    return base({
      title: t.seo.landingTitle,
      description: t.seo.landingDescription,
      canonicalUrl: pageCanonical,
      hreflangAlternates: buildHreflangAlternates('home'),
    })
  }

  if (pathname === '/builder') {
    const pageCanonical = getCanonicalUrlForPath(pathname)
    return base({
      title: `${t.seo.workspaceTitle} · ${site}`,
      description: t.seo.workspaceDescription,
      canonicalUrl: pageCanonical,
      hreflangAlternates: [],
    })
  }

  const resolved = resolveSeoPageFromPathname(pathname)
  if (resolved && resolved.pageId !== 'home') {
    const { pageId, locale: pageLocale } = resolved
    const def = SEO_PAGE_DEFINITIONS[pageId]
    const meta = def.meta[pageLocale]
    const pageCanonical = getCanonicalUrlForPath(def.paths[pageLocale])
    return base({
      title: meta.title,
      description: meta.description,
      canonicalUrl: pageCanonical,
      ogType: def.schema === 'article' ? 'article' : undefined,
      hreflangAlternates: buildHreflangAlternates(pageId),
    })
  }

  const legal = getLegalRouteFromPath(pathname)
  if (legal) {
    const { title, description } = legalPageCopy(legal, t)
    const pageCanonical = getCanonicalUrlForPath(pathname)
    return base({
      title: `${title} · ${site}`,
      description,
      canonicalUrl: pageCanonical,
      hreflangAlternates: [],
    })
  }

  return base({
    title: t.seo.defaultTitle,
    description: t.seo.defaultDescription,
    canonicalUrl: getCanonicalUrlForPath('/'),
    ogUrl: getCanonicalUrlForPath('/'),
    hreflangAlternates: [],
  })
}

function buildHomepageFaqPageLd(originHome: string): {
  '@type': 'FAQPage'
  '@id': string
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: { '@type': 'Answer'; text: string }
  }>
} {
  return {
    '@type': 'FAQPage',
    '@id': `${originHome}#faq`,
    mainEntity: HOMEPAGE_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function websiteNode(t: TranslationMessages, originHome: string) {
  return {
    '@type': 'WebSite',
    '@id': `${originHome}#website`,
    name: seoConstants.productName,
    url: originHome,
    description: t.seo.defaultDescription,
    inLanguage: ['en', 'da'],
  }
}

function buildSeoPageJsonLd(pageId: SeoPageId, locale: SeoLocale, t: TranslationMessages): unknown {
  const def = SEO_PAGE_DEFINITIONS[pageId]
  const path = def.paths[locale]
  const pageUrl = getCanonicalUrlForPath(path)
  const meta = def.meta[locale]
  const originHome = getCanonicalUrlForPath('/')

  const graphBase: unknown[] = [
    websiteNode(t, originHome),
    def.schema === 'article'
      ? {
          '@type': 'Article',
          '@id': pageUrl,
          headline: meta.headline ?? meta.title.replace(/\s*\|\s*FakturaLyn\s*$/, ''),
          description: meta.description,
          url: pageUrl,
          isPartOf: { '@id': `${originHome}#website` },
        }
      : {
          '@type': 'WebPage',
          '@id': pageUrl,
          name: meta.pageName ?? meta.title.replace(/\s*\|\s*FakturaLyn\s*$/, ''),
          description: meta.description,
          url: pageUrl,
          isPartOf: { '@id': `${originHome}#website` },
        },
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': graphBase,
  }
}

function buildJsonLd(props: SeoManagerProps & { pathname: string }): unknown | null {
  const { pathname, t, language } = props
  const originHome = getCanonicalUrlForPath('/')
  const name = seoConstants.productName

  if (isHomePath(pathname)) {
    const graph: unknown[] = [
      {
        '@type': 'SoftwareApplication',
        name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'DKK',
        },
        description: t.seo.landingDescription,
        url: originHome,
      },
    ]
    if (language === 'da' && homeLocaleFromPath(pathname) === 'da') {
      graph.push(buildHomepageFaqPageLd(originHome))
    }
    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    }
  }

  const resolved = resolveSeoPageFromPathname(pathname)
  if (resolved && resolved.pageId !== 'home') {
    return buildSeoPageJsonLd(resolved.pageId, resolved.locale, t)
  }

  const legal = getLegalRouteFromPath(pathname)
  if (legal) {
    const { title: pageTitle, description: pageDescription } = legalPageCopy(legal, t)
    const pageUrl = getCanonicalUrlForPath(pathname)
    return {
      '@context': 'https://schema.org',
      '@graph': [
        websiteNode(t, originHome),
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          name: pageTitle,
          description: pageDescription,
          url: pageUrl,
          isPartOf: { '@id': `${originHome}#website` },
        },
      ],
    }
  }

  return null
}

/**
 * Syncs document title, meta, canonical, Open Graph, and Twitter tags to the current route.
 */
export function SeoManager({ language, t }: SeoManagerProps) {
  const { pathname } = useLocation()
  const payload = useMemo(
    () => buildPagePayload({ pathname, language, t }),
    [pathname, language, t],
  )
  const jsonLd = useMemo(
    () => buildJsonLd({ pathname, language, t }),
    [pathname, language, t],
  )

  useEffect(() => {
    applyPageSeo(payload)
  }, [payload])

  if (!jsonLd) return null

  return <StructuredData id="app-jsonld" data={jsonLd} />
}
