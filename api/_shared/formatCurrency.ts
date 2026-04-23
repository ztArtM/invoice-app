import type { SupportedCurrencyCode } from './invoiceTypes.js'

export function formatCurrencyAmount(amount: number, currencyCode: SupportedCurrencyCode, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    // Avoid "DKK 123.00" in English locales; prefer a human-friendly symbol (e.g. "kr").
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

