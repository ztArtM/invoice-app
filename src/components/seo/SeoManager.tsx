import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { Language, TranslationMessages } from '../../constants/translations'
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
  const pageCanonical = getCanonicalUrlForPath(pathname)
  const ogImage = getOgImageAbsoluteUrl()
  const twitterCard = ogImage ? 'summary_large_image' : 'summary'
  const site = t.seo.siteNameShort
  const locale = ogLocale(language)
  const tw = seoConstants.twitterSite || undefined

  if (pathname === '/') {
    return {
      title: t.seo.landingTitle,
      description: t.seo.landingDescription,
      canonicalUrl: pageCanonical,
      ogUrl: pageCanonical,
      robots: 'index, follow',
      siteName: site,
      locale,
      ogImageUrl: ogImage,
      twitterCard,
      twitterSite: tw,
    }
  }

  if (pathname === '/builder') {
    return {
      title: `${t.seo.workspaceTitle} · ${site}`,
      description: t.seo.workspaceDescription,
      canonicalUrl: pageCanonical,
      ogUrl: pageCanonical,
      robots: 'index, follow',
      siteName: site,
      locale,
      ogImageUrl: ogImage,
      twitterCard,
      twitterSite: tw,
    }
  }

  const legal = getLegalRouteFromPath(pathname)
  if (legal) {
    const { title, description } = legalPageCopy(legal, t)
    return {
      title: `${title} · ${site}`,
      description,
      canonicalUrl: pageCanonical,
      ogUrl: pageCanonical,
      robots: 'index, follow',
      siteName: site,
      locale,
      ogImageUrl: ogImage,
      twitterCard,
      twitterSite: tw,
    }
  }

  return {
    title: t.seo.defaultTitle,
    description: t.seo.defaultDescription,
    canonicalUrl: getCanonicalUrlForPath('/'),
    ogUrl: getCanonicalUrlForPath('/'),
    robots: 'index, follow',
    siteName: site,
    locale,
    ogImageUrl: ogImage,
    twitterCard,
    twitterSite: tw,
  }
}

function buildJsonLd(props: SeoManagerProps & { pathname: string }): unknown | null {
  const { pathname, t } = props
  const originHome = getCanonicalUrlForPath('/')
  const name = seoConstants.productName
  const siteDescription = t.seo.defaultDescription

  if (pathname === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${originHome}#website`,
          name,
          url: originHome,
          description: t.seo.landingDescription,
          inLanguage: ['en', 'da'],
        },
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
      ],
    }
  }

  const legal = getLegalRouteFromPath(pathname)
  if (legal) {
    const { title: pageTitle, description: pageDescription } = legalPageCopy(legal, t)
    const pageUrl = getCanonicalUrlForPath(pathname)
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${originHome}#website`,
          name,
          url: originHome,
          description: siteDescription,
          inLanguage: ['en', 'da'],
        },
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
