import type { ReactNode } from 'react'
import type { TranslationMessages } from '../../constants/translations'
import { appMeta } from '../../constants/appMeta'
import { AppFooter } from '../AppFooter'

export interface LegalPageShellProps {
  t: TranslationMessages
  title: string
  subtitle?: string
  children: ReactNode
  onBack: () => void
}

export function LegalPageShell({ t, title, subtitle, children, onBack }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            {t.legal.back}
          </button>
          <p className="text-sm font-semibold text-zinc-900">{appMeta.appName}</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
          {subtitle ? <p className="text-sm leading-relaxed text-zinc-600">{subtitle}</p> : null}
          <p className="text-xs text-zinc-400">
            {t.legal.lastUpdated} {appMeta.effectiveDate}
          </p>
        </header>

        <article className="prose prose-zinc max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-blue-800 prose-a:underline-offset-4">
          {children}
        </article>
      </main>

      <AppFooter t={t} />
    </div>
  )
}

