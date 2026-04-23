import type { ReactNode } from 'react'
import type { SupportedCurrencyCode } from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument } from '../../types/invoiceDocument'
import { formatDateForDisplay } from '../../utils/formatDate'
import { calculateInvoiceTotalsSummary } from '../../utils/invoiceCalculations'
import { PreviewAddress, PreviewText } from './PreviewDisplay'
import { PreviewLineItems } from './PreviewLineItems'
import { TotalsSummary } from './TotalsSummary'

interface InvoicePreviewProps {
  t: TranslationMessages
  localeForFormatting: string
  activeCurrencyCode: SupportedCurrencyCode
  invoiceDocument: InvoiceDocument
}

/**
 * Read-only invoice / quote for the right column and printing.
 * Totals use `calculateInvoiceTotalsSummary`; line rows use `PreviewLineItems` + shared calculators.
 */
export function InvoicePreview({
  t,
  localeForFormatting,
  activeCurrencyCode,
  invoiceDocument,
}: InvoicePreviewProps) {
  const p = t.preview
  const totals = calculateInvoiceTotalsSummary(
    invoiceDocument.lineItems,
    invoiceDocument.vat.ratePercent,
  )
  const currencyCodeLabel = invoiceDocument.currency.code.trim().toUpperCase()

  const isQuote = invoiceDocument.documentKind === 'quote'
  const documentTitle = isQuote ? p.documentQuote : p.documentInvoice
  const numberLabel = isQuote ? p.numberQuote : p.numberInvoice
  const endDateLabel = isQuote ? p.validUntil : p.dueDate

  const notesTrimmed = invoiceDocument.notes.trim()
  const mobilePayTrimmed = invoiceDocument.mobilePayNumberOrBox.trim()
  const taxNoteTrimmed = invoiceDocument.taxNote.trim()

  const sellerIdLabel = invoiceDocument.invoiceType === 'domestic_dk' ? p.cvrLabel : p.vatNoLabel
  const buyerIdLabel = invoiceDocument.invoiceType === 'domestic_dk' ? p.cvrLabel : p.vatNoLabel

  return (
    <div
      id="invoice-preview"
      className="rounded-xl border border-zinc-200/90 bg-white p-4 text-[0.9375rem] leading-normal text-zinc-800 shadow-lg shadow-zinc-200/30 ring-1 ring-zinc-900/[0.04] sm:p-5 sm:shadow-xl lg:px-6 lg:py-5 print:rounded-none print:border-0 print:p-0 print:shadow-none print:ring-0"
      role="region"
      aria-label={p.ariaLabel}
    >
      {/* Document title + compact metadata (number, dates, currency) */}
      <header className="border-b border-zinc-900/15 pb-3 print:border-zinc-400">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="min-w-0 shrink-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-900">{documentTitle}</p>
          </div>

          <dl className="grid min-w-0 w-full max-w-[19rem] shrink-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm shadow-zinc-900/[0.03] print:border-zinc-300 print:shadow-none">
            <dt className="min-w-0 text-[0.7rem] font-medium text-zinc-500 [overflow-wrap:anywhere]">{numberLabel}</dt>
            <dd className="min-w-0 text-right text-base font-bold tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
              {invoiceDocument.invoiceNumber.trim() ? (
                <PreviewText value={invoiceDocument.invoiceNumber} />
              ) : (
                <span className="font-semibold text-zinc-400">—</span>
              )}
            </dd>
            <dt className="min-w-0 text-[0.7rem] font-medium text-zinc-500 [overflow-wrap:anywhere]">{p.issueDate}</dt>
            <dd className="min-w-0 text-right font-semibold tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
              {formatDateForDisplay(invoiceDocument.issueDate, localeForFormatting)}
            </dd>
            <dt className="min-w-0 text-[0.7rem] font-medium text-zinc-500 [overflow-wrap:anywhere]">{endDateLabel}</dt>
            <dd className="min-w-0 text-right font-semibold tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
              {formatDateForDisplay(invoiceDocument.dueDate, localeForFormatting)}
            </dd>
            {currencyCodeLabel ? (
              <>
                <dt className="min-w-0 text-[0.7rem] font-medium text-zinc-500 [overflow-wrap:anywhere]">{p.currency}</dt>
                <dd className="min-w-0 text-right font-semibold tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
                  {currencyCodeLabel}
                </dd>
              </>
            ) : null}
          </dl>
        </div>
      </header>

      {/* Seller & client — two clear blocks */}
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-6">
        <PreviewPartyPanel label={p.from}>
          <p className="min-w-0 break-words text-base font-semibold leading-snug text-zinc-900 [overflow-wrap:anywhere]">
            <PreviewText value={invoiceDocument.seller.name} />
          </p>
          <div className="mt-2 [&_p]:leading-snug">
            <PreviewAddress value={invoiceDocument.seller.address} />
          </div>
          {invoiceDocument.seller.sellerType === 'company' &&
          invoiceDocument.invoiceType === 'domestic_dk' &&
          invoiceDocument.seller.sellerCvrNumber.trim() ? (
            <p className="mt-2 min-w-0 break-all text-xs text-zinc-600 [overflow-wrap:anywhere]">
              <span className="font-medium text-zinc-700">{sellerIdLabel}:</span>{' '}
              <span className="tabular-nums">{invoiceDocument.seller.sellerCvrNumber.trim()}</span>
            </p>
          ) : null}
          {invoiceDocument.seller.sellerType === 'company' &&
          invoiceDocument.invoiceType !== 'domestic_dk' &&
          invoiceDocument.seller.vatNumber.trim() ? (
            <p className="mt-2 min-w-0 break-all text-xs text-zinc-600 [overflow-wrap:anywhere]">
              <span className="font-medium text-zinc-700">{sellerIdLabel}:</span>{' '}
              <span className="tabular-nums">{invoiceDocument.seller.vatNumber.trim()}</span>
            </p>
          ) : null}
        </PreviewPartyPanel>

        <PreviewPartyPanel label={p.billTo}>
          <p className="min-w-0 break-words text-base font-semibold leading-snug text-zinc-900 [overflow-wrap:anywhere]">
            <PreviewText value={invoiceDocument.client.name} />
          </p>
          <div className="mt-2 [&_p]:leading-snug">
            <PreviewAddress value={invoiceDocument.client.address} />
          </div>
          {invoiceDocument.invoiceType === 'domestic_dk' &&
          invoiceDocument.client.clientType === 'company' &&
          invoiceDocument.client.clientCvrNumber.trim() ? (
            <p className="mt-2 min-w-0 break-all text-xs text-zinc-600 [overflow-wrap:anywhere]">
              <span className="font-medium text-zinc-700">{buyerIdLabel}:</span>{' '}
              <span className="tabular-nums">{invoiceDocument.client.clientCvrNumber.trim()}</span>
            </p>
          ) : null}
          {invoiceDocument.invoiceType !== 'domestic_dk' &&
          invoiceDocument.client.clientType === 'company' &&
          invoiceDocument.client.vatNumber.trim() ? (
            <p className="mt-2 min-w-0 break-all text-xs text-zinc-600 [overflow-wrap:anywhere]">
              <span className="font-medium text-zinc-700">{buyerIdLabel}:</span>{' '}
              <span className="tabular-nums">{invoiceDocument.client.vatNumber.trim()}</span>
            </p>
          ) : null}
        </PreviewPartyPanel>
      </div>

      {/* Line items (table header already communicates context; keep preview compact) */}
      <section className="mt-5 min-w-0" aria-label={p.lineItemsHeading}>
        <PreviewLineItems
          lineItems={invoiceDocument.lineItems}
          thDescription={p.thDescription}
          thQty={p.thQty}
          thUnitPrice={p.thUnitPrice}
          thAmount={p.thAmount}
          activeCurrencyCode={activeCurrencyCode}
          localeForFormatting={localeForFormatting}
        />
      </section>

      {/* Totals — isolated summary */}
      <div className="mt-5 flex min-w-0 justify-start sm:justify-end print:justify-end">
        <div className="invoice-break-inside-avoid w-full min-w-0 sm:max-w-[23rem]">
          <TotalsSummary
            t={t}
            localeForFormatting={localeForFormatting}
            activeCurrencyCode={activeCurrencyCode}
            totals={totals}
            vatRatePercent={invoiceDocument.vat.ratePercent}
            variant="preview"
          />
        </div>
      </div>

      {taxNoteTrimmed ? (
        <section
          className="invoice-break-inside-avoid mt-4 rounded-lg border border-amber-200/70 bg-amber-50/60 p-2.5 text-sm leading-snug text-amber-900 print:border-amber-200 print:bg-white"
          aria-label="Tax note"
        >
          <p className="break-words font-medium [overflow-wrap:anywhere]">{taxNoteTrimmed}</p>
        </section>
      ) : null}

      {/* Notes + MobilePay + payment — one footer band, lighter than totals */}
      <footer className="mt-5 min-w-0 space-y-3 rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-3 sm:p-4 print:mt-5 print:border-zinc-300 print:bg-white">
        {notesTrimmed ? (
          <section className="min-w-0" aria-label={p.notes}>
            <h3 className="text-[0.65rem] font-semibold tracking-wide text-zinc-400">{p.notes}</h3>
            <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-snug text-zinc-600 [overflow-wrap:anywhere]">
              {notesTrimmed}
            </p>
          </section>
        ) : null}

        {mobilePayTrimmed ? (
          <section
            className={`min-w-0 ${notesTrimmed ? 'border-t border-zinc-200/90 pt-3 print:border-zinc-200' : ''}`}
            aria-label={p.mobilePay}
          >
            <h3 className="text-[0.65rem] font-semibold tracking-wide text-zinc-400">{p.mobilePay}</h3>
            <p className="mt-1.5 break-all text-sm font-semibold tabular-nums text-zinc-800 [overflow-wrap:anywhere]">
              {mobilePayTrimmed}
            </p>
          </section>
        ) : null}

        <section
          className={`min-w-0 pb-4 ${notesTrimmed || mobilePayTrimmed ? 'border-t border-zinc-200/90 pt-3 print:border-zinc-200' : ''}`}
          aria-label={p.paymentDetails}
        >
          <h3 className="text-[0.65rem] font-semibold tracking-wide text-zinc-500">{p.paymentDetails}</h3>
          <dl className="mt-3 grid grid-cols-[minmax(8.5rem,12rem)_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm leading-tight sm:grid-cols-[minmax(9rem,13rem)_minmax(0,1fr)]">
            <PreviewPaymentField label={p.bank} value={invoiceDocument.paymentDetails.bankName} />
            <PreviewPaymentField label={p.registrationNumber} value={invoiceDocument.paymentDetails.registrationNumber} />
            <PreviewPaymentField label={p.accountNumber} value={invoiceDocument.paymentDetails.accountNumber} />
            <PreviewPaymentField label={p.accountHolder} value={invoiceDocument.paymentDetails.accountHolder} />
            <PreviewPaymentField label={p.iban} value={invoiceDocument.paymentDetails.iban} mono />
            <PreviewPaymentField label={p.bicSwift} value={invoiceDocument.paymentDetails.bicOrSwift} mono />
            <PreviewPaymentField label={p.paymentRef} value={invoiceDocument.paymentDetails.paymentReference} />
          </dl>
        </section>
      </footer>
    </div>
  )
}

function PreviewPartyPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="invoice-break-inside-avoid min-w-0 rounded-xl border border-zinc-200/95 bg-white p-3 shadow-sm shadow-zinc-900/[0.04] sm:p-4 print:border-zinc-300 print:shadow-none">
      <h3 className="min-w-0 break-words text-[0.7rem] font-semibold tracking-wide text-zinc-500 [overflow-wrap:anywhere]">
        {label}
      </h3>
      <div className="mt-1.5 min-w-0">{children}</div>
    </section>
  )
}

function PreviewPaymentField({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  if (!value.trim()) return null
  return (
    <>
      <dt className="min-w-0 text-zinc-500 [overflow-wrap:anywhere]">{label}</dt>
      <dd
        className={`min-w-0 font-medium text-zinc-900 [overflow-wrap:anywhere] ${mono ? 'break-all font-mono text-[0.8125rem]' : ''}`}
      >
        <PreviewText value={value} />
      </dd>
    </>
  )
}
