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
      className="rounded-xl border border-zinc-200/90 bg-white p-6 text-[0.9375rem] leading-relaxed text-zinc-800 shadow-lg shadow-zinc-200/30 ring-1 ring-zinc-900/[0.04] sm:p-8 sm:shadow-xl lg:px-10 lg:py-9 print:rounded-none print:border-0 print:p-0 print:shadow-none print:ring-0"
      role="region"
      aria-label={p.ariaLabel}
    >
      {/* Document title, reference #, dates */}
      <header className="border-b-2 border-zinc-900/10 pb-8 print:border-zinc-300">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              {documentTitle}
            </p>
            <h2 className="min-w-0 break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-[1.75rem] [overflow-wrap:anywhere]">
              <PreviewText value={invoiceDocument.invoiceNumber} />
            </h2>
            <p className="text-sm text-zinc-500">{numberLabel}</p>
          </div>

          <dl className="grid min-w-0 w-full max-w-full grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-lg border border-zinc-200/90 bg-zinc-50/70 p-4 text-sm sm:max-w-[17rem] lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)] print:border-zinc-300 print:bg-white">
            <dt className="min-w-0 text-zinc-500 [overflow-wrap:anywhere]">{p.issueDate}</dt>
            <dd className="min-w-0 break-words text-left font-semibold text-zinc-900 sm:text-right [overflow-wrap:anywhere]">
              {formatDateForDisplay(invoiceDocument.issueDate, localeForFormatting)}
            </dd>
            <dt className="min-w-0 text-zinc-500 [overflow-wrap:anywhere]">{endDateLabel}</dt>
            <dd className="min-w-0 break-words text-left font-semibold text-zinc-900 sm:text-right [overflow-wrap:anywhere]">
              {formatDateForDisplay(invoiceDocument.dueDate, localeForFormatting)}
            </dd>
            {currencyCodeLabel ? (
              <>
                <dt className="min-w-0 text-zinc-500 [overflow-wrap:anywhere]">{p.currency}</dt>
                <dd className="min-w-0 break-all text-left font-semibold tabular-nums text-zinc-900 sm:text-right [overflow-wrap:anywhere]">
                  {currencyCodeLabel}
                </dd>
              </>
            ) : null}
          </dl>
        </div>
      </header>

      {/* Seller & client — side-by-side panels */}
      <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-8">
        <PreviewPartyPanel label={p.from}>
          <p className="min-w-0 break-words text-base font-semibold text-zinc-900 [overflow-wrap:anywhere]">
            <PreviewText value={invoiceDocument.seller.name} />
          </p>
          <div className="mt-3">
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
          <p className="min-w-0 break-words text-base font-semibold text-zinc-900 [overflow-wrap:anywhere]">
            <PreviewText value={invoiceDocument.client.name} />
          </p>
          <div className="mt-3">
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

      {/* Line items */}
      <section className="mt-12 min-w-0" aria-label={p.lineItemsHeading}>
        <div className="mt-5">
          <PreviewLineItems
            lineItems={invoiceDocument.lineItems}
            thDescription={p.thDescription}
            thQty={p.thQty}
            thUnitPrice={p.thUnitPrice}
            thAmount={p.thAmount}
            activeCurrencyCode={activeCurrencyCode}
            localeForFormatting={localeForFormatting}
          />
        </div>
      </section>

      {/* Totals — right-aligned “invoice slip” */}
      <div className="mt-10 flex min-w-0 justify-start sm:justify-end print:justify-end">
        <div className="invoice-break-inside-avoid w-full min-w-0 sm:max-w-[22rem]">
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
          className="invoice-break-inside-avoid mt-8 rounded-lg border border-amber-200/70 bg-amber-50/60 p-4 text-sm text-amber-900 print:border-amber-200 print:bg-white"
          aria-label="Tax note"
        >
          <p className="break-words font-medium [overflow-wrap:anywhere]">{taxNoteTrimmed}</p>
        </section>
      ) : null}

      {/* Notes, MobilePay, bank — one scannable footer band */}
      <footer className="mt-12 min-w-0 space-y-8 rounded-lg border border-zinc-200/80 bg-zinc-50/40 p-6 sm:p-7 print:mt-10 print:border-zinc-300 print:bg-white">
        {notesTrimmed ? (
          <section className="min-w-0" aria-label={p.notes}>
            <PreviewSectionTitle>{p.notes}</PreviewSectionTitle>
            <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-zinc-700 [overflow-wrap:anywhere]">
              {notesTrimmed}
            </p>
          </section>
        ) : null}

        {mobilePayTrimmed ? (
          <section
            className={`min-w-0 ${notesTrimmed ? 'border-t border-zinc-200/80 pt-8 print:border-zinc-200' : ''}`}
            aria-label={p.mobilePay}
          >
            <PreviewSectionTitle>{p.mobilePay}</PreviewSectionTitle>
            <p className="mt-3 break-all text-base font-semibold tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
              {mobilePayTrimmed}
            </p>
          </section>
        ) : null}

        <section
          className={`min-w-0 ${notesTrimmed || mobilePayTrimmed ? 'border-t border-zinc-200/80 pt-8 print:border-zinc-200' : ''}`}
          aria-label={p.paymentDetails}
        >
          <PreviewSectionTitle>{p.paymentDetails}</PreviewSectionTitle>
          <dl className="mt-5 grid min-w-0 gap-5 text-sm sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
            <PreviewPaymentField label={p.bank} value={invoiceDocument.paymentDetails.bankName} />
            <PreviewPaymentField
              label={p.registrationNumber}
              value={invoiceDocument.paymentDetails.registrationNumber}
            />
            <PreviewPaymentField
              label={p.accountNumber}
              value={invoiceDocument.paymentDetails.accountNumber}
            />
            <PreviewPaymentField
              label={p.accountHolder}
              value={invoiceDocument.paymentDetails.accountHolder}
            />
            <PreviewPaymentField
              label={p.iban}
              value={invoiceDocument.paymentDetails.iban}
              mono
            />
            <PreviewPaymentField
              label={p.bicSwift}
              value={invoiceDocument.paymentDetails.bicOrSwift}
              mono
            />
            {invoiceDocument.paymentDetails.paymentReference.trim() ? (
              <div className="min-w-0 sm:col-span-2">
                <dt className="text-xs font-medium text-zinc-500">{p.paymentRef}</dt>
                <dd className="mt-1 break-words font-medium text-zinc-900">
                  <PreviewText value={invoiceDocument.paymentDetails.paymentReference} />
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      </footer>
    </div>
  )
}

function PreviewSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="min-w-0 break-words text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-400 [overflow-wrap:anywhere]">
      {children}
    </h3>
  )
}

function PreviewPartyPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="invoice-break-inside-avoid min-w-0 rounded-lg border border-zinc-200/90 bg-zinc-50/50 p-5 sm:p-6 print:border-zinc-300 print:bg-white">
      <PreviewSectionTitle>{label}</PreviewSectionTitle>
      <div className="mt-4 min-w-0">{children}</div>
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
    <div className="min-w-0">
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd
        className={`mt-1 break-words font-medium text-zinc-900 [overflow-wrap:anywhere] ${mono ? 'break-all font-mono text-[0.8125rem]' : ''}`}
      >
        <PreviewText value={value} />
      </dd>
    </div>
  )
}
