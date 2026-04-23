import type { LineItem } from './invoiceTypes'

export function calculateLineItemTotal(lineItem: LineItem): number {
  return lineItem.quantity * lineItem.unitPrice
}

export function calculateInvoiceTotalsSummary(lineItems: readonly LineItem[], vatRatePercent: number): {
  subtotalExcludingVat: number
  vatAmount: number
  grandTotalIncludingVat: number
} {
  const subtotalExcludingVat = lineItems.reduce((sum, li) => sum + calculateLineItemTotal(li), 0)
  const vatAmount = subtotalExcludingVat * (vatRatePercent / 100)
  const grandTotalIncludingVat = subtotalExcludingVat + vatAmount
  return { subtotalExcludingVat, vatAmount, grandTotalIncludingVat }
}

