import type { TranslationMessages } from '../../constants/translations'
import { getLocaleForLanguage } from '../../constants/localization'
import { calculateInvoiceTotalsSummary } from '../../utils/invoiceCalculations'
import { PreviewLineItems } from '../invoice/PreviewLineItems'
import { TotalsSummary } from '../invoice/TotalsSummary'

export interface HomepageTrustLayerSectionProps {
  t: TranslationMessages
}

const shell = 'mx-auto max-w-6xl px-4 sm:px-6'

export function HomepageTrustLayerSection({ t }: HomepageTrustLayerSectionProps) {
  const l = t.landing
  const isDanish = t.workspace.languageDanish === 'Dansk'

  const localeForFormatting = getLocaleForLanguage(isDanish ? 'da' : 'en')
  const activeCurrencyCode = 'DKK' as const
  const vatRatePercent = 25
  const lineItems = [{ id: 'trust-line-1', description: isDanish ? 'Webdesign' : 'Web design', quantity: 1, unitPrice: 5000 }]
  const totals = calculateInvoiceTotalsSummary(lineItems, vatRatePercent)

  const bullets = [l.trustBullets1, l.trustBullets2, l.trustBullets3].filter(Boolean)

  return (
    <section className="border-b border-zinc-100 bg-white py-16 sm:py-20" aria-labelledby="homepage-trust-heading">
      <div className={shell}>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <h2 id="homepage-trust-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {l.trustLayerHeading}
            </h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-zinc-600 sm:text-lg">
              {l.trustLayerCompliance}
            </p>

            <p className="mt-5 text-sm font-semibold text-zinc-900">{l.trustLayerSocialProof}</p>

            <ul className="mt-6 space-y-3">
              {bullets.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm text-zinc-700">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.3a1 1 0 0 1-1.42.004L3.29 9.28a1 1 0 1 1 1.42-1.4l3.06 3.107 6.54-6.57a1 1 0 0 1 1.414-.006Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="trust-invoice-preview rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 shadow-sm shadow-zinc-900/[0.04] ring-1 ring-zinc-950/[0.02] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {isDanish ? 'Eksempel' : 'Example'}
                </p>
                <p className="mt-1 text-base font-semibold tracking-tight text-zinc-900">{l.trustLayerExampleRef}</p>
              </div>
              <span className="rounded-md bg-brand-800 px-2 py-1 text-[0.7rem] font-semibold text-white shadow-sm shadow-brand-950/15">
                PDF
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-zinc-200/80 bg-white p-4">
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

            <div className="mt-4">
              <TotalsSummary
                t={t}
                localeForFormatting={localeForFormatting}
                activeCurrencyCode={activeCurrencyCode}
                totals={totals}
                vatRatePercent={vatRatePercent}
                variant="preview"
                className="trust-totals-summary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

