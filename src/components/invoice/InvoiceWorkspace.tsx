import { useEffect, useRef, useState } from 'react'
import { createDefaultInvoiceDocument, createExampleInvoiceDocument } from '../../constants/defaultInvoiceDocument'
import { normalizeInvoiceCurrency, type SupportedCurrencyCode } from '../../constants/localization'
import type { Language, TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument, SetInvoiceDocument } from '../../types/invoiceDocument'
import { duplicateInvoiceDocument } from '../../utils/duplicateInvoiceDocument'
import { exportInvoiceToPdf } from '../../utils/exportInvoiceToPdf'
import { getGettingStartedTips } from '../../utils/gettingStartedTips'
import { printInvoicePreview } from '../../utils/printDocument'
import {
  secondaryButtonClassName,
  toolbarExportGroupClassName,
  toolbarPrimaryButtonClassName,
} from './buttonStyles'
import { DownloadPdfIcon, PrintIcon } from './ToolbarExportIcons'
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
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const mobilePreviewCloseButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (pdfErrorMessage === null) return
    const timerId = window.setTimeout(() => setPdfErrorMessage(null), 8000)
    return () => window.clearTimeout(timerId)
  }, [pdfErrorMessage])

  useEffect(() => {
    if (!mobilePreviewOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    mobilePreviewCloseButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [mobilePreviewOpen])

  useEffect(() => {
    if (!mobilePreviewOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobilePreviewOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobilePreviewOpen])

  const handleDownloadPdfClick = async () => {
    setPdfErrorMessage(null)
    try {
      await exportInvoiceToPdf(invoiceDocument, t, language, localeForFormatting, activeCurrencyCode)
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

  const handleTryExampleClick = () => {
    setInvoiceDocument(normalizeInvoiceCurrency(createExampleInvoiceDocument()))
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
                <button type="button" className={secondaryButtonClassName} onClick={handleTryExampleClick}>
                  {t.workspace.tryExample}
                </button>
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={handleDuplicateClick}
                >
                  {t.workspace.duplicateDocument}
                </button>
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={handleResetClick}
                >
                  {t.workspace.resetDraft}
                </button>
              </div>
            </div>

            <WorkspaceToolbarExportButtons
              t={t}
              onPrint={printInvoicePreview}
              onDownloadPdf={handleDownloadPdfClick}
              pdfAriaDescribedBy={pdfErrorMessage ? 'pdf-export-error' : undefined}
            />
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
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10 print:block print:gap-0"
      >
        <div className="min-w-0 space-y-3 print:hidden">
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
          <div
            className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm shadow-zinc-900/[0.04] ring-1 ring-zinc-950/[0.02] lg:hidden print:hidden"
            role="group"
            aria-label={`${t.workspace.print} / ${t.workspace.saveAsPdf}`}
          >
            <WorkspaceToolbarExportButtons
              t={t}
              onPrint={printInvoicePreview}
              onDownloadPdf={handleDownloadPdfClick}
              pdfAriaDescribedBy={pdfErrorMessage ? 'pdf-export-error' : undefined}
            />
          </div>
        </div>
      </main>

      {/* Mobile: floating quick preview (avoid scrolling down to the preview section) */}
      {!mobilePreviewOpen ? (
        <button
          type="button"
          className="fixed bottom-4 right-4 z-[90] inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/25 ring-1 ring-white/10 lg:hidden print:hidden"
          onClick={() => setMobilePreviewOpen(true)}
          aria-label={t.workspace.mobilePreviewOpenAriaLabel}
        >
          {t.workspace.mobilePreviewOpen}
        </button>
      ) : null}

      {mobilePreviewOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden print:hidden" role="dialog" aria-modal="true">
          {/* Backdrop (always closes) */}
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[1px]"
            aria-label={t.workspace.mobilePreviewCloseAriaLabel}
            onClick={() => setMobilePreviewOpen(false)}
          />

          {/* Scroll container */}
          <div className="relative h-full overflow-y-auto p-3 sm:p-4">
            <div className="mx-auto w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 z-10 mb-3 flex justify-end">
                <button
                  ref={mobilePreviewCloseButtonRef}
                  type="button"
                  className="rounded-lg border border-zinc-200 bg-white/95 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                  onClick={() => setMobilePreviewOpen(false)}
                >
                  {t.workspace.mobilePreviewClose}
                </button>
              </div>

              <div className="rounded-xl bg-white p-2 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-950/[0.04]">
                <InvoicePreview
                  t={t}
                  localeForFormatting={localeForFormatting}
                  activeCurrencyCode={activeCurrencyCode}
                  invoiceDocument={invoiceDocument}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WorkspaceToolbarExportButtons({
  t,
  onPrint,
  onDownloadPdf,
  pdfAriaDescribedBy,
}: {
  t: TranslationMessages
  onPrint: () => void
  onDownloadPdf: () => void
  pdfAriaDescribedBy?: string
}) {
  return (
    <div className={toolbarExportGroupClassName}>
      <button
        type="button"
        className={`group ${secondaryButtonClassName} order-2 w-full bg-white/90 sm:order-1 sm:w-auto`}
        onClick={onPrint}
      >
        <PrintIcon />
        {t.workspace.print}
      </button>
      <button
        type="button"
        className={`${toolbarPrimaryButtonClassName} order-1 w-full sm:order-3 sm:w-auto`}
        onClick={onDownloadPdf}
        aria-describedby={pdfAriaDescribedBy}
      >
        <DownloadPdfIcon />
        {t.workspace.saveAsPdf}
      </button>
    </div>
  )
}
