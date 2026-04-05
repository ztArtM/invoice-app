import { useEffect, useState } from 'react'
import { createDefaultInvoiceDocument } from '../../constants/defaultInvoiceDocument'
import { normalizeInvoiceCurrency, type SupportedCurrencyCode } from '../../constants/localization'
import type { Language, TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument, SetInvoiceDocument } from '../../types/invoiceDocument'
import { duplicateInvoiceDocument } from '../../utils/duplicateInvoiceDocument'
import { exportInvoiceToPdf } from '../../utils/exportInvoiceToPdf'
import { getGettingStartedTips } from '../../utils/gettingStartedTips'
import { printInvoicePreview } from '../../utils/printDocument'
import {
  secondaryButtonClassName,
  tertiaryButtonClassName,
  toolbarExportGroupClassName,
  toolbarPrimaryButtonClassName,
} from './buttonStyles'
import { toolbarSelectClassName } from './formFieldClassNames'
import { GettingStartedBanner } from './GettingStartedBanner'
import { InvoiceEditor } from './InvoiceEditor'
import { InvoicePreview } from './InvoicePreview'

interface InvoiceWorkspaceProps {
  language: Language
  onLanguageChange: (language: Language) => void
  /** BCP 47 locale from `getLocaleForLanguage` — used for `Intl` date/currency output. */
  localeForFormatting: string
  /** Active ISO currency code (document is normalized to DKK / EUR). */
  activeCurrencyCode: SupportedCurrencyCode
  t: TranslationMessages
  onFeedbackClick?: () => void
  invoiceDocument: InvoiceDocument
  setInvoiceDocument: SetInvoiceDocument
}

/**
 * Shell: getting-started tips, toolbar actions, then form + preview (stacked on small screens).
 */
export function InvoiceWorkspace({
  language,
  onLanguageChange,
  localeForFormatting,
  activeCurrencyCode,
  t,
  onFeedbackClick,
  invoiceDocument,
  setInvoiceDocument,
}: InvoiceWorkspaceProps) {
  const [pdfErrorMessage, setPdfErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (pdfErrorMessage === null) return
    const timerId = window.setTimeout(() => setPdfErrorMessage(null), 8000)
    return () => window.clearTimeout(timerId)
  }, [pdfErrorMessage])

  const handleDownloadPdfClick = () => {
    setPdfErrorMessage(null)
    try {
      exportInvoiceToPdf(invoiceDocument, t, localeForFormatting, activeCurrencyCode)
      onFeedbackClick?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.workspace.pdfErrorGeneric
      setPdfErrorMessage(message)
    }
  }

  const handleDuplicateClick = () => {
    setInvoiceDocument((previous) => duplicateInvoiceDocument(previous))
  }

  const handleResetClick = () => {
    if (window.confirm(t.workspace.resetDraftConfirm)) {
      setInvoiceDocument(normalizeInvoiceCurrency(createDefaultInvoiceDocument()))
    }
  }

  const gettingStartedTips = getGettingStartedTips(invoiceDocument, t.gettingStarted)

  return (
    <div className="space-y-10 print:space-y-4">
      <header className="space-y-8 border-b border-zinc-200/70 pb-10 print:hidden print:space-y-4 print:border-0 print:pb-0">
        <div className="space-y-3">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {t.workspace.title}
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">
            {t.workspace.subtitle}
          </p>
        </div>

        <div
          className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm shadow-zinc-900/[0.04] ring-1 ring-zinc-950/[0.02] sm:p-5"
          role="group"
          aria-label={t.workspace.exportAriaLabel}
        >
          {/* Mobile: PDF + Print on top (flex-col-reverse). Desktop: language | tertiary left, print | PDF right. */}
          <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              <label className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                <span className="font-medium whitespace-nowrap">{t.workspace.languageLabel}</span>
                <select
                  className={toolbarSelectClassName}
                  value={language}
                  onChange={(event) => onLanguageChange(event.target.value as Language)}
                  aria-label={t.workspace.languageLabel}
                >
                  <option value="en">{t.workspace.languageEnglish}</option>
                  <option value="da">{t.workspace.languageDanish}</option>
                </select>
              </label>
              <div
                className="flex flex-wrap gap-1 border-t border-zinc-100 pt-3 sm:border-0 sm:border-l sm:pl-3 sm:pt-0"
                role="group"
                aria-label={t.workspace.documentActionsAriaLabel}
              >
                <button
                  type="button"
                  className={tertiaryButtonClassName}
                  onClick={handleDuplicateClick}
                >
                  {t.workspace.duplicateDocument}
                </button>
                <button
                  type="button"
                  className={tertiaryButtonClassName}
                  onClick={handleResetClick}
                >
                  {t.workspace.resetDraft}
                </button>
              </div>
            </div>

            <div className={toolbarExportGroupClassName}>
              <button
                type="button"
                className={`group ${secondaryButtonClassName} order-2 w-full bg-white/90 sm:order-1 sm:w-auto`}
                onClick={printInvoicePreview}
              >
                <PrintIcon />
                {t.workspace.print}
              </button>
              <button
                type="button"
                className={`${toolbarPrimaryButtonClassName} order-1 w-full sm:order-3 sm:w-auto`}
                onClick={handleDownloadPdfClick}
                aria-describedby={pdfErrorMessage ? 'pdf-export-error' : undefined}
              >
                <DownloadPdfIcon />
                {t.workspace.saveAsPdf}
              </button>
            </div>
          </div>

          <p className="mt-5 border-t border-zinc-100 pt-4 text-xs leading-relaxed text-zinc-400 sm:text-right">
            {t.workspace.printHint}{' '}
            <span className="hidden sm:inline">{t.workspace.printHintDesktopFeedback}</span>
          </p>
        </div>
      </header>

      <section className="space-y-4 print:space-y-3" aria-label={t.workspace.title}>
        <GettingStartedBanner title={t.gettingStarted.bannerTitle} tips={gettingStartedTips} />

        {pdfErrorMessage ? (
          <div
            id="pdf-export-error"
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm print:hidden"
          >
            {pdfErrorMessage}
          </div>
        ) : null}
      </section>

      <main
        id="invoice-app-main"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10"
      >
        <div className="min-w-0 space-y-3">
          <p className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-400 lg:block">
            {t.workspace.editorColumnLabel}
          </p>
          <InvoiceEditor
            t={t}
            localeForFormatting={localeForFormatting}
            activeCurrencyCode={activeCurrencyCode}
            invoiceDocument={invoiceDocument}
            setInvoiceDocument={setInvoiceDocument}
          />
        </div>
        <div className="min-w-0 space-y-3 lg:pt-0">
          <p className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-400 lg:block">
            {t.workspace.previewColumnLabel}
          </p>
          {gettingStartedTips.length > 0 ? (
            <p
              className="mb-5 rounded-lg border border-dashed border-zinc-200 bg-white/80 px-4 py-3 text-sm leading-relaxed text-zinc-600 shadow-sm print:hidden"
              role="note"
            >
              {t.workspace.previewHint}
            </p>
          ) : null}
          <InvoicePreview
            t={t}
            localeForFormatting={localeForFormatting}
            activeCurrencyCode={activeCurrencyCode}
            invoiceDocument={invoiceDocument}
          />
        </div>
      </main>
    </div>
  )
}

function DownloadPdfIcon() {
  return (
    <svg
      className="size-4 shrink-0 opacity-95"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" rx="1" />
    </svg>
  )
}
