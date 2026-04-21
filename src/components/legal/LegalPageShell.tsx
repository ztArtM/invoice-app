import type { ReactNode } from 'react'
import type { TranslationMessages } from '../../constants/translations'
import type { SeoLocale } from '../../constants/seoLocaleRoutes'
import { appMeta } from '../../constants/appMeta'
import { AppFooter } from '../AppFooter'

export interface LegalPageShellProps {
  t: TranslationMessages
  title: string
  subtitle?: string
  children: ReactNode
  onBack: () => void
  /** Default true. Set false for marketing/SEO pages without a legal “last updated” line. */
  showLastUpdated?: boolean
  /** When set, shows EN/DA link to the paired SEO URL (see `seoLocaleRoutes`). */
  languageSwitcher?: ReactNode
  /** Optional neutral line for article guides (no fabricated dates). */
  articleFreshnessNote?: string
  /** Locale for footer product/guide links (`seoPath`). Defaults to Danish. */
  footerLinkLocale?: SeoLocale
}

export function LegalPageShell({
  t,
  title,
  subtitle,
  children,
  onBack,
  showLastUpdated = true,
  languageSwitcher,
  articleFreshnessNote,
  footerLinkLocale = 'da',
}: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"
          >
            {t.legal.back}
          </button>
          <div className="flex items-center gap-3">
            {languageSwitcher}
            <p className="text-sm font-semibold text-zinc-900">{appMeta.appName}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
        <header className="mx-auto mb-8 max-w-prose space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
          {subtitle ? <p className="text-base leading-relaxed text-zinc-600">{subtitle}</p> : null}
          {articleFreshnessNote ? (
            <p className="text-base leading-relaxed text-zinc-500">{articleFreshnessNote}</p>
          ) : null}
          {showLastUpdated ? (
            <p className="text-sm text-zinc-500">
              {t.legal.lastUpdated} {appMeta.effectiveDate}
            </p>
          ) : null}
        </header>

        <article className="prose prose-zinc prose-lg sm:prose-xl mx-auto w-full max-w-prose prose-p:leading-relaxed prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-brand-800 prose-a:underline-offset-4 prose-h2:mt-12 prose-h3:mt-8">
          {children}
        </article>
      </main>

      <AppFooter t={t} linkLocale={footerLinkLocale} />
    </div>
  )
}

