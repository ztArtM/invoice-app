import { useEffect, useMemo } from 'react'
import type { Language, TranslationMessages } from '../../constants/translations'
import { getCanonicalSiteUrl, getOgImageAbsoluteUrl, getSiteOrigin, seoConstants } from '../../constants/seo'
import type { InfoRoute } from '../../utils/infoRoutes'
import { applyPageSeo, type PageSeoPayload } from '../../utils/applyPageSeo'
import { StructuredData } from './StructuredData'

export interface SeoManagerProps {
  phase: 'landing' | 'app'
  infoRoute: InfoRoute | null
  language: Language
  t: TranslationMessages
}

function ogLocale(language: Language): string {
  return language === 'da' ? 'da-DK' : 'en-US'
}

function hashUrl(route: InfoRoute): string {
  return `${getSiteOrigin()}/#${route}`
}

function buildPagePayload(props: SeoManagerProps): PageSeoPayload {
  const { phase, infoRoute, language, t } = props
  const canonical = getCanonicalSiteUrl()
  const ogImage = getOgImageAbsoluteUrl()
  const twitterCard = ogImage ? 'summary_large_image' : 'summary'
  const site = t.seo.siteNameShort
  const locale = ogLocale(language)
  const tw = seoConstants.twitterSite || undefined

  if (infoRoute) {
    const pageTitle =
      infoRoute === 'privacy'
        ? t.legal.privacy.pageTitle
        : infoRoute === 'terms'
          ? t.legal.terms.pageTitle
          : infoRoute === 'contact'
            ? t.legal.contact.pageTitle
            : t.legal.cookies.pageTitle
    const pageDescription =
      infoRoute === 'privacy'
        ? t.seo.privacyDescription
        : infoRoute === 'terms'
          ? t.seo.termsDescription
          : infoRoute === 'contact'
            ? t.seo.contactDescription
            : t.seo.cookiesDescription

    return {
      title: `${pageTitle} · ${site}`,
      description: pageDescription,
      canonicalUrl: canonical,
      ogUrl: hashUrl(infoRoute),
      robots: 'index, follow',
      siteName: site,
      locale,
      ogImageUrl: ogImage,
      twitterCard,
      twitterSite: tw,
    }
  }

  if (phase === 'landing') {
    return {
      title: t.seo.landingTitle,
      description: t.seo.landingDescription,
      canonicalUrl: canonical,
      robots: 'index, follow',
      siteName: site,
      locale,
      ogImageUrl: ogImage,
      twitterCard,
      twitterSite: tw,
    }
  }

  return {
    title: `${t.seo.workspaceTitle} · ${site}`,
    description: t.seo.workspaceDescription,
    canonicalUrl: canonical,
    robots: 'noindex, follow',
    siteName: site,
    locale,
    ogImageUrl: ogImage,
    twitterCard,
    twitterSite: tw,
  }
}

function buildJsonLd(props: SeoManagerProps): unknown | null {
  const { phase, infoRoute, t } = props
  const canonical = getCanonicalSiteUrl()
  const name = seoConstants.productName
  const siteDescription = t.seo.defaultDescription

  if (infoRoute) {
    const pageTitle =
      infoRoute === 'privacy'
        ? t.legal.privacy.pageTitle
        : infoRoute === 'terms'
          ? t.legal.terms.pageTitle
          : infoRoute === 'contact'
            ? t.legal.contact.pageTitle
            : t.legal.cookies.pageTitle
    const pageDescription =
      infoRoute === 'privacy'
        ? t.seo.privacyDescription
        : infoRoute === 'terms'
          ? t.seo.termsDescription
          : infoRoute === 'contact'
            ? t.seo.contactDescription
            : t.seo.cookiesDescription

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${canonical}#website`,
          name,
          url: canonical,
          description: siteDescription,
          inLanguage: ['en', 'da'],
        },
        {
          '@type': 'WebPage',
          '@id': hashUrl(infoRoute),
          name: pageTitle,
          description: pageDescription,
          url: hashUrl(infoRoute),
          isPartOf: { '@id': `${canonical}#website` },
        },
      ],
    }
  }

  if (phase === 'landing') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${canonical}#website`,
          name,
          url: canonical,
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
          url: canonical,
        },
      ],
    }
  }

  return null
}

/**
 * Syncs document title, meta, canonical, Open Graph, and Twitter tags to the current view.
 * Renders JSON-LD for indexable views only (landing + legal overlays).
 */
export function SeoManager({ phase, infoRoute, language, t }: SeoManagerProps) {
  const payload = useMemo(
    () => buildPagePayload({ phase, infoRoute, language, t }),
    [phase, infoRoute, language, t],
  )
  const jsonLd = useMemo(
    () => buildJsonLd({ phase, infoRoute, language, t }),
    [phase, infoRoute, language, t],
  )

  useEffect(() => {
    applyPageSeo(payload)
  }, [payload])

  if (!jsonLd) return null

  return <StructuredData id="app-jsonld" data={jsonLd} />
}
