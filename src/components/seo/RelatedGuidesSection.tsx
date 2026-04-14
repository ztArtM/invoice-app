import { Link } from 'react-router-dom'
import { seoPath, type SeoLocale } from '../../constants/seoLocaleRoutes'
import type { ArticleGuidePageId } from './relatedGuidesConfig'
import { RELATED_GUIDE_LINK_COPY, RELATED_GUIDES_FOR_PAGE } from './relatedGuidesConfig'

export interface RelatedGuidesSectionProps {
  pageId: ArticleGuidePageId
  locale: SeoLocale
}

export function RelatedGuidesSection({ pageId, locale }: RelatedGuidesSectionProps) {
  const ids = RELATED_GUIDES_FOR_PAGE[pageId]
  const L = locale
  const heading = L === 'da' ? 'Relaterede guides' : 'Related guides'

  return (
    <section className="not-prose mt-8 border-t border-zinc-200 pt-6" aria-labelledby="related-guides-heading">
      <h2 id="related-guides-heading" className="text-base font-semibold text-zinc-900">
        {heading}
      </h2>
      <ul className="mt-4 list-none space-y-3 p-0">
        {ids.map((id) => {
          const copy = RELATED_GUIDE_LINK_COPY[id]
          if (!copy) {
            return null
          }
          const text = copy[L]
          return (
            <li key={id}>
              <Link
                to={seoPath(id, L)}
                className="block rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-3 no-underline transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                <span className="block font-medium text-brand-800 underline-offset-4 hover:underline">{text.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-zinc-600">{text.blurb}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
