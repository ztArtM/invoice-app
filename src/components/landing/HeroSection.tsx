import type { TranslationMessages } from '../../constants/translations'
import { primaryButtonClassName, secondaryButtonClassName } from '../invoice/buttonStyles'
import { FormSection } from '../invoice/FormSection'
import { formInputClassName, formLabelClassName, formSelectClassName } from '../invoice/formFieldClassNames'
import { PreviewLineItems } from '../invoice/PreviewLineItems'
import { TotalsSummary } from '../invoice/TotalsSummary'
import { calculateInvoiceTotalsSummary } from '../../utils/invoiceCalculations'
import { getLocaleForLanguage } from '../../constants/localization'

export interface HeroSectionProps {
  onStartApp: () => void
  onStartExample?: () => void
  t: TranslationMessages
}

function InvoicePreviewMock({ t }: { t: TranslationMessages }) {
  const isDanish = t.workspace.languageDanish === 'Dansk'
  const localeForFormatting = getLocaleForLanguage(isDanish ? 'da' : 'en')
  const activeCurrencyCode = 'DKK' as const
  const vatRatePercent = 25
  const lineItems = [{ id: 'hero-line-1', description: 'Webdesign', quantity: 1, unitPrice: 5000 }]
  const totals = calculateInvoiceTotalsSummary(lineItems, vatRatePercent)

  return (
    <div className="relative">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-800/10 via-transparent to-emerald-500/10 blur-2xl" />

      <div className=" max-w-190 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-900/[0.03] sm:p-3">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/80" />
            <p className="text-sm font-semibold text-zinc-900">{isDanish ? 'Faktura' : 'Invoice'}</p>
            <span className="text-xs font-medium text-zinc-400">{isDanish ? 'Eksempel' : 'Example'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[0.7rem] font-semibold text-zinc-700">
              {isDanish ? 'Moms' : 'VAT'} {vatRatePercent}%
            </span>
            <span className="rounded-md bg-brand-800 px-2 py-1 text-[0.7rem] font-semibold text-white shadow-sm shadow-brand-950/15">
              PDF
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-5">
          <div className="min-w-0 space-y-4">
            <FormSection title={isDanish ? 'Fakturadetaljer' : 'Invoice details'} compact>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={formLabelClassName}>{isDanish ? 'Kundenavn' : 'Client name'}</label>
                  <input
                    className={`${formInputClassName} disabled:bg-zinc-50 disabled:text-zinc-800 disabled:opacity-100`}
                    value="Acme ApS"
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <label className={formLabelClassName}>{isDanish ? 'CVR-nummer' : 'CVR number'}</label>
                  <input
                    className={`${formInputClassName} disabled:bg-zinc-50 disabled:text-zinc-700 disabled:opacity-100`}
                    value="12 34 56 78"
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <label className={formLabelClassName}>{isDanish ? 'Fakturadato' : 'Invoice date'}</label>
                  <input
                    className={`${formInputClassName} disabled:bg-zinc-50 disabled:text-zinc-700 disabled:opacity-100`}
                    value={isDanish ? '14.04.2026' : '14/04/2026'}
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <label className={formLabelClassName}>{isDanish ? 'Moms' : 'VAT'}</label>
                  <select
                    className={`${formSelectClassName} disabled:bg-zinc-50 disabled:text-zinc-800 disabled:opacity-100`}
                    value={String(vatRatePercent)}
                    disabled
                  >
                    <option value="25">{vatRatePercent}%</option>
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title={isDanish ? 'Linjer' : 'Line items'} compact>
              <div className="hero-invoice-preview rounded-lg border border-zinc-200/80 bg-white px-3 py-3">
                <PreviewLineItems
                  lineItems={lineItems}
                  thDescription={isDanish ? 'Beskrivelse' : 'Description'}
                  thQty={isDanish ? 'Antal' : 'Qty'}
                  thUnitPrice={isDanish ? 'Pris' : 'Unit price'}
                  thAmount={isDanish ? 'Beløb' : 'Amount'}
                  activeCurrencyCode={activeCurrencyCode}
                  localeForFormatting={localeForFormatting}
                />
              </div>
            </FormSection>
          </div>

          <div className="min-w-0 space-y-4">
            <FormSection
              title={isDanish ? 'Forhåndsvisning' : 'Preview'}
              description={isDanish ? 'Samme udtryk som PDF' : 'Matches the PDF'}
              compact
            >
              <TotalsSummary
                t={t}
                localeForFormatting={localeForFormatting}
                activeCurrencyCode={activeCurrencyCode}
                totals={totals}
                vatRatePercent={vatRatePercent}
                variant="nested"
                className="hero-totals-summary"
              />
              <div className="rounded-lg bg-zinc-100/80 px-3 py-2">
                <p className="text-xs text-zinc-600">
                  {isDanish
                    ? 'Download som PDF når alt ser rigtigt ud.'
                    : 'Download as PDF when everything looks right.'}
                </p>
              </div>
            </FormSection>
          </div>
        </div>
      </div>

      {/* small “PDF” cue card */}
      <div className="pointer-events-none absolute -bottom-6 -right-4 hidden sm:block">
        <div className="rotate-[2deg] rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-lg shadow-zinc-900/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">PDF‑faktura</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">Ser professionel ud</p>
        </div>
      </div>
    </div>
  )
}

export function HeroSection({ onStartApp, onStartExample, t }: HeroSectionProps) {
  const l = t.landing
  const supportPoints = [l.heroSupport1, l.heroSupport2, l.heroSupport3].filter(Boolean)

  return (
    <section className="relative border-b border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50/80 to-zinc-50 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <div className="w-full">
        {/*
          Full-width grid so the mock can sit flush to the viewport right (25px inset).
          Left column aligns with centered max-w-7xl content using the same horizontal offset.
        */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 xl:gap-12">
          <div className="px-4 text-center sm:px-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-0 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-800/90 sm:text-sm">
              {l.heroKicker}
            </p>
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {l.heroHeadline}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg lg:mx-0">
              {l.heroSub}
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
              <button
                type="button"
                className={`${primaryButtonClassName} w-full min-h-12 px-6 text-base sm:w-auto`}
                onClick={onStartApp}
              >
                {l.heroCtaPrimary}
              </button>
              <a
                href="#hero-example"
                className={`${secondaryButtonClassName} w-full min-h-12 justify-center text-base sm:w-auto`}
              >
                {l.heroCtaSecondary}
              </a>
              {onStartExample ? (
                <button
                  type="button"
                  className={`${secondaryButtonClassName} w-full min-h-12 justify-center text-base sm:w-auto`}
                  onClick={onStartExample}
                >
                  {l.heroTryExample}
                </button>
              ) : null}
            </div>

            <ul className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-zinc-600 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2 lg:justify-start">
              {supportPoints.map((text) => (
                <li key={text} className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.3a1 1 0 0 1-1.42.004L3.29 9.28a1 1 0 1 1 1.42-1.4l3.06 3.107 6.54-6.57a1 1 0 0 1 1.414-.006Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {l.heroTrustLine ? (
              <p className="mx-auto mt-4 max-w-xl text-xs font-medium text-zinc-500 lg:mx-0">
                {l.heroTrustLine}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 px-4 sm:px-6 lg:justify-self-end lg:px-0 lg:pr-[25px]">
            <InvoicePreviewMock t={t} />
          </div>
        </div>

        {/* anchor target for “Se eksempel” */}
        <span id="hero-example" className="sr-only" />
      </div>
    </section>
  )
}
