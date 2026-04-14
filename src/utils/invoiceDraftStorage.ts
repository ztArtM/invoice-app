import { INVOICE_DRAFT_STORAGE_KEY } from '../constants/storageKeys'
import type { ClientParty, InvoiceDocument, VatSettings } from '../types/invoiceDocument'
import { normalizeAccountNumberDigits, normalizeRegistrationNumberDigits } from './bankPaymentInput'
import { normalizeCvrInput } from './cvrInput'
import { determineTaxNote, determineVatRatePercent, determineInvoiceType, formatVatNumber } from '../services/invoicing/invoiceRules'

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isPartyContactBase(value: unknown): value is { name: string; email: string; address: string } {
  if (!value || typeof value !== 'object') return false
  const party = value as Record<string, unknown>
  return isString(party.name) && isString(party.email) && isString(party.address)
}

/** Seller: accepts `sellerCvrNumber` or legacy `cvr`; may omit `sellerType`. */
function isSellerPartyLoose(value: unknown): boolean {
  if (!isPartyContactBase(value)) return false
  const party = value as Record<string, unknown>
  const st = party.sellerType
  if (st !== undefined && st !== 'privatePerson' && st !== 'company') return false
  const cvrField = party.sellerCvrNumber ?? party.cvr
  if (cvrField !== undefined && !isString(cvrField)) return false
  return true
}

/** Client: accepts `clientCvrNumber` or legacy `cvr`; may omit `clientType`. */
function isClientPartyLoose(value: unknown): boolean {
  if (!isPartyContactBase(value)) return false
  const party = value as Record<string, unknown>
  const ct = party.clientType
  if (ct !== undefined && ct !== 'privatePerson' && ct !== 'company') return false
  const cvrField = party.clientCvrNumber ?? party.cvr
  if (cvrField !== undefined && !isString(cvrField)) return false
  return true
}

function isCurrencySettings(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const currency = value as Record<string, unknown>
  return isString(currency.code) && isString(currency.symbol)
}

function isVatSettingsLoose(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const vat = value as Record<string, unknown>
  return isFiniteNumber(vat.ratePercent) && vat.ratePercent >= 0
}

function normalizeVat(raw: unknown): VatSettings {
  const v = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const rate = typeof v.ratePercent === 'number' && Number.isFinite(v.ratePercent) ? v.ratePercent : 0
  return { ratePercent: Math.min(100, Math.max(0, rate)) }
}

/** Accepts current shape or older drafts without registration / account number. */
function isPaymentDetailsLoose(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const payment = value as Record<string, unknown>
  const hasCore =
    isString(payment.bankName) &&
    isString(payment.accountHolder) &&
    isString(payment.iban) &&
    isString(payment.bicOrSwift) &&
    isString(payment.paymentReference)
  if (!hasCore) return false
  const regOk = payment.registrationNumber === undefined || isString(payment.registrationNumber)
  const accOk = payment.accountNumber === undefined || isString(payment.accountNumber)
  return regOk && accOk
}

function normalizePaymentDetails(raw: unknown): InvoiceDocument['paymentDetails'] {
  const p = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    bankName: typeof p.bankName === 'string' ? p.bankName : '',
    registrationNumber: normalizeRegistrationNumberDigits(
      typeof p.registrationNumber === 'string' ? p.registrationNumber : '',
    ),
    accountNumber: normalizeAccountNumberDigits(
      typeof p.accountNumber === 'string' ? p.accountNumber : '',
    ),
    accountHolder: typeof p.accountHolder === 'string' ? p.accountHolder : '',
    iban: typeof p.iban === 'string' ? p.iban : '',
    bicOrSwift: typeof p.bicOrSwift === 'string' ? p.bicOrSwift : '',
    paymentReference: typeof p.paymentReference === 'string' ? p.paymentReference : '',
  }
}

function isLineItemFixed(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const line = value as Record<string, unknown>
  return (
    isString(line.id) &&
    isString(line.description) &&
    isFiniteNumber(line.quantity) &&
    isFiniteNumber(line.unitPrice) &&
    line.quantity >= 0 &&
    line.unitPrice >= 0
  )
}

/**
 * Returns true if `data` looks like a saved invoice (same shape as InvoiceDocument).
 * We do not trust localStorage — old builds, hand-edited keys, or corrupted JSON must not crash the app.
 */
function isValidInvoiceDocumentShape(data: unknown): data is InvoiceDocument {
  if (!data || typeof data !== 'object') return false
  const documentRecord = data as Record<string, unknown>

  const kind = documentRecord.documentKind
  if (kind !== 'invoice' && kind !== 'quote') return false

  if (!isString(documentRecord.invoiceNumber)) return false
  if (!isString(documentRecord.issueDate)) return false
  if (!isString(documentRecord.dueDate)) return false
  if (!isString(documentRecord.notes)) return false
  if ('taxNote' in documentRecord && documentRecord.taxNote !== undefined && !isString(documentRecord.taxNote)) {
    return false
  }
  if (
    'mobilePayNumberOrBox' in documentRecord &&
    documentRecord.mobilePayNumberOrBox !== undefined &&
    !isString(documentRecord.mobilePayNumberOrBox)
  ) {
    return false
  }

  if (!isCurrencySettings(documentRecord.currency)) return false
  if (!isVatSettingsLoose(documentRecord.vat)) return false
  if (!isPaymentDetailsLoose(documentRecord.paymentDetails)) return false
  if (!isSellerPartyLoose(documentRecord.seller)) return false
  if (!isClientPartyLoose(documentRecord.client)) return false

  const lineItems = documentRecord.lineItems
  if (!Array.isArray(lineItems) || lineItems.length === 0) return false
  if (!lineItems.every(isLineItemFixed)) return false

  return true
}

/** Fill missing party fields after loading older JSON. */
function finalizeParties(doc: InvoiceDocument): InvoiceDocument {
  const s = doc.seller
  const c = doc.client
  const rawSellerType = (s as { sellerType?: string }).sellerType
  const sellerType: InvoiceDocument['seller']['sellerType'] =
    rawSellerType === 'privatePerson' ? 'privatePerson' : 'company'
  const sellerRecord = s as { sellerCvrNumber?: string; cvr?: string }
  const sellerCvrRaw =
    typeof sellerRecord.sellerCvrNumber === 'string'
      ? sellerRecord.sellerCvrNumber
      : typeof sellerRecord.cvr === 'string'
        ? sellerRecord.cvr
        : ''
  const rawClientType = (c as { clientType?: string }).clientType
  const clientType: ClientParty['clientType'] =
    rawClientType === 'company' ? 'company' : 'privatePerson'
  const clientRecord = c as { clientCvrNumber?: string; cvr?: string }
  const clientCvrRaw =
    typeof clientRecord.clientCvrNumber === 'string'
      ? clientRecord.clientCvrNumber
      : typeof clientRecord.cvr === 'string'
        ? clientRecord.cvr
        : ''
  const sellerCountryCode =
    typeof (s as { countryCode?: unknown }).countryCode === 'string' ? (s as { countryCode: string }).countryCode : 'DK'
  const clientCountryCode =
    typeof (c as { countryCode?: unknown }).countryCode === 'string' ? (c as { countryCode: string }).countryCode : 'DK'
  const clientCountryCodeOverride =
    typeof (c as { countryCodeOverride?: unknown }).countryCodeOverride === 'string'
      ? (c as { countryCodeOverride: string }).countryCodeOverride
      : ''

  const sellerCvrDigits = sellerType === 'company' ? normalizeCvrInput(sellerCvrRaw) : ''
  const clientCvrDigits = clientType === 'company' ? normalizeCvrInput(clientCvrRaw) : ''

  const rawSellerVat = typeof (s as { vatNumber?: unknown }).vatNumber === 'string' ? (s as { vatNumber: string }).vatNumber : ''
  const rawClientVat = typeof (c as { vatNumber?: unknown }).vatNumber === 'string' ? (c as { vatNumber: string }).vatNumber : ''

  const sellerVatNumber = sellerType === 'company' ? formatVatNumber(sellerCountryCode, rawSellerVat, sellerCvrDigits) : ''
  const clientVatNumber = formatVatNumber(clientCountryCode, rawClientVat, clientCvrDigits)

  const invoiceType = determineInvoiceType({
    sellerCountryCode,
    buyerCountryCode:
      clientCountryCode.trim().toUpperCase() === 'OTHER' ? clientCountryCodeOverride : clientCountryCode,
    buyerIsBusiness: clientType === 'company',
  })
  const effectiveVatRatePercent =
    sellerType === 'privatePerson'
      ? 0
      : determineVatRatePercent({
          invoiceType,
          domesticVatRatePercent: doc.vat.ratePercent,
        })

  return {
    ...doc,
    invoiceType,
    taxNote: (doc.taxNote && doc.taxNote.trim()) || determineTaxNote(invoiceType),
    vat: { ratePercent: effectiveVatRatePercent },
    seller: {
      name: s.name,
      email: s.email,
      address: s.address,
      sellerType,
      sellerCvrNumber: sellerCvrDigits,
      countryCode: sellerCountryCode.trim().toUpperCase() || 'DK',
      vatNumber: sellerVatNumber,
    },
    client: {
      name: c.name,
      email: c.email,
      address: c.address,
      clientType,
      clientCvrNumber: clientCvrDigits,
      countryCode: clientCountryCode.trim().toUpperCase() || 'DK',
      countryCodeOverride: clientCountryCodeOverride.trim().toUpperCase(),
      vatNumber: clientVatNumber,
    },
  }
}

/**
 * Reads and validates the draft from localStorage. Returns null if missing, invalid, or unreadable.
 */
export function loadInvoiceDraftFromLocalStorage(): InvoiceDocument | null {
  try {
    const rawJson = localStorage.getItem(INVOICE_DRAFT_STORAGE_KEY)
    if (rawJson === null || rawJson.trim() === '') {
      return null
    }
    const parsed: unknown = JSON.parse(rawJson)
    if (!isValidInvoiceDocumentShape(parsed)) {
      return null
    }
    const draft = parsed as InvoiceDocument
    return finalizeParties({
      ...draft,
      vat: normalizeVat((parsed as { vat?: unknown }).vat),
      paymentDetails: normalizePaymentDetails((parsed as { paymentDetails?: unknown }).paymentDetails),
      mobilePayNumberOrBox:
        typeof draft.mobilePayNumberOrBox === 'string' ? draft.mobilePayNumberOrBox : '',
    })
  } catch {
    return null
  }
}

/**
 * Saves the current invoice JSON. Fails quietly if storage is full or blocked (private mode).
 */
export function saveInvoiceDraftToLocalStorage(invoiceDocument: InvoiceDocument): void {
  try {
    const json = JSON.stringify(invoiceDocument)
    localStorage.setItem(INVOICE_DRAFT_STORAGE_KEY, json)
  } catch {
    // Ignore quota errors / access denied — app keeps working in memory only.
  }
}
