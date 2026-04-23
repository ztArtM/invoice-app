import type jsPDF from 'jspdf'
import type { InvoiceDocument } from '../invoiceTypes.js'

export const PAGE_MARGIN_MM = 10

export const PT = {
  docTitle: 9,
  metaLabel: 8.5,
  body: 10.5,
  invoiceNo: 12,
  partyName: 12,
  small: 9,
  tableHead: 8.5,
  caption: 8,
  grand: 12,
  mono: 9.75,
} as const

export const LINE_ITEMS_SECTION_PT = PT.metaLabel
export const BODY_LINE_H_MM = 5.0
export const PARTY_NAME_LINE_H_MM = 5.2
export const PARTY_BLOCK_GAP_MM = 2.1
export const SECTION_TOP_MARGIN_MM = 5
export const TABLE_ROW_PAD_MM = 0.5
export const TABLE_HEADER_BODY_GAP_MM = 3.6
export const TABLE_ROW_BOTTOM_PAD_MM = 0.75
export const TABLE_AFTER_ROW_RULE_GAP_MM = 1.5
export const META_ROW_STEP_MM = 4
export const PAYMENT_FIELD_LINE_STEP_MM = BODY_LINE_H_MM * 0.78
export const PAYMENT_FIELD_GAP_MM = 2.25

export function pdfSplitLines(doc: jsPDF, text: string, maxWidthMm: number): string[] {
  const t = text.trim()
  if (!t) return []
  return doc.splitTextToSize(t, maxWidthMm)
}

export function buildPdfFileName(invoiceDocument: InvoiceDocument): string {
  const trimmedNumber = invoiceDocument.invoiceNumber.trim()
  if (trimmedNumber) {
    const safe = trimmedNumber.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '')
    if (safe) return `${safe}.pdf`
  }
  const kind = invoiceDocument.documentKind === 'quote' ? 'quote' : 'invoice'
  return `${kind}-draft.pdf`
}

