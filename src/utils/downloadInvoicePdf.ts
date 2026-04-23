import type { SupportedCurrencyCode } from '../constants/localization'
import type { Language, TranslationMessages } from '../constants/translations'
import type { InvoiceDocument } from '../types/invoiceDocument'
import type { InvoicePdfDownloadErrorBody, InvoicePdfDownloadRequest } from '../types/invoicePdfDownload'

function tryGetAttachmentFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null
  // Basic filename parsing; keep simple and safe.
  const m = contentDisposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i)
  if (!m?.[1]) return null
  try {
    return decodeURIComponent(m[1])
  } catch {
    return m[1]
  }
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * Downloads a PDF via the protected Vercel serverless endpoint (`/api/download-invoice`).
 *
 * Vercel Firewall should rate-limit this path to protect against bot spam.
 */
export async function downloadInvoicePdfFromApi(props: {
  invoiceDocument: InvoiceDocument
  language: Language
  activeCurrencyCode: SupportedCurrencyCode
  t: TranslationMessages
}): Promise<void> {
  const payload: InvoicePdfDownloadRequest = {
    invoiceDocument: props.invoiceDocument,
    language: props.language,
    activeCurrencyCode: props.activeCurrencyCode,
  }

  const response = await fetch('/api/download-invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status === 429) {
    throw new Error(props.t.pdf.tooManyDownloads)
  }

  if (!response.ok) {
    // Try to parse a structured JSON error, but fall back to generic message.
    try {
      const err = (await response.json()) as Partial<InvoicePdfDownloadErrorBody>
      if (typeof err.message === 'string' && err.message.trim()) {
        throw new Error(err.message)
      }
    } catch {
      // ignore
    }
    throw new Error(props.t.pdf.couldNotCreate)
  }

  const blob = await response.blob()
  const suggestedName = tryGetAttachmentFilename(response.headers.get('Content-Disposition')) ?? 'invoice.pdf'
  triggerBrowserDownload(blob, suggestedName)
}

