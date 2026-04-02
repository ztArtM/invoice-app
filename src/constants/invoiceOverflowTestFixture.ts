import type { InvoiceDocument } from '../types/invoiceDocument'

/**
 * Extreme content for manual testing (paste into state) and automated smoke tests.
 * Covers: long unbroken strings, huge amounts, multi-line blobs, wide IBAN/ref URLs.
 */
const UNBROKEN = `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
const LONG_WORD = `${UNBROKEN}${UNBROKEN}`
const LONG_URL = `https://example.com/path/${UNBROKEN}`

export const invoiceOverflowTestDocument: InvoiceDocument = {
  documentKind: 'invoice',
  invoiceType: 'domestic_dk',
  invoiceNumber: `INV-2024-${UNBROKEN.slice(0, 80)}`,
  issueDate: '2024-06-01',
  dueDate: '2024-07-01',
  currency: { code: 'DKK', symbol: 'kr.' },
  vat: { ratePercent: 25 },
  taxNote: [
    'Reverse charge / export disclaimer with extremely long continuous token:',
    UNBROKEN,
    'and more readable text that still wraps.',
  ].join('\n'),
  paymentDetails: {
    bankName: `International Bank of ${'VeryLongWord'.repeat(12)}`,
    registrationNumber: '12345678',
    accountNumber: '12345678901234567890',
    accountHolder: `Account holder ${LONG_WORD}`,
    iban: `DK5000400440116243${UNBROKEN.slice(0, 48)}`,
    bicOrSwift: `DABADKKK${UNBROKEN.slice(0, 24)}`,
    paymentReference: `${LONG_URL}?ref=${UNBROKEN}`,
  },
  seller: {
    name: `Seller ${LONG_WORD}`,
    email: 'seller@example.com',
    address: ['Line one with normal words.', `Street ${UNBROKEN}`, 'City'].join('\n'),
    sellerCvrNumber: '12345678',
    countryCode: 'DK',
    vatNumber: `DK${UNBROKEN.slice(0, 40)}`,
  },
  client: {
    name: `Client ${LONG_WORD}`,
    email: 'client@example.com',
    address: ['Attn: ' + UNBROKEN, 'Building 9', '8000 Aarhus'].join('\n'),
    clientType: 'company',
    clientCvrNumber: '87654321',
    countryCode: 'DK',
    countryCodeOverride: '',
    vatNumber: '',
  },
  lineItems: [
    {
      id: 'overflow-line-1',
      description: [
        'Consulting — detailed scope:',
        UNBROKEN,
        'SKU-CODE-' + UNBROKEN.slice(0, 60),
      ].join('\n'),
      quantity: 9_999_999,
      unitPrice: 99_999_999.99,
    },
    {
      id: 'overflow-line-2',
      description: `Premium widget ${UNBROKEN}`,
      quantity: 1,
      unitPrice: 1,
    },
  ],
  mobilePayNumberOrBox: `+45${UNBROKEN.replace(/X/g, '1').slice(0, 40)}`,
  notes: [
    'Terms and notes with intentional newline breaks.',
    UNBROKEN,
    LONG_URL,
  ].join('\n'),
}
