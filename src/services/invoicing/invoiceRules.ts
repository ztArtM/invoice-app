import type { InvoiceType } from '../../types/invoiceDocument'

const EU_COUNTRY_CODES = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
])

export function isEuCountryCode(countryCode: string): boolean {
  return EU_COUNTRY_CODES.has(countryCode.trim().toUpperCase())
}

export function determineInvoiceType(args: {
  sellerCountryCode: string
  buyerCountryCode: string
  buyerIsBusiness: boolean
}): InvoiceType {
  const seller = args.sellerCountryCode.trim().toUpperCase()
  const buyer = args.buyerCountryCode.trim().toUpperCase()

  // Denmark domestic invoices: VAT applies regardless of buyer being private or business.
  if (seller === 'DK' && buyer === 'DK') return 'domestic_dk'

  if (!args.buyerIsBusiness) return 'private_customer'

  if (seller === 'DK' && isEuCountryCode(buyer) && buyer !== 'DK') return 'eu_b2b_reverse_charge'

  if (seller === 'DK' && buyer && !isEuCountryCode(buyer)) return 'non_eu_export'

  // Fallback: if not covered, treat as private-style to avoid accidental reverse charge.
  return 'private_customer'
}

export function determineVatRatePercent(args: {
  invoiceType: InvoiceType
  domesticVatRatePercent: number
}): number {
  if (args.invoiceType === 'domestic_dk') return args.domesticVatRatePercent
  if (args.invoiceType === 'eu_b2b_reverse_charge') return 0
  if (args.invoiceType === 'non_eu_export') return 0
  return 0
}

export interface TaxNoteMessages {
  reverseCharge: string
  exportOutsideScope: string
}

const DEFAULT_TAX_NOTE_MESSAGES_EN: TaxNoteMessages = {
  reverseCharge: 'Reverse charge – VAT not charged',
  exportOutsideScope: 'Export / outside scope – VAT not charged',
}

export function determineTaxNote(
  invoiceType: InvoiceType,
  messages: TaxNoteMessages = DEFAULT_TAX_NOTE_MESSAGES_EN,
): string {
  if (invoiceType === 'eu_b2b_reverse_charge') return messages.reverseCharge
  if (invoiceType === 'non_eu_export') return messages.exportOutsideScope
  return ''
}

export function formatVatNumber(countryCode: string, rawVatNumber: string, cvrDigits?: string): string {
  const cc = countryCode.trim().toUpperCase()
  const vat = rawVatNumber.trim().replace(/\s+/g, '')
  if (vat) return vat
  if (cc === 'DK' && cvrDigits && /^\d{8}$/.test(cvrDigits)) return `DK${cvrDigits}`
  return ''
}

