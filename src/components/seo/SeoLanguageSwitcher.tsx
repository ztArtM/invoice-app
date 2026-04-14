import { Link, useLocation } from 'react-router-dom'
import { getAlternatePathname, normalizeSeoPathname } from '../../constants/seoLocaleRoutes'

/**
 * Minimal EN/DA toggle on SEO shells — links to the equivalent URL in the other language.
 */
export function SeoLanguageSwitcher() {
  const { pathname } = useLocation()
  const target = getAlternatePathname(normalizeSeoPathname(pathname))
  if (!target) return null

  const isEnglish = normalizeSeoPathname(pathname).startsWith('/en')
  const label = isEnglish ? 'Dansk' : 'English'

  return (
    <Link
      to={target}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"
      hrefLang={isEnglish ? 'da' : 'en'}
    >
      {label}
    </Link>
  )
}
