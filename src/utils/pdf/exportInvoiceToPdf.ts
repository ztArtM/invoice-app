import type { SupportedCurrencyCode } from '../../constants/localization'
import type { Language, TranslationMessages } from '../../constants/translations'
import type { InvoiceDocument } from '../../types/invoiceDocument'
import { downloadInvoicePdfFromApi } from '../downloadInvoicePdf'

/**
 * Downloads the PDF via the protected Vercel API route (preferred for production).
 * @throws Error with a user-facing message (rate-limited, invalid payload, generic failure).
 */
export async function exportInvoiceToPdf(
  invoiceDocument: InvoiceDocument,
  t: TranslationMessages,
  language: Language,
  localeForFormatting: string,
  activeCurrencyCode: SupportedCurrencyCode,
): Promise<void> {
  // `localeForFormatting` is still used by the UI and stays part of the signature,
  // but the protected route derives locale from `language` to prevent mismatches.
  void localeForFormatting
  await downloadInvoicePdfFromApi({ invoiceDocument, language, activeCurrencyCode, t })
}
