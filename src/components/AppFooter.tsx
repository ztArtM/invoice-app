import { Link } from 'react-router-dom'
import type { TranslationMessages } from '../constants/translations'
import { seoPath, type SeoLocale } from '../constants/seoLocaleRoutes'
import { appMeta } from '../constants/appMeta'
import type { InfoRoute } from '../utils/infoRoutes'
import { pathForInfoRoute } from '../utils/infoRoutes'

export interface AppFooterProps {
  t: TranslationMessages
  /** Locale for marketing/SEO URLs in the resources section. */
  linkLocale?: SeoLocale
  /** Keep footer out of print output by default. */
  className?: string
}

const linkClass =
  'rounded-md text-sm font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800'

function FooterLink({
  route,
  children,
}: {
  route: InfoRoute
  children: string
}) {
  return (
    <Link to={pathForInfoRoute(route)} className={linkClass}>
      {children}
    </Link>
  )
}

export function AppFooter({ t, linkLocale = 'da', className = '' }: AppFooterProps) {
  const year = new Date().getFullYear()
  const f = t.footer
  const L = linkLocale
  return (
    <footer className={`border-t border-zinc-200 bg-white py-10 print:hidden ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-zinc-900">{appMeta.appName}</p>
            <p className="text-xs text-zinc-500">{f.trustLine}</p>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-6 sm:gap-x-12 lg:mx-auto lg:max-w-md"
            aria-label={f.resourcesNavAria}
          >
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {f.productHeading}
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to={seoPath('gratisFakturaProgram', L)} className={linkClass}>
                    {f.linkGratisFakturaProgram}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('lavFakturaOnline', L)} className={linkClass}>
                    {f.linkLavFakturaOnline}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('fakturaSkabelon', L)} className={linkClass}>
                    {f.linkFakturaSkabelon}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('tilbudSkabelon', L)} className={linkClass}>
                    {f.linkTilbudSkabelon}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('gratisFakturaSkabelon', L)} className={linkClass}>
                    {f.linkGratisFakturaSkabelon}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {f.guidesHeading}
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to={seoPath('hvordanLaverManEnFaktura', L)} className={linkClass}>
                    {f.linkHvordanFaktura}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('hvadSkalEnFakturaIndeholde', L)} className={linkClass}>
                    {f.linkHvadIndeholderFaktura}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('fakturaUdenCvr', L)} className={linkClass}>
                    {f.linkFakturaUdenCvr}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('fakturaTilFreelancer', L)} className={linkClass}>
                    {f.linkFakturaTilFreelancer}
                  </Link>
                </li>
                <li>
                  <Link to={seoPath('tilbudVsFaktura', L)} className={linkClass}>
                    {f.linkTilbudVsFaktura}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-end"
            aria-label={f.footerNavAria}
          >
            <FooterLink route="privacy">{f.privacy}</FooterLink>
            <FooterLink route="terms">{f.terms}</FooterLink>
            <FooterLink route="contact">{f.contact}</FooterLink>
            <FooterLink route="cookies">{f.cookies}</FooterLink>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-400 lg:mt-10">
          © {year} {appMeta.publisherName}
        </p>
      </div>
    </footer>
  )
}
