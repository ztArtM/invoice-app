export type SupportedCurrencyCode = 'DKK' | 'EUR'
export type Language = 'en' | 'da'

export type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export type PartyContact = {
  name: string
  email: string
  address: string
}

export type SellerParty = PartyContact & {
  sellerType: 'privatePerson' | 'company'
  sellerCvrNumber: string
  countryCode: string
  vatNumber: string
}

export type ClientParty = PartyContact & {
  clientType: 'privatePerson' | 'company'
  clientCvrNumber: string
  countryCode: string
  countryCodeOverride: string
  vatNumber: string
}

export type InvoiceDocument = {
  documentKind: 'invoice' | 'quote'
  invoiceType: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: { code: string; symbol: string }
  vat: { ratePercent: number }
  seller: SellerParty
  client: ClientParty
  lineItems: LineItem[]
  notes: string
  taxNote: string
  mobilePayNumberOrBox: string
  paymentDetails: {
    bankName: string
    registrationNumber: string
    accountNumber: string
    accountHolder: string
    iban: string
    bicOrSwift: string
    paymentReference: string
  }
}

