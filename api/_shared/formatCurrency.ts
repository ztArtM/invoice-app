import type { SupportedCurrencyCode } from './invoiceTypes.js'

export function formatCurrencyAmount(amount: number, currencyCode: SupportedCurrencyCode, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

