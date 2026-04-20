import type { SupportedCurrencyCode } from '../../constants/localization'
import type { TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument } from '../../types/invoiceDocument'
import { buildInvoicePdfDocument } from './buildInvoicePdfDocument'

/**
 * Builds and downloads a professional A4 PDF from the same data as `#invoice-preview`.
 * @throws Error with `t.pdf.couldNotCreate` if jsPDF fails or the download is blocked.
 */
export function exportInvoiceToPdf(
  invoiceDocument: InvoiceDocument,
  t: TranslationMessages,
  localeForFormatting: string,
  activeCurrencyCode: SupportedCurrencyCode,
): void {
  try {
    buildInvoicePdfDocument(invoiceDocument, t, localeForFormatting, activeCurrencyCode)
  } catch {
    throw new Error(t.pdf.couldNotCreate)
  }
}
