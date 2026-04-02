import type { Dispatch, SetStateAction } from 'react'

/** Invoice vs quote — drives titles and labels in the UI. */
export type DocumentKind = 'invoice' | 'quote'

/** Which party block we are editing in the form (you or the client). */
export type PartyRole = 'seller' | 'client'

export type InvoiceType =
  | 'domestic_dk'
  | 'eu_b2b_reverse_charge'
  | 'non_eu_export'
  | 'private_customer'

/** How money is labeled on the document (code + symbol). */
export interface CurrencySettings {
  /** ISO 4217 code, e.g. "EUR", "GBP" — useful for formatting and export later. */
  code: string
  /** Symbol shown with amounts, e.g. "€", "£". */
  symbol: string
}

/** VAT / sales tax for the whole document (one rate applied to the subtotal). */
export interface VatSettings {
  /** Rate as a percentage, e.g. 25 means 25%. */
  ratePercent: number
}

/** Bank transfer instructions shown to the client. */
export interface PaymentDetails {
  bankName: string
  /** Bank registration number (reg.nr.): four digits. */
  registrationNumber: string
  /** Domestic account number: ten digits. */
  accountNumber: string
  accountHolder: string
  iban: string
  /** BIC / SWIFT where needed for international transfers. */
  bicOrSwift: string
  /** What the client should put in the payment reference field. */
  paymentReference: string
}

/** Shared contact + address fields for any party. */
export interface PartyContact {
  name: string
  email: string
  /** Multi-line address as one string; the UI can use a textarea. */
  address: string
}

/** Seller (you): keep CVR for Denmark; add VAT ID + country for EU invoices. */
export interface SellerParty extends PartyContact {
  /** Danish Central Business Register no. (8 digits); optional. Stored as digits only. */
  sellerCvrNumber: string
  /** ISO 3166-1 alpha-2. Defaults to DK. */
  countryCode: string
  /** VAT number with prefix (e.g. DK12345678, DE123...). */
  vatNumber: string
}

/** Client type: private individual vs company (CVR only for companies). */
export type ClientType = 'privatePerson' | 'company'

/** Client / bill-to party. */
export interface ClientParty extends PartyContact {
  clientType: ClientType
  /** Danish CVR when `clientType === 'company'`; stored as digits only. */
  clientCvrNumber: string
  /** ISO 3166-1 alpha-2. Defaults to DK. */
  countryCode: string
  /**
   * When `countryCode === "OTHER"`, this can store a user-provided ISO code (e.g. "AT")
   * or any short country hint. Used for invoice type classification.
   */
  countryCodeOverride: string
  /** VAT number with prefix for EU B2B invoices. */
  vatNumber: string
}

/** One billable row: service or product. */
export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

/**
 * Root model: one screenful of state for an invoice or quote.
 * Nested objects group fields that belong together in the UI and on the PDF.
 */
export interface InvoiceDocument {
  documentKind: DocumentKind
  invoiceType: InvoiceType
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: CurrencySettings
  vat: VatSettings
  /** Auto-set note for EU reverse charge / exports; shown in preview + PDF when set. */
  taxNote: string
  paymentDetails: PaymentDetails
  seller: SellerParty
  client: ClientParty
  lineItems: LineItem[]
  /** MobilePay phone number or payment box ID, shown before bank details when set. */
  mobilePayNumberOrBox: string
  notes: string
}

/** React state setter for the whole document (from `useState` in App). */
export type SetInvoiceDocument = Dispatch<SetStateAction<InvoiceDocument>>
