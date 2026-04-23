import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getLocaleForLanguage, normalizeToSupportedCurrencyCode } from '../src/constants/localization'
import { translations, type Language } from '../src/constants/translations'
import type { InvoiceDocument } from '../src/types/invoiceDocument'
import type { InvoicePdfDownloadErrorBody, InvoicePdfDownloadRequest } from '../src/types/invoicePdfDownload'
import { renderInvoicePdfBytes } from '../src/utils/pdf/buildInvoicePdfDocument'

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function badRequest(res: VercelResponse, message: string) {
  const body: InvoicePdfDownloadErrorBody = { error: 'invalid_payload', message }
  res.status(400).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

/**
 * Minimal, defensive validation (no localStorage assumptions).
 * This endpoint is public; reject obviously malformed or huge payloads.
 */
function isInvoiceDocumentLike(data: unknown): data is InvoiceDocument {
  if (!isObject(data)) return false
  if (data.documentKind !== 'invoice' && data.documentKind !== 'quote') return false
  if (!isString(data.invoiceNumber)) return false
  if (!isString(data.issueDate)) return false
  if (!isString(data.dueDate)) return false
  if (!isString(data.notes)) return false
  if (!isObject(data.currency) || !isString(data.currency.code) || !isString(data.currency.symbol)) return false
  if (!isObject(data.vat) || !isFiniteNumber(data.vat.ratePercent)) return false
  if (!Array.isArray(data.lineItems) || data.lineItems.length < 1 || data.lineItems.length > 250) return false
  for (const li of data.lineItems) {
    if (!isObject(li)) return false
    if (!isString(li.id) || !isString(li.description)) return false
    if (!isFiniteNumber(li.quantity) || !isFiniteNumber(li.unitPrice)) return false
  }
  if (!isObject(data.seller) || !isString(data.seller.name) || !isString(data.seller.email) || !isString(data.seller.address)) {
    return false
  }
  if (!isObject(data.client) || !isString(data.client.name) || !isString(data.client.email) || !isString(data.client.address)) {
    return false
  }
  if (!isObject(data.paymentDetails)) return false
  return true
}

function parseBody(req: VercelRequest): unknown {
  const b = req.body
  if (typeof b === 'string') {
    try {
      return JSON.parse(b) as unknown
    } catch {
      return null
    }
  }
  return b
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST')
    res.end('Method Not Allowed')
    return
  }

  // Vercel Firewall should rate-limit this endpoint. When it triggers, users will see a 429 from the edge.
  const raw = parseBody(req)
  if (!isObject(raw)) {
    badRequest(res, 'Invalid JSON body.')
    return
  }

  const language = raw.language
  if (language !== 'en' && language !== 'da') {
    badRequest(res, 'Invalid language.')
    return
  }

  const activeCurrencyCodeRaw = raw.activeCurrencyCode
  if (!isString(activeCurrencyCodeRaw)) {
    badRequest(res, 'Invalid currency code.')
    return
  }
  const activeCurrencyCode = normalizeToSupportedCurrencyCode(activeCurrencyCodeRaw)

  const invoiceDocument = (raw as InvoicePdfDownloadRequest).invoiceDocument
  if (!isInvoiceDocumentLike(invoiceDocument)) {
    badRequest(res, 'Invalid invoice payload.')
    return
  }

  try {
    const t = translations[language as Language]
    const localeForFormatting = getLocaleForLanguage(language as Language)
    const { bytes, fileName } = renderInvoicePdfBytes(invoiceDocument, t, localeForFormatting, activeCurrencyCode)

    res.status(200)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.end(Buffer.from(bytes))
  } catch {
    const body: InvoicePdfDownloadErrorBody = {
      error: 'server_error',
      message: translations[language as Language].pdf.couldNotCreate,
    }
    res.status(500).setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(body))
  }
}

