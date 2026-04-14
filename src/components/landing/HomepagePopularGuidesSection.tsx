import { Link } from 'react-router-dom'
import type { Language, TranslationMessages } from '../../constants/translations'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import { HOMEPAGE_POPULAR_GUIDE_IDS, RELATED_GUIDE_LINK_COPY } from '../seo/relatedGuidesConfig'

export interface HomepagePopularGuidesSectionProps {
  t: TranslationMessages
  language: Language
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

function toSeoLocale(language: Language): SeoLocale {
  return language === 'da' ? 'da' : 'en'
}

/**
 * Crawlable internal links to article guides — placed after the main CTA, before the footer.
 */
export function HomepagePopularGuidesSection({ t, language }: HomepagePopularGuidesSectionProps) {
  const l = t.landing
  const locale = toSeoLocale(language)

  return (
    <section
      className="border-t border-zinc-200 bg-zinc-50 py-12 sm:py-14"
      aria-labelledby="homepage-popular-guides-heading"
    >
      <div className={`${shell} max-w-3xl`}>
        <h2
          id="homepage-popular-guides-heading"
          className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl"
        >
          {l.popularGuidesHeading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{l.popularGuidesIntro}</p>
        <ul className="mt-6 list-none space-y-3 p-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
          {HOMEPAGE_POPULAR_GUIDE_IDS.map((id) => {
            const copy = RELATED_GUIDE_LINK_COPY[id]
            if (!copy) {
              return null
            }
            const text = copy[locale]
            return (
              <li key={id}>
                <Link
                  to={seoPath(id, locale)}
                  className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 no-underline shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <span className="block font-medium text-brand-800 underline-offset-4 hover:underline">
                    {text.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-zinc-600">{text.blurb}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
