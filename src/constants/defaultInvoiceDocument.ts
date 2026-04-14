import type {
  ClientParty,
  CurrencySettings,
  InvoiceDocument,
  LineItem,
  PaymentDetails,
  SellerParty,
  VatSettings,
} from '../types/invoiceDocument'
import { defaultSymbolForCurrencyCode } from './localization'
import { createId } from '../utils/createId'

/** Local calendar date as `YYYY-MM-DD` for `<input type="date">` (avoids UTC off-by-one). */
function todayIsoDateInLocalTime(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDaysIsoDateInLocalTime(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function createEmptySellerParty(): SellerParty {
  return {
    name: '',
    email: '',
    address: '',
    sellerType: 'company',
    sellerCvrNumber: '',
    countryCode: 'DK',
    vatNumber: '',
  }
}

function createEmptyClientParty(): ClientParty {
  return {
    name: '',
    email: '',
    address: '',
    clientType: 'privatePerson',
    clientCvrNumber: '',
    countryCode: 'DK',
    countryCodeOverride: '',
    vatNumber: '',
  }
}

function createDefaultCurrency(): CurrencySettings {
  return {
    code: 'DKK',
    symbol: defaultSymbolForCurrencyCode('DKK'),
  }
}

function createDefaultVat(): VatSettings {
  return {
    ratePercent: 25,
  }
}

function createEmptyPaymentDetails(): PaymentDetails {
  return {
    bankName: '',
    registrationNumber: '',
    accountNumber: '',
    accountHolder: '',
    iban: '',
    bicOrSwift: '',
    paymentReference: '',
  }
}

/** One blank line item for the editor table. */
export function createEmptyLineItem(): LineItem {
  return {
    id: createId(),
    description: '',
    quantity: 1,
    unitPrice: 0,
  }
}

/** Starting document when the app loads or the user resets the form. */
export function createDefaultInvoiceDocument(): InvoiceDocument {
  return {
    documentKind: 'invoice',
    invoiceType: 'domestic_dk',
    invoiceNumber: '',
    issueDate: todayIsoDateInLocalTime(),
    dueDate: '',
    currency: createDefaultCurrency(),
    vat: createDefaultVat(),
    taxNote: '',
    paymentDetails: createEmptyPaymentDetails(),
    seller: createEmptySellerParty(),
    client: createEmptyClientParty(),
    lineItems: [createEmptyLineItem()],
    mobilePayNumberOrBox: '',
    notes: '',
  }
}

/** Example document for “try instantly” UX (safe defaults; Danish-friendly). */
export function createExampleInvoiceDocument(): InvoiceDocument {
  const base = createDefaultInvoiceDocument()
  return {
    ...base,
    invoiceNumber: 'INV-001',
    issueDate: todayIsoDateInLocalTime(),
    dueDate: addDaysIsoDateInLocalTime(14),
    vat: { ratePercent: 25 },
    seller: {
      ...base.seller,
      sellerType: 'company',
      name: 'FakturaLyn Studio',
      address: 'Eksempelvej 12\n8000 Aarhus C',
      sellerCvrNumber: '12345678',
      countryCode: 'DK',
    },
    client: {
      ...base.client,
      clientType: 'company',
      name: 'Acme ApS',
      address: 'Industrivej 4\n2100 København Ø',
      clientCvrNumber: '87654321',
      countryCode: 'DK',
      countryCodeOverride: '',
    },
    lineItems: [
      {
        id: createId(),
        description: 'Webdesign',
        quantity: 1,
        unitPrice: 5000,
      },
    ],
    notes: 'Tak for samarbejdet.',
  }
}
