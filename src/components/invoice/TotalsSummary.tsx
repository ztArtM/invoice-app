import type { SupportedCurrencyCode } from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import { formatCurrencyAmount } from '../../utils/formatCurrency'
import type { InvoiceTotalsSummary } from '../../utils/invoiceCalculations'

export type TotalsSummaryVariant = 'default' | 'nested' | 'preview'

export interface TotalsSummaryProps {
  t: TranslationMessages
  localeForFormatting: string
  activeCurrencyCode: SupportedCurrencyCode
  /** Numbers from `calculateInvoiceTotalsSummary` — this component only displays them. */
  totals: InvoiceTotalsSummary
  /** Shown in the VAT line label, e.g. "VAT (25%)". */
  vatRatePercent: number
  /** Extra Tailwind classes (e.g. print styles on the preview sheet). */
  className?: string
  /**
   * `default` — form / general panel.
   * `nested` — lighter block inside the form line-items card.
   * `preview` — stronger emphasis on the invoice preview (and print).
   */
  variant?: TotalsSummaryVariant
  /** @deprecated Use `variant="nested"` instead. */
  nested?: boolean
}

/**
 * Read-only totals block: subtotal, VAT, grand total.
 * All math lives in `invoiceCalculations`; this file only formats and lays out.
 */
export function TotalsSummary({
  t,
  localeForFormatting,
  activeCurrencyCode,
  totals,
  vatRatePercent,
  className = '',
  variant: variantProp,
  nested = false,
}: TotalsSummaryProps) {
  const variant: TotalsSummaryVariant = variantProp ?? (nested ? 'nested' : 'default')
  const { subtotalExcludingVat, vatAmount, grandTotalIncludingVat } = totals
  const vatLabel = t.totals.vatWithPercent.replace('{{percent}}', String(vatRatePercent))

  const sectionClassNames = [
    variant === 'preview'
      ? 'min-w-0 rounded-xl border-2 border-zinc-300/90 bg-zinc-50 px-3 py-3 sm:px-4 print:border-zinc-400 print:bg-white'
      : variant === 'nested'
        ? 'rounded-lg border border-zinc-200/80 bg-white px-4 py-4'
        : 'rounded-xl border border-zinc-200 bg-zinc-50/90 px-4 py-4 shadow-inner shadow-zinc-900/5',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const headingClass =
    variant === 'preview'
      ? 'text-[0.65rem] font-semibold tracking-wide text-zinc-500'
      : 'text-xs font-semibold uppercase tracking-wide text-zinc-500'

  const grandRowClass =
    variant === 'preview'
      ? 'flex justify-between gap-3 border-t-2 border-zinc-900/20 bg-zinc-100/80 px-2 py-2 -mx-1 text-base font-bold tracking-tight text-zinc-900 print:border-zinc-400 print:bg-zinc-50'
      : 'flex justify-between gap-4 border-t border-zinc-200/80 pt-3 text-base font-semibold text-zinc-900'

  return (
    <section aria-label={t.totals.ariaLabel} className={sectionClassNames}>
      <h3 className={headingClass}>{t.totals.heading}</h3>
      <dl className={variant === 'preview' ? 'mt-2 space-y-1.5 text-sm' : 'mt-4 space-y-2.5 text-sm'}>
        {variant === 'preview' ? (
          <>
            <div className="flex min-w-0 items-start justify-between gap-3 text-zinc-600">
              <dt className="min-w-0 max-w-[58%] shrink break-words [overflow-wrap:anywhere]">
                {t.totals.subtotalExVat}
              </dt>
              <dd className="min-w-0 max-w-[42%] shrink-0 break-all text-right tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
                {formatCurrencyAmount(subtotalExcludingVat, activeCurrencyCode, localeForFormatting)}
              </dd>
            </div>
            <div className="flex min-w-0 items-start justify-between gap-3 text-zinc-600">
              <dt className="min-w-0 max-w-[58%] shrink break-words [overflow-wrap:anywhere]">{vatLabel}</dt>
              <dd className="min-w-0 max-w-[42%] shrink-0 break-all text-right tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
                {formatCurrencyAmount(vatAmount, activeCurrencyCode, localeForFormatting)}
              </dd>
            </div>
            <div className={`${grandRowClass} min-w-0 items-start`}>
              <dt className="min-w-0 max-w-[55%] shrink break-words [overflow-wrap:anywhere]">
                {t.totals.totalDue}
              </dt>
              <dd className="min-w-0 max-w-[45%] shrink-0 break-all text-right tabular-nums text-zinc-900 [overflow-wrap:anywhere]">
                {formatCurrencyAmount(grandTotalIncludingVat, activeCurrencyCode, localeForFormatting)}
              </dd>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between gap-4 text-zinc-600">
              <dt>{t.totals.subtotalExVat}</dt>
              <dd className="tabular-nums text-zinc-900">
                {formatCurrencyAmount(subtotalExcludingVat, activeCurrencyCode, localeForFormatting)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-zinc-600">
              <dt>{vatLabel}</dt>
              <dd className="tabular-nums text-zinc-900">
                {formatCurrencyAmount(vatAmount, activeCurrencyCode, localeForFormatting)}
              </dd>
            </div>
            <div className={grandRowClass}>
              <dt>{t.totals.totalDue}</dt>
              <dd className="tabular-nums text-zinc-900">
                {formatCurrencyAmount(grandTotalIncludingVat, activeCurrencyCode, localeForFormatting)}
              </dd>
            </div>
          </>
        )}
      </dl>
    </section>
  )
}
