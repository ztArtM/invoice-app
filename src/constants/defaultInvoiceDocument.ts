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

function createEmptySellerParty(): SellerParty {
  return {
    name: '',
    email: '',
    address: '',
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
