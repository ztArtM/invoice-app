import { jsPDF } from 'jspdf'
import { describe, expect, it } from 'vitest'
import { invoiceOverflowTestDocument } from '../constants/invoiceOverflowTestFixture'
import { calculateInvoiceTotalsSummary } from './invoiceCalculations'

describe('invoice overflow test fixture', () => {
  it('produces finite totals for extreme quantities and prices', () => {
    const totals = calculateInvoiceTotalsSummary(
      invoiceOverflowTestDocument.lineItems,
      invoiceOverflowTestDocument.vat.ratePercent,
    )
    expect(Number.isFinite(totals.subtotalExcludingVat)).toBe(true)
    expect(Number.isFinite(totals.vatAmount)).toBe(true)
    expect(Number.isFinite(totals.grandTotalIncludingVat)).toBe(true)
  })

  /**
   * jsPDF bundles `save` on instances (not always on prototype); we still verify the same
   * `splitTextToSize` path the PDF exporter uses for wrapping extreme user input.
   */
  it('jspdf splits fixture strings into multiple lines for narrow mm widths', () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const narrow = 32
    expect(doc.splitTextToSize(invoiceOverflowTestDocument.seller.name, narrow).length).toBeGreaterThan(2)
    expect(doc.splitTextToSize(invoiceOverflowTestDocument.lineItems[0]!.description, 90).length).toBeGreaterThan(
      2,
    )
  })
})
