import { jsPDF } from 'jspdf'
import type { SupportedCurrencyCode } from '../constants/localization'
import type { TranslationMessages } from '../constants/translations'
import type { ClientParty, InvoiceDocument, PartyContact, SellerParty } from '../types/invoiceDocument'
import { formatCurrencyAmount } from './formatCurrency'
import { formatDateForDisplay } from './formatDate'
import {
  calculateInvoiceTotalsSummary,
  calculateLineItemTotal,
} from './invoiceCalculations'

/** Space from left/right edges of the page (A4 is 210mm wide). */
const PAGE_MARGIN_MM = 18

/** Default vertical step between lines of body text. */
const LINE_HEIGHT_MM = 5.5

/** Extra space before a new section title. */
const SECTION_TOP_MARGIN_MM = 10

/** Tight line step for wrapped body text (mm). */
const PDF_LINE_STEP_MM = LINE_HEIGHT_MM * 0.85

function pdfSplitLines(doc: jsPDF, text: string, maxWidthMm: number): string[] {
  const t = text.trim()
  if (!t) return []
  return doc.splitTextToSize(t, maxWidthMm)
}

/** Safe file name from invoice number (falls back if empty). */
function buildPdfFileName(invoiceDocument: InvoiceDocument): string {
  const trimmedNumber = invoiceDocument.invoiceNumber.trim()
  if (trimmedNumber) {
    const safe = trimmedNumber.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '')
    if (safe) return `${safe}.pdf`
  }
  const kind = invoiceDocument.documentKind === 'quote' ? 'quote' : 'invoice'
  return `${kind}-draft.pdf`
}

/**
 * Builds a professional A4 PDF from the same data the app uses on screen.
 * Totals and line amounts use the shared calculation helpers (no duplicate math).
 * Throws a plain Error if the browser blocks the download or jsPDF fails (caller can show a message).
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

function buildInvoicePdfDocument(
  invoiceDocument: InvoiceDocument,
  t: TranslationMessages,
  localeForFormatting: string,
  activeCurrencyCode: SupportedCurrencyCode,
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidthMm = doc.internal.pageSize.getWidth()
  const pageHeightMm = doc.internal.pageSize.getHeight()
  const contentRightMm = pageWidthMm - PAGE_MARGIN_MM
  const contentWidthMm = pageWidthMm - PAGE_MARGIN_MM * 2

  let cursorYMm = PAGE_MARGIN_MM

  const totals = calculateInvoiceTotalsSummary(
    invoiceDocument.lineItems,
    invoiceDocument.vat.ratePercent,
  )

  const p = t.preview
  const li = t.lineItems
  const tot = t.totals

  const isQuote = invoiceDocument.documentKind === 'quote'
  const documentLabel = isQuote ? p.documentQuote : p.documentInvoice
  const numberLabel = isQuote ? p.numberQuote : p.numberInvoice
  const dueDateLabel = isQuote ? p.validUntil : p.dueDate

  // Column positions for the line-items table (mm from left).
  const colDescriptionLeftMm = PAGE_MARGIN_MM
  const colQtyRightMm = 118
  const colUnitRightMm = 150
  const colAmountRightMm = contentRightMm
  const qtyColMaxMm = 24
  const unitColMaxMm = 28
  const amountColMaxMm = Math.max(20, colAmountRightMm - colUnitRightMm - 6)

  /** Start a new page if the next block would cross the bottom margin. */
  function ensureRoomForBlock(blockHeightMm: number) {
    if (cursorYMm + blockHeightMm > pageHeightMm - PAGE_MARGIN_MM) {
      doc.addPage()
      cursorYMm = PAGE_MARGIN_MM
    }
  }

  function moveDown(mm: number) {
    cursorYMm += mm
  }

  // ----- Header (matches preview: title left, metadata box right) -----
  const metaBoxW = 72
  const metaLeft = contentRightMm - metaBoxW
  const leftContentRightMm = metaLeft - 6
  const headerTop = cursorYMm
  const docLabelY = headerTop + 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 90)
  doc.text(documentLabel.toUpperCase(), PAGE_MARGIN_MM, docLabelY)

  let leftY = docLabelY + 7
  const invNum = invoiceDocument.invoiceNumber.trim()
  if (invNum) {
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    const numberLines = doc.splitTextToSize(invNum, leftContentRightMm - PAGE_MARGIN_MM)
    for (const line of numberLines) {
      doc.text(line, PAGE_MARGIN_MM, leftY)
      leftY += 6
    }
  }
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(numberLabel, PAGE_MARGIN_MM, leftY)
  leftY += 6

  const issueDateStr = formatDateForDisplay(invoiceDocument.issueDate, localeForFormatting)
  const dueDateStr = formatDateForDisplay(invoiceDocument.dueDate, localeForFormatting)
  const currencyCode = invoiceDocument.currency.code.trim().toUpperCase()
  const metaPad = 4
  const metaLabelMaxW = 26
  const metaValueMaxW = Math.max(12, metaBoxW - metaPad * 2 - metaLabelMaxW - 2)

  const metaTop = headerTop
  doc.setFontSize(9)

  type MetaPdfRow = { labelLines: string[]; valueLines: string[] }
  const metaRows: MetaPdfRow[] = []

  function pushMetaRow(label: string, value: string) {
    doc.setFont('helvetica', 'normal')
    const labelLines = pdfSplitLines(doc, label, metaLabelMaxW)
    doc.setFont('helvetica', 'bold')
    const valueLines = pdfSplitLines(doc, value, metaValueMaxW)
    doc.setFont('helvetica', 'normal')
    metaRows.push({ labelLines, valueLines })
  }

  pushMetaRow(p.issueDate, issueDateStr)
  pushMetaRow(dueDateLabel, dueDateStr)
  if (currencyCode) {
    pushMetaRow(p.currency, currencyCode)
  }

  let metaContentH = metaPad + 2
  for (const row of metaRows) {
    const blockH = Math.max(row.labelLines.length, row.valueLines.length) * PDF_LINE_STEP_MM + 2
    metaContentH += blockH
  }
  metaContentH += metaPad
  const metaBoxH = Math.max(metaContentH, 22)

  doc.setFillColor(250, 250, 250)
  doc.setDrawColor(228, 228, 231)
  doc.roundedRect(metaLeft, metaTop, metaBoxW, metaBoxH, 2, 2, 'FD')

  let innerY = metaTop + metaPad + 3
  for (const row of metaRows) {
    const blockTop = innerY
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'normal')
    let yL = blockTop
    for (const part of row.labelLines) {
      doc.text(part, metaLeft + metaPad, yL)
      yL += PDF_LINE_STEP_MM
    }
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    let yV = blockTop
    for (const part of row.valueLines) {
      doc.text(part, metaLeft + metaBoxW - metaPad, yV, { align: 'right' })
      yV += PDF_LINE_STEP_MM
    }
    innerY = Math.max(yL, yV) + 2
  }

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)

  cursorYMm = Math.max(leftY, metaTop + metaBoxH) + 4
  doc.setDrawColor(220, 220, 220)
  doc.line(PAGE_MARGIN_MM, cursorYMm, contentRightMm, cursorYMm)
  moveDown(SECTION_TOP_MARGIN_MM)

  // ----- Seller & client (two columns, bordered panels like preview) -----
  ensureRoomForBlock(40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  const midX = pageWidthMm / 2
  const gapMm = 6
  const leftPanelX = PAGE_MARGIN_MM
  const leftPanelInnerX = leftPanelX + 4
  const leftColumnWidthMm = midX - leftPanelInnerX - gapMm / 2
  const rightPanelX = midX + gapMm / 2
  const rightColumnXMm = rightPanelX + 4
  const rightColumnWidthMm = contentRightMm - rightColumnXMm

  doc.text(p.from, leftPanelInnerX, cursorYMm)
  doc.text(p.billTo, rightColumnXMm, cursorYMm)
  moveDown(6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const panelContentTop = cursorYMm

  const sellerLines = buildSellerPdfLines(invoiceDocument.seller, invoiceDocument.invoiceType, p)
  const clientLines = buildClientPdfLines(invoiceDocument.client, invoiceDocument.invoiceType, p)

  const sellerBlocks = sellerLines.map((line: string) => doc.splitTextToSize(line, leftColumnWidthMm))
  const clientBlocks = clientLines.map((line: string) => doc.splitTextToSize(line, rightColumnWidthMm))

  const leftLineCount = sellerBlocks.flat().length
  const rightLineCount = clientBlocks.flat().length
  const leftHeight = Math.max(leftLineCount * LINE_HEIGHT_MM * 0.85, 8)
  const rightHeight = Math.max(rightLineCount * LINE_HEIGHT_MM * 0.85, 8)
  const panelInnerH = Math.max(leftHeight, rightHeight, 12)
  const panelH = panelInnerH + 8
  ensureRoomForBlock(panelH + 4)

  doc.setFillColor(250, 250, 250)
  doc.setDrawColor(228, 228, 231)
  doc.roundedRect(leftPanelX, panelContentTop - 2, midX - leftPanelX - gapMm / 2, panelH, 2, 2, 'FD')
  doc.roundedRect(
    rightPanelX,
    panelContentTop - 2,
    contentRightMm - rightPanelX,
    panelH,
    2,
    2,
    'FD',
  )

  let leftYMm = panelContentTop + 4
  for (const chunk of sellerBlocks) {
    for (const textLine of chunk) {
      doc.text(textLine, leftPanelInnerX, leftYMm)
      leftYMm += LINE_HEIGHT_MM * 0.85
    }
  }

  let rightYMm = panelContentTop + 4
  for (const chunk of clientBlocks) {
    for (const textLine of chunk) {
      doc.text(textLine, rightColumnXMm, rightYMm)
      rightYMm += LINE_HEIGHT_MM * 0.85
    }
  }

  cursorYMm = panelContentTop - 2 + panelH + SECTION_TOP_MARGIN_MM

  const taxNoteTrimmed = invoiceDocument.taxNote.trim()
  if (taxNoteTrimmed) {
    ensureRoomForBlock(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(120, 60, 0)
    const noteLines = doc.splitTextToSize(taxNoteTrimmed, contentWidthMm)
    for (const line of noteLines) {
      doc.text(line, PAGE_MARGIN_MM, cursorYMm)
      cursorYMm += LINE_HEIGHT_MM * 0.85
    }
    doc.setTextColor(0, 0, 0)
    moveDown(SECTION_TOP_MARGIN_MM * 0.6)
  }

  // ----- Line items -----
  ensureRoomForBlock(16)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(li.heading, PAGE_MARGIN_MM, cursorYMm)
  moveDown(8)

  doc.setFontSize(9)
  doc.text(li.thDescription, colDescriptionLeftMm, cursorYMm)
  doc.text(li.thQty, colQtyRightMm, cursorYMm, { align: 'right' })
  doc.text(li.thUnitPrice, colUnitRightMm, cursorYMm, { align: 'right' })
  doc.text(p.thAmount, colAmountRightMm, cursorYMm, { align: 'right' })
  moveDown(3)

  doc.setDrawColor(230, 230, 230)
  doc.line(PAGE_MARGIN_MM, cursorYMm, contentRightMm, cursorYMm)
  moveDown(5)

  doc.setFont('helvetica', 'normal')
  const descriptionMaxWidthMm = Math.max(
    24,
    colQtyRightMm - qtyColMaxMm - colDescriptionLeftMm - 6,
  )

  for (const lineItem of invoiceDocument.lineItems) {
    const lineTotal = calculateLineItemTotal(lineItem)
    const description = lineItem.description.trim()
    const descLines = description ? pdfSplitLines(doc, description, descriptionMaxWidthMm) : []

    const qtyText = String(lineItem.quantity)
    const unitText = formatCurrencyAmount(lineItem.unitPrice, activeCurrencyCode, localeForFormatting)
    const amountText = formatCurrencyAmount(lineTotal, activeCurrencyCode, localeForFormatting)
    const qtyLines = pdfSplitLines(doc, qtyText, qtyColMaxMm)
    const unitLines = pdfSplitLines(doc, unitText, unitColMaxMm)
    const amountLines = pdfSplitLines(doc, amountText, amountColMaxMm)

    const rowLineCount = Math.max(
      descLines.length,
      qtyLines.length,
      unitLines.length,
      amountLines.length,
      1,
    )
    const rowBodyHeightMm = rowLineCount * PDF_LINE_STEP_MM
    ensureRoomForBlock(rowBodyHeightMm + 2)

    const rowStartYMm = cursorYMm
    descLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colDescriptionLeftMm, rowStartYMm + index * PDF_LINE_STEP_MM)
    })
    qtyLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colQtyRightMm, rowStartYMm + index * PDF_LINE_STEP_MM, { align: 'right' })
    })
    unitLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colUnitRightMm, rowStartYMm + index * PDF_LINE_STEP_MM, { align: 'right' })
    })
    amountLines.forEach((textLine: string, index: number) => {
      doc.text(textLine, colAmountRightMm, rowStartYMm + index * PDF_LINE_STEP_MM, { align: 'right' })
    })

    cursorYMm = rowStartYMm + rowBodyHeightMm + 3
  }

  moveDown(SECTION_TOP_MARGIN_MM)

  // ----- Totals (right-aligned card; height grows with wrapped labels / huge amounts) -----
  // Wide enough that typical DA/EN labels (e.g. "Subtotal (ekskl. moms)") stay on one line with the amount.
  const totalsBlockW = 110
  const totalsBlockLeftMm = contentRightMm - totalsBlockW
  const totPad = 5
  const amountMaxW = 40
  const labelMaxW = Math.max(28, totalsBlockW - totPad * 2 - amountMaxW - 3)

  const subtotalLabel = tot.subtotalExVat
  const vatLabel = tot.vatWithPercent.replace(
    '{{percent}}',
    String(invoiceDocument.vat.ratePercent),
  )
  const subtotalAmtStr = formatCurrencyAmount(
    totals.subtotalExcludingVat,
    activeCurrencyCode,
    localeForFormatting,
  )
  const vatAmtStr = formatCurrencyAmount(totals.vatAmount, activeCurrencyCode, localeForFormatting)
  const grandAmtStr = formatCurrencyAmount(
    totals.grandTotalIncludingVat,
    activeCurrencyCode,
    localeForFormatting,
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(90, 90, 90)
  const totalsHeadingLines = pdfSplitLines(doc, tot.heading.toUpperCase(), totalsBlockW - totPad * 2)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const subLabelLines = pdfSplitLines(doc, subtotalLabel, labelMaxW)
  const subAmountLines = pdfSplitLines(doc, subtotalAmtStr, amountMaxW)
  const vatLabelLines = pdfSplitLines(doc, vatLabel, labelMaxW)
  const vatAmountLines = pdfSplitLines(doc, vatAmtStr, amountMaxW)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  const grandLabelLines = pdfSplitLines(doc, tot.totalDue, labelMaxW)
  const grandAmountLines = pdfSplitLines(doc, grandAmtStr, amountMaxW)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  const grandStepMm = LINE_HEIGHT_MM * 1.05
  let totalsBlockHeightMm =
    8 +
    totalsHeadingLines.length * PDF_LINE_STEP_MM +
    6 +
    Math.max(subLabelLines.length, subAmountLines.length) * LINE_HEIGHT_MM +
    Math.max(vatLabelLines.length, vatAmountLines.length) * LINE_HEIGHT_MM +
    6 +
    Math.max(grandLabelLines.length, grandAmountLines.length) * grandStepMm +
    10
  totalsBlockHeightMm = Math.max(totalsBlockHeightMm, 48) + 14

  ensureRoomForBlock(totalsBlockHeightMm)
  const totalsBoxTop = cursorYMm
  doc.setFillColor(250, 250, 250)
  doc.setDrawColor(228, 228, 231)
  doc.roundedRect(totalsBlockLeftMm, totalsBoxTop, totalsBlockW, totalsBlockHeightMm, 2, 2, 'FD')

  let totY = totalsBoxTop + 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(90, 90, 90)
  for (const line of totalsHeadingLines) {
    doc.text(line, totalsBlockLeftMm + totPad, totY)
    totY += PDF_LINE_STEP_MM
  }
  doc.setTextColor(0, 0, 0)
  totY += 2

  function drawTotalsRowPair(
    labelLines: string[],
    amountLines: string[],
    labelGrey: boolean,
    lineStepMm: number,
  ) {
    const rowTop = totY
    if (labelGrey) {
      doc.setTextColor(90, 90, 90)
    } else {
      doc.setTextColor(0, 0, 0)
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    let yL = rowTop
    for (const part of labelLines) {
      doc.text(part, totalsBlockLeftMm + totPad, yL)
      yL += lineStepMm
    }
    doc.setTextColor(0, 0, 0)
    let yR = rowTop
    for (const part of amountLines) {
      doc.text(part, contentRightMm - totPad, yR, { align: 'right' })
      yR += lineStepMm
    }
    totY = Math.max(yL, yR)
  }

  drawTotalsRowPair(subLabelLines, subAmountLines, true, LINE_HEIGHT_MM)
  totY += 1
  drawTotalsRowPair(vatLabelLines, vatAmountLines, true, LINE_HEIGHT_MM)
  totY += 4

  doc.setDrawColor(228, 228, 231)
  doc.line(totalsBlockLeftMm + totPad, totY, contentRightMm - totPad, totY)
  totY += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  const grandTop = totY
  let yGrandL = grandTop
  for (const part of grandLabelLines) {
    doc.text(part, totalsBlockLeftMm + totPad, yGrandL)
    yGrandL += grandStepMm
  }
  let yGrandR = grandTop
  for (const part of grandAmountLines) {
    doc.text(part, contentRightMm - totPad, yGrandR, { align: 'right' })
    yGrandR += grandStepMm
  }
  totY = Math.max(yGrandL, yGrandR)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  cursorYMm = totalsBoxTop + totalsBlockHeightMm + SECTION_TOP_MARGIN_MM

  // ----- Notes -----
  const notesTrimmed = invoiceDocument.notes.trim()
  if (notesTrimmed) {
    ensureRoomForBlock(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(p.notes, PAGE_MARGIN_MM, cursorYMm)
    moveDown(7)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const noteLines = doc.splitTextToSize(notesTrimmed, contentWidthMm)
    for (const textLine of noteLines) {
      ensureRoomForBlock(LINE_HEIGHT_MM)
      doc.text(textLine, PAGE_MARGIN_MM, cursorYMm)
      moveDown(LINE_HEIGHT_MM * 0.9)
    }
    moveDown(SECTION_TOP_MARGIN_MM)
  }

  // ----- Mobile Pay -----
  const mobilePayTrimmed = invoiceDocument.mobilePayNumberOrBox.trim()
  if (mobilePayTrimmed) {
    ensureRoomForBlock(20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(p.mobilePay, PAGE_MARGIN_MM, cursorYMm)
    moveDown(7)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const mobileLines = doc.splitTextToSize(mobilePayTrimmed, contentWidthMm)
    for (const textLine of mobileLines) {
      ensureRoomForBlock(LINE_HEIGHT_MM)
      doc.text(textLine, PAGE_MARGIN_MM, cursorYMm)
      moveDown(LINE_HEIGHT_MM * 0.9)
    }
    moveDown(SECTION_TOP_MARGIN_MM)
  }

  // ----- Payment details (two-column grid like preview) -----
  ensureRoomForBlock(40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(p.paymentDetails, PAGE_MARGIN_MM, cursorYMm)
  moveDown(8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const payment = invoiceDocument.paymentDetails
  const halfW = (contentWidthMm - 6) / 2
  const payCol1X = PAGE_MARGIN_MM
  const payCol2X = PAGE_MARGIN_MM + halfW + 6
  const payColW = halfW - 4

  cursorYMm = writePaymentTwoColumnRow(doc, cursorYMm, pageHeightMm, payCol1X, payCol2X, payColW, {
    left:
      payment.bankName.trim() !== ''
        ? { label: p.bank, value: payment.bankName }
        : null,
    right:
      payment.registrationNumber.trim() !== ''
        ? { label: p.registrationNumber, value: payment.registrationNumber }
        : null,
  })
  cursorYMm = writePaymentTwoColumnRow(doc, cursorYMm, pageHeightMm, payCol1X, payCol2X, payColW, {
    left:
      payment.accountNumber.trim() !== ''
        ? { label: p.accountNumber, value: payment.accountNumber }
        : null,
    right:
      payment.accountHolder.trim() !== ''
        ? { label: p.accountHolder, value: payment.accountHolder }
        : null,
  })
  cursorYMm = writePaymentTwoColumnRow(doc, cursorYMm, pageHeightMm, payCol1X, payCol2X, payColW, {
    left: payment.iban.trim() !== '' ? { label: p.iban, value: payment.iban } : null,
    right:
      payment.bicOrSwift.trim() !== ''
        ? { label: p.bicSwift, value: payment.bicOrSwift }
        : null,
  })
  cursorYMm = writePaymentFieldBlockIfPresent(
    doc,
    cursorYMm,
    pageHeightMm,
    PAGE_MARGIN_MM,
    contentWidthMm,
    p.paymentRef,
    payment.paymentReference,
  )

  doc.save(buildPdfFileName(invoiceDocument))
}

/** Name and address only (CVR / VAT added separately). */
function buildContactLines(party: PartyContact): string[] {
  const lines: string[] = []
  const name = party.name.trim()
  if (name) lines.push(name)
  const address = party.address.trim()
  if (address) {
    lines.push(...address.split('\n').map((part) => part.trim()).filter(Boolean))
  }
  return lines
}

function buildSellerPdfLines(
  seller: SellerParty,
  invoiceType: InvoiceDocument['invoiceType'],
  p: TranslationMessages['preview'],
): string[] {
  const lines = buildContactLines(seller)
  if (seller.sellerType !== 'company') return lines
  if (invoiceType === 'domestic_dk') {
    const sellerCvr = seller.sellerCvrNumber.trim()
    if (sellerCvr) lines.push(`${p.cvrLabel}: ${sellerCvr}`)
    return lines
  }
  const vat = seller.vatNumber.trim()
  if (vat) lines.push(`${p.vatNoLabel}: ${vat}`)
  return lines
}

function buildClientPdfLines(
  client: ClientParty,
  invoiceType: InvoiceDocument['invoiceType'],
  p: TranslationMessages['preview'],
): string[] {
  const lines = buildContactLines(client)
  if (client.clientType !== 'company') return lines
  if (invoiceType === 'domestic_dk') {
    if (client.clientCvrNumber.trim()) lines.push(`${p.cvrLabel}: ${client.clientCvrNumber.trim()}`)
    return lines
  }
  if (client.vatNumber.trim()) lines.push(`${p.vatNoLabel}: ${client.vatNumber.trim()}`)
  return lines
}

/**
 * One payment field: small grey label, then value (wrapped). Returns the next Y position.
 * Handles page breaks using the same bottom margin as the rest of the PDF.
 */
function writePaymentFieldBlock(
  pdfDoc: jsPDF,
  startYMm: number,
  pageHeightMm: number,
  marginMm: number,
  maxWidthMm: number,
  label: string,
  value: string,
): number {
  let yMm = startYMm
  const displayValue = value.trim()
  if (!displayValue) return yMm

  function ensureRoomForPaymentLine(lineHeightMm: number) {
    if (yMm + lineHeightMm > pageHeightMm - PAGE_MARGIN_MM) {
      pdfDoc.addPage()
      yMm = PAGE_MARGIN_MM
    }
  }

  ensureRoomForPaymentLine(LINE_HEIGHT_MM * 2)
  pdfDoc.setFont('helvetica', 'bold')
  pdfDoc.setFontSize(9)
  pdfDoc.setTextColor(90, 90, 90)
  const labelChunks = pdfSplitLines(pdfDoc, `${label}:`, maxWidthMm)
  for (const chunk of labelChunks) {
    ensureRoomForPaymentLine(LINE_HEIGHT_MM)
    pdfDoc.text(chunk, marginMm, yMm)
    yMm += LINE_HEIGHT_MM * 0.9
  }
  pdfDoc.setFont('helvetica', 'normal')
  pdfDoc.setTextColor(0, 0, 0)
  pdfDoc.setFontSize(10)
  yMm += LINE_HEIGHT_MM * 0.2

  const wrappedLines = pdfDoc.splitTextToSize(displayValue, maxWidthMm)
  for (const textLine of wrappedLines) {
    ensureRoomForPaymentLine(LINE_HEIGHT_MM)
    pdfDoc.text(textLine, marginMm, yMm)
    yMm += LINE_HEIGHT_MM * 0.9
  }

  return yMm + 3
}

function writePaymentFieldBlockIfPresent(
  pdfDoc: jsPDF,
  startYMm: number,
  pageHeightMm: number,
  marginMm: number,
  maxWidthMm: number,
  label: string,
  value: string,
): number {
  if (!value.trim()) return startYMm
  return writePaymentFieldBlock(pdfDoc, startYMm, pageHeightMm, marginMm, maxWidthMm, label, value)
}

function writePaymentTwoColumnRow(
  pdfDoc: jsPDF,
  startYMm: number,
  pageHeightMm: number,
  col1X: number,
  col2X: number,
  colW: number,
  row: {
    left: { label: string; value: string } | null
    right: { label: string; value: string } | null
  },
): number {
  if (!row.left && !row.right) return startYMm
  const y1 = row.left
    ? writePaymentFieldBlock(
        pdfDoc,
        startYMm,
        pageHeightMm,
        col1X,
        colW,
        row.left.label,
        row.left.value,
      )
    : startYMm
  const y2 = row.right
    ? writePaymentFieldBlock(
        pdfDoc,
        startYMm,
        pageHeightMm,
        col2X,
        colW,
        row.right.label,
        row.right.value,
      )
    : startYMm
  return Math.max(y1, y2) + 2
}