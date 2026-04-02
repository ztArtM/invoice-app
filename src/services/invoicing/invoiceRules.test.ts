import { describe, expect, test } from 'vitest'
import { determineInvoiceType, determineTaxNote, determineVatRatePercent } from './invoiceRules'

describe('invoice rules', () => {
  test('DK seller → DK buyer business = domestic_dk + 25% VAT', () => {
    const invoiceType = determineInvoiceType({
      sellerCountryCode: 'DK',
      buyerCountryCode: 'DK',
      buyerIsBusiness: true,
    })
    expect(invoiceType).toBe('domestic_dk')
    expect(
      determineVatRatePercent({
        invoiceType,
        domesticVatRatePercent: 25,
      }),
    ).toBe(25)
    expect(determineTaxNote(invoiceType)).toBe('')
  })

  test('DK seller → DE buyer business = reverse charge (VAT 0 + note)', () => {
    const invoiceType = determineInvoiceType({
      sellerCountryCode: 'DK',
      buyerCountryCode: 'DE',
      buyerIsBusiness: true,
    })
    expect(invoiceType).toBe('eu_b2b_reverse_charge')
    expect(
      determineVatRatePercent({
        invoiceType,
        domesticVatRatePercent: 25,
      }),
    ).toBe(0)
    expect(determineTaxNote(invoiceType)).toContain('Reverse charge')
  })

  test('DK seller → SE buyer business = reverse charge (VAT 0 + note)', () => {
    const invoiceType = determineInvoiceType({
      sellerCountryCode: 'DK',
      buyerCountryCode: 'SE',
      buyerIsBusiness: true,
    })
    expect(invoiceType).toBe('eu_b2b_reverse_charge')
    expect(determineTaxNote(invoiceType)).toContain('Reverse charge')
  })

  test('DK seller → US buyer business = non-EU export (VAT 0 + note)', () => {
    const invoiceType = determineInvoiceType({
      sellerCountryCode: 'DK',
      buyerCountryCode: 'US',
      buyerIsBusiness: true,
    })
    expect(invoiceType).toBe('non_eu_export')
    expect(determineTaxNote(invoiceType)).toContain('Export')
  })

  test('Private buyer never reverse-charged automatically', () => {
    const invoiceType = determineInvoiceType({
      sellerCountryCode: 'DK',
      buyerCountryCode: 'DE',
      buyerIsBusiness: false,
    })
    expect(invoiceType).toBe('private_customer')
    expect(
      determineVatRatePercent({
        invoiceType,
        domesticVatRatePercent: 25,
      }),
    ).toBe(0)
  })

  test('DK seller → DK private buyer still uses domestic VAT', () => {
    const invoiceType = determineInvoiceType({
      sellerCountryCode: 'DK',
      buyerCountryCode: 'DK',
      buyerIsBusiness: false,
    })
    expect(invoiceType).toBe('domestic_dk')
    expect(
      determineVatRatePercent({
        invoiceType,
        domesticVatRatePercent: 25,
      }),
    ).toBe(25)
  })
})

