import type { SupportedCurrencyCode } from '../constants/localization'
import type { Language } from '../constants/translations'
import type { InvoiceDocument } from './invoiceDocument'

/**
 * Payload sent from the public builder to the protected Vercel download endpoint.
 * Keep it narrow: the server can derive locale/labels from `language`.
 */
export type InvoicePdfDownloadRequest = {
  invoiceDocument: InvoiceDocument
  language: Language
  activeCurrencyCode: SupportedCurrencyCode
}

export type InvoicePdfDownloadErrorCode = 'rate_limited' | 'invalid_payload' | 'server_error'

export type InvoicePdfDownloadErrorBody = {
  error: InvoicePdfDownloadErrorCode
  message: string
}

