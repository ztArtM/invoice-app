import type jsPDF from 'jspdf'
import type { InvoiceDocument } from '../../types/invoiceDocument'

/**
 * Side margins — align with `invoicePreview.css` `@page` (10mm) so export matches print/preview width.
 * (Vertical `@page` 8mm is not modeled; single margin keeps jsPDF layout simple.)
 */
export const PAGE_MARGIN_MM = 10

/**
 * Font sizes (pt) — align with Tailwind in `InvoicePreview`, `TotalsSummary`, `PreviewLineItems`
 * (text-sm = 0.875rem ≈ 10.5pt, text-[0.7rem] ≈ 8.5pt, text-[0.65rem] ≈ 8pt, text-xs ≈ 9pt, text-base ≈ 12pt).
 */
export const PT = {
  /** `text-xs` — document title */
  docTitle: 9,
  /** `text-[0.7rem]` — meta dt, party panel h3, line-items section title */
  metaLabel: 8.5,
  /** `text-sm` — meta dd (dates, currency), table body, totals rows */
  body: 10.5,
  /** `text-base font-bold` — invoice / quote number in meta card */
  invoiceNo: 12,
  /** `text-base font-semibold` — party name */
  partyName: 12,
  /** `text-xs` — CVR / VAT id lines under party */
  small: 9,
  /** table thead — `text-[0.7rem] font-semibold` */
  tableHead: 8.5,
  /** `text-[0.65rem]` — totals card title, footer subsection titles */
  caption: 8,
  /** `text-base font-bold` — grand total row */
  grand: 12,
  /** footer mono values — `text-[0.8125rem]` */
  mono: 9.75,
} as const

/** Line-items section heading — same pt as table head */
export const LINE_ITEMS_SECTION_PT = PT.metaLabel

/** Default line height (mm) for `PT.body` / text-sm — ~leading-normal. */
export const BODY_LINE_H_MM = 5.0

/** `text-base` / party name line step — ~leading-snug. */
export const PARTY_NAME_LINE_H_MM = 5.2

/** Party panel: `mt-2` between name and address / before id (~8px). */
export const PARTY_BLOCK_GAP_MM = 2.1

/** Extra space before a new section (Tailwind `mt-4` / `mt-5`). */
export const SECTION_TOP_MARGIN_MM = 5

/** Line items: per-line step ≈ text-sm line height in table cells. */
export const TABLE_ROW_PAD_MM = 0.5

/** Gap under grey table header → first row (`0.85rem` in `invoicePreview.css`). */
export const TABLE_HEADER_BODY_GAP_MM = 3.6

/** Space after a row’s last baseline before next row (no row borders in preview). */
export const TABLE_ROW_BOTTOM_PAD_MM = 0.75

export const TABLE_AFTER_ROW_RULE_GAP_MM = 1.5

/** Meta dl row rhythm (labels + values). */
export const META_ROW_STEP_MM = 4

/** Payment grid: `text-sm leading-tight` row step. */
export const PAYMENT_FIELD_LINE_STEP_MM = BODY_LINE_H_MM * 0.78

export const PAYMENT_FIELD_GAP_MM = 2.25

export function pdfSplitLines(doc: jsPDF, text: string, maxWidthMm: number): string[] {
  const t = text.trim()
  if (!t) return []
  return doc.splitTextToSize(t, maxWidthMm)
}

/** Safe file name from invoice number (falls back if empty). */
export function buildPdfFileName(invoiceDocument: InvoiceDocument): string {
  const trimmedNumber = invoiceDocument.invoiceNumber.trim()
  if (trimmedNumber) {
    const safe = trimmedNumber.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '')
    if (safe) return `${safe}.pdf`
  }
  const kind = invoiceDocument.documentKind === 'quote' ? 'quote' : 'invoice'
  return `${kind}-draft.pdf`
}
