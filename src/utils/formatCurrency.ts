import type { SupportedCurrencyCode } from '../constants/localization'

/**
 * Turns a numeric amount into a currency string for the user (preview, PDF, line totals).
 * Uses the browser’s `Intl.NumberFormat` — no extra npm packages.
 *
 * @param amount — Plain number from your calculations (e.g. 1234.5)
 * @param currencyCode — ISO code: DKK or EUR
 * @param locale — BCP 47 tag from `getLocaleForLanguage` (formatting follows this locale)
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: SupportedCurrencyCode,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
