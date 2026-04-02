import type { CompanyLookupResult } from './types'

/**
 * Turns structured lookup fields into the single address textarea your invoice form uses.
 * Order: street line, then "postal city" on the next line (Danish style).
 */
export function formatAddressForInvoice(company: CompanyLookupResult): string {
  const lines: string[] = []
  const street = company.addressLine.trim()
  if (street) lines.push(street)
  const postalCity = [company.postalCode.trim(), company.city.trim()].filter(Boolean).join(' ')
  if (postalCity) lines.push(postalCity)
  return lines.join('\n')
}
