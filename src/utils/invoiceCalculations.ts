import type { LineItem } from '../types/invoiceDocument'

/**
 * Pure invoice math helpers (no React, no formatting, no I/O).
 * All amounts are numbers in the invoice currency; callers format for display.
 */

/** VAT rate as a percentage, e.g. 25 means 25%. */
export type VatRatePercent = number

/** Plain number in invoice currency (before formatting with a symbol). */
export type MoneyAmount = number

/** Subtotal, VAT, and total returned together for UI that needs all three. */
export interface InvoiceTotalsSummary {
  /** Sum of all line-item totals, before VAT. */
  subtotalExcludingVat: MoneyAmount
  /** VAT charged on that subtotal. */
  vatAmount: MoneyAmount
  /** What the client pays: subtotal + VAT. */
  grandTotalIncludingVat: MoneyAmount
}

/**
 * Total for one line: quantity × unit price.
 * Does not include VAT (VAT is applied to the whole subtotal in this app).
 */
export function calculateLineItemTotal(lineItem: LineItem): MoneyAmount {
  return lineItem.quantity * lineItem.unitPrice
}

/**
 * Adds every line-item total to get the invoice subtotal (still before VAT).
 */
export function calculateSubtotalFromLineItems(lineItems: readonly LineItem[]): MoneyAmount {
  return lineItems.reduce((runningSum, lineItem) => {
    return runningSum + calculateLineItemTotal(lineItem)
  }, 0)
}

/**
 * VAT amount from the subtotal and rate.
 * Formula: subtotal × (rate / 100). Rate is a percent (e.g. 19 for 19%).
 */
export function calculateVatAmountFromSubtotal(
  subtotalExcludingVat: MoneyAmount,
  vatRatePercent: VatRatePercent,
): MoneyAmount {
  return subtotalExcludingVat * (vatRatePercent / 100)
}

/**
 * Grand total: subtotal (before VAT) plus the VAT amount.
 */
export function calculateGrandTotalFromSubtotalAndVat(
  subtotalExcludingVat: MoneyAmount,
  vatAmount: MoneyAmount,
): MoneyAmount {
  return subtotalExcludingVat + vatAmount
}

/**
 * Runs subtotal → VAT → grand total in one step (same rules as the functions above).
 */
export function calculateInvoiceTotalsSummary(
  lineItems: readonly LineItem[],
  vatRatePercent: VatRatePercent,
): InvoiceTotalsSummary {
  const subtotalExcludingVat = calculateSubtotalFromLineItems(lineItems)
  const vatAmount = calculateVatAmountFromSubtotal(subtotalExcludingVat, vatRatePercent)
  const grandTotalIncludingVat = calculateGrandTotalFromSubtotalAndVat(
    subtotalExcludingVat,
    vatAmount,
  )

  return {
    subtotalExcludingVat,
    vatAmount,
    grandTotalIncludingVat,
  }
}
