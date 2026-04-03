import type { TranslationMessages } from '../constants/translations'
import { appMeta } from '../constants/appMeta'
import type { InfoRoute } from '../utils/infoRoutes'

export interface AppFooterProps {
  t: TranslationMessages
  /** Keep footer out of print output by default. */
  className?: string
}

function FooterLink({
  route,
  children,
}: {
  route: InfoRoute
  children: string
}) {
  return (
    <a
      href={`#${route}`}
      className="rounded-md text-sm font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"
    >
      {children}
    </a>
  )
}

export function AppFooter({ t, className = '' }: AppFooterProps) {
  const year = new Date().getFullYear()
  const f = t.footer
  return (
    <footer className={`border-t border-zinc-200 bg-white py-10 print:hidden ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-900">{appMeta.appName}</p>
            <p className="text-xs text-zinc-500">{f.trustLine}</p>
          </div>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label={f.footerNavAria}
          >
            <FooterLink route="privacy">{f.privacy}</FooterLink>
            <FooterLink route="terms">{f.terms}</FooterLink>
            <FooterLink route="contact">{f.contact}</FooterLink>
            <FooterLink route="cookies">{f.cookies}</FooterLink>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-400">
          © {year} {appMeta.publisherName}
        </p>
      </div>
    </footer>
  )
}

